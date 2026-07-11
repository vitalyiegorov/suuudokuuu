#!/usr/bin/env bash

set -euo pipefail

script_directory="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
app_tests_directory="$(dirname -- "$script_directory")"

ruby - "$app_tests_directory/config.yaml" "$app_tests_directory/flows" <<'RUBY'
require 'yaml'

config_path = ARGV.fetch(0)
flows_directory = ARGV.fetch(1)
config = YAML.safe_load(File.read(config_path), permitted_classes: [], aliases: false)
configured_flows = config.dig('executionOrder', 'flowsOrder')
actual_flows = Dir.glob(File.join(flows_directory, '*.flow.yaml')).map { |path| File.basename(path, '.yaml') }.sort

unless configured_flows.is_a?(Array)
  abort "Expected executionOrder.flowsOrder to be an array in #{config_path}"
end

configured_counts = configured_flows.each_with_object(Hash.new(0)) do |flow, counts|
  counts[flow] += 1
end
duplicate_flows = configured_counts.select { |_flow, count| count > 1 }.keys.sort
missing_flows = actual_flows - configured_counts.keys
unknown_flows = configured_counts.keys - actual_flows

failures = []
failures << "duplicate flows: #{duplicate_flows.join(', ')}" unless duplicate_flows.empty?
failures << "missing flows: #{missing_flows.join(', ')}" unless missing_flows.empty?
failures << "unknown flows: #{unknown_flows.join(', ')}" unless unknown_flows.empty?

unless failures.empty?
  abort "Maestro flow inventory mismatch (#{failures.join('; ')})"
end

puts "Validated #{actual_flows.length} top-level Maestro flows; each appears exactly once in executionOrder.flowsOrder."

reference_failures = []
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
          reference_failures << "#{source_path}: missing #{key} target #{referenced_path}" unless File.file?(resolved_path)
        end
      end
      walk_references.call(child, source_path)
    end
  end
end

Dir.glob(File.join(File.dirname(config_path), '**/*.yaml')).each do |source_path|
  YAML.load_stream(File.read(source_path)).each { |document| walk_references.call(document, source_path) }
end

abort "Maestro file reference failures:\n#{reference_failures.join("\n")}" unless reference_failures.empty?

puts 'Validated Maestro runFlow and runScript file references.'
RUBY
