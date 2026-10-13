#!/usr/bin/env bash

set -euo pipefail

script_directory="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
app_tests_directory="$(dirname -- "$script_directory")"
repository_directory="$(cd -- "$app_tests_directory/../.." && pwd)"

ruby - "$app_tests_directory/flows" "$repository_directory/packages/app/src" "$app_tests_directory" <<'RUBY'
require 'yaml'

flows_directory = ARGV.fetch(0)
app_source_directory = ARGV.fetch(1)
relative_path = lambda { |path| path.delete_prefix("#{flows_directory}/") }
all_flow_paths = Dir.glob(File.join(flows_directory, '**/*.flow.yaml'))

recovery_flow_paths = %w[
  subflows/navigation/launch-home.flow.yaml
  subflows/navigation/relaunch-home.flow.yaml
  setup/prime-deep-links.flow.yaml
]

native_boundary_text_selectors = {
  'subflows/game/quit-current-game.flow.yaml' => ['OK|Гаразд|حسنًا|ঠিক আছে|ठीक है|ٹھیک ہے|确定'],
  'screenshots/subflows/reset-app.flow.yaml' => ['^Open$']
}

native_boundary_press_keys = {
  '07.background-foreground-game.flow.yaml' => ['Home'],
  '09.challenge-mode-run.flow.yaml' => ['Home'],
  'subflows/game/pause-current-game.flow.yaml' => ['Home'],
  'screenshots/11.pause.flow.yaml' => ['Home']
}

violations = []
app_tests_directory = ARGV.fetch(2)
config = YAML.safe_load(File.read(File.join(app_tests_directory, 'config.yaml')), permitted_classes: [], aliases: false)
configured_flows = config.dig('executionOrder', 'flowsOrder')
abort 'Expected executionOrder.flowsOrder to be an array' unless configured_flows.is_a?(Array)
actual_flows = Dir.glob(File.join(flows_directory, '*.flow.yaml')).map { |path| File.basename(path, '.yaml') }.sort
violations << 'executionOrder.flowsOrder must name every top-level flow exactly once' unless actual_flows == configured_flows.sort
sharded_flows = %w[shard-0.txt shard-1.txt].flat_map do |name|
  paths = File.readlines(File.join(app_tests_directory, 'shards', name), chomp: true)
  violations << "Empty shard manifest: #{name}" if paths.empty?
  paths
end
violations << 'Shard manifests must name every configured flow exactly once' unless sharded_flows.sort == configured_flows.map { |flow| "#{flow}.yaml" }.sort
selector_ids = []
app_owned_flow_paths = all_flow_paths.reject { |flow_path| recovery_flow_paths.include?(relative_path.call(flow_path)) }
coordinate_fields = %w[point coordinates x y start end]

yaml_node_to_value = lambda do |node|
  case node
  when Psych::Nodes::Mapping
    node.children.each_slice(2).each_with_object({}) do |(key_node, value_node), mapping|
      mapping[yaml_node_to_value.call(key_node)] = yaml_node_to_value.call(value_node)
    end
  when Psych::Nodes::Sequence
    node.children.map { |child| yaml_node_to_value.call(child) }
  when Psych::Nodes::Scalar
    node.value
  else
    abort "Unsupported YAML node #{node.class}"
  end
end

load_yaml_documents = lambda do |flow_path|
  contents = File.read(flow_path)
  if YAML.respond_to?(:safe_load_stream)
    YAML.safe_load_stream(contents, permitted_classes: [], aliases: false)
  else
    YAML.parse_stream(contents).children.map { |document| yaml_node_to_value.call(document.root) }
  end
end

