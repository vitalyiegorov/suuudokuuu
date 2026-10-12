Pod::Spec.new do |spec|
  spec.name = 'HardwareKeyboard'
  spec.version = '1.0.0'
  spec.summary = 'Hardware keyboard responder for the Sudoku board'
  spec.description = spec.summary
  spec.license = 'MIT'
  spec.author = 'Suuudokuuu'
  spec.homepage = 'https://github.com/vitalyiegorov/suuudokuuu'
  spec.platform = :ios, '16.4'
  spec.source = { git: 'https://github.com/vitalyiegorov/suuudokuuu' }
  spec.static_framework = true
  spec.dependency 'ExpoModulesCore'
  spec.source_files = '**/*.swift'
  spec.pod_target_xcconfig = { 'DEFINES_MODULE' => 'YES' }
end
