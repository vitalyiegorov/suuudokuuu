import ExpoModulesCore

public final class HardwareKeyboardModule: Module {
  public func definition() -> ModuleDefinition {
    Name("hardware-keyboard")

    View(HardwareKeyboardView.self) {
      Events("onKeyPress")

      Prop("active") { (view: HardwareKeyboardView, active: Bool) in
        view.active = active
      }
    }
  }
}
