#!/usr/bin/env bash

set -euo pipefail

script_directory="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
app_tests_directory="$(dirname -- "$script_directory")"
repository_directory="$(cd -- "$app_tests_directory/../.." && pwd)"

ruby - "$app_tests_directory/flows" "$repository_directory/packages/app/src" <<'RUBY'
require 'yaml'

flows_directory = ARGV.fetch(0)
app_source_directory = ARGV.fetch(1)
relative_path = lambda { |path| path.delete_prefix("#{flows_directory}/") }
all_flow_paths = Dir.glob(File.join(flows_directory, '**/*.flow.yaml'))

recovery_flow_paths = %w[
  subflows/navigation/accept-open-link-prompt.flow.yaml
  subflows/navigation/close-dev-menu-if-visible.flow.yaml
  subflows/navigation/ensure-home-visible.flow.yaml
  subflows/navigation/launch-home.flow.yaml
  subflows/navigation/move-dev-tools-button-away-if-visible.flow.yaml
  subflows/navigation/open-dev-client-url-manually-if-needed.flow.yaml
  subflows/navigation/relaunch-home.flow.yaml
  subflows/navigation/reload-dev-client-project-if-needed.flow.yaml
]

native_boundary_text_selectors = {
  '04.statistics-screen.flow.yaml' => ['Stats'],
  '05.settings-screen.flow.yaml' => ['Settings'],
  'subflows/game/quit-current-game.flow.yaml' => ['OK'],
  'subflows/shared/open-shared-challenge.flow.yaml' => ['Open']
}

native_boundary_press_keys = {
  '07.background-foreground-game.flow.yaml' => ['Home']
}

violations = []
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
      elsif key == 'id' && child.is_a?(String) && !child.include?('${')
        selector_ids << [flow_path, child]
      end
      walk.call(child, flow_path)
    end
  end
end

app_owned_flow_paths.each do |flow_path|
  flow_relative_path = relative_path.call(flow_path)
  load_yaml_documents.call(flow_path).each { |flow| walk.call(flow, flow_relative_path) }
end

app_source = Dir.glob(File.join(app_source_directory, '**/*.{ts,tsx}')).map { |path| File.read(path) }.join("\n")
selector_ids.uniq.each do |flow_path, selector_id|
  selector_literal_exists = app_source.include?("'#{selector_id}'") || app_source.include?("\"#{selector_id}\"")
  violations << "#{flow_path}: id selector #{selector_id.inspect} is not declared in app source" unless selector_literal_exists
end

unless violations.empty?
  abort "Maestro selector policy violations:\n#{violations.join("\n")}"
end

puts "Validated app-owned selector policy for #{app_owned_flow_paths.length} flows; recovery and native-boundary exceptions are explicit."
RUBY