walk = lambda do |value, flow_path|
  case value
  when Array
    value.each { |child| walk.call(child, flow_path) }
  when Hash
    value.each do |key, child|
      if key == 'pressKey'
        allowed_native_boundary_press_key = native_boundary_press_keys.fetch(flow_path, []).include?(child)
        violations << "#{flow_path}: pressKey is prohibited in app-owned flows (found #{child.inspect})" unless allowed_native_boundary_press_key
      elsif %w[tapOn longPressOn].include?(key) && child.is_a?(Hash) && child.keys.any? { |child_key| coordinate_fields.include?(child_key) }
        violations << "#{flow_path}: coordinate interaction is prohibited in app-owned flows (found #{key}: #{child.inspect})"
      elsif key == 'swipe' && child.is_a?(Hash) && (child.key?('start') || child.key?('end'))
        violations << "#{flow_path}: coordinate interaction is prohibited in app-owned flows (found swipe: #{child.inspect})"
      elsif key == 'tapOn'
        allowed_native_boundary_text = native_boundary_text_selectors.fetch(flow_path, []).include?(child) && child.is_a?(String)
        selector_is_id = child.is_a?(Hash) && child['id'].is_a?(String) && !child['id'].empty?
        violations << "#{flow_path}: tapOn must use an id selector (found #{child.inspect})" unless allowed_native_boundary_text || selector_is_id
      elsif key == 'extendedWaitUntil' && child.is_a?(Hash) && child['optional'].to_s == 'true' && child['timeout'].to_i > 5000
        violations << "#{flow_path}: optional: true must not be combined with an extendedWaitUntil timeout above 5000 (found #{child['timeout']})"
      elsif key == 'id' && child.is_a?(String) && !child.include?('${')
        selector_ids << [flow_path, child]
      end
      walk.call(child, flow_path)
    end
  end
end

walk_references = lambda do |value, source_path|
  case value
  when Array
    value.each { |child| walk_references.call(child, source_path) }
  when Hash
    value.each do |key, child|
      if %w[runFlow runScript].include?(key)
        referenced_path = child.is_a?(Hash) ? child['file'] : child
        if referenced_path.is_a?(String) && !referenced_path.include?('${')
          resolved_path = File.expand_path(referenced_path, File.dirname(source_path))
          violations << "#{source_path}: missing #{key} target #{referenced_path}" unless File.file?(resolved_path)
        end
      end
      walk_references.call(child, source_path)
    end
  end
end

Dir.glob(File.join(app_tests_directory, '**/*.yaml')).each do |flow_path|
  load_yaml_documents.call(flow_path).each do |flow|
    walk_references.call(flow, flow_path)
    walk.call(flow, relative_path.call(flow_path)) if app_owned_flow_paths.include?(flow_path)
  end
end

%w[subflows/navigation/launch-home.flow.yaml subflows/navigation/relaunch-home.flow.yaml].each do |flow_path|
  contents = File.read(File.join(flows_directory, flow_path))
  violations << "#{flow_path}: launch flows must not open URLs" if contents.include?('openLink')
end

business_flow_paths = Dir.glob(File.join(flows_directory, '*.flow.yaml'))
business_flow_paths.each do |flow_path|
  contents = File.read(flow_path)
  unless contents.include?('HomeScreenSelectors.Root') || contents.include?('subflows/game/quit-current-game.flow.yaml')
    violations << "#{relative_path.call(flow_path)}: top-level flows must assert the Home teardown contract"
  end
  violations << "#{relative_path.call(flow_path)}: native Open prompt handling belongs in setup/prime-deep-links.flow.yaml" if contents.match?(/visible:\s*['\"]?(?:\^)?Open/)
end

app_source = Dir.glob(File.join(app_source_directory, '**/*.{ts,tsx}')).map { |path| File.read(path) }.join("\n")
selector_ids.uniq.each do |flow_path, selector_id|
  selector_declaration = selector_id.gsub('\\.', '.')[/\A\w+\.\w+/] || selector_id[/\A\w+/]
  selector_literal_exists = %w[' " `].any? { |quote| app_source.include?("#{quote}#{selector_declaration}") }
  violations << "#{flow_path}: id selector #{selector_id.inspect} is not declared in app source" unless selector_literal_exists
end

unless violations.empty?
  abort "Maestro selector policy violations:\n#{violations.join("\n")}"
end

puts "Validated flow inventory, shard manifests, file references, Home teardown and app-owned selector policy for #{app_owned_flow_paths.length} flows; recovery and native-boundary exceptions are explicit."
RUBY
