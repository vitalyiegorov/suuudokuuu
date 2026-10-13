import ExpoModulesCore
import UIKit

final class HardwareKeyboardView: ExpoView {
  private static let namedKeys = [
    UIKeyCommand.inputUpArrow: "ArrowUp",
    UIKeyCommand.inputDownArrow: "ArrowDown",
    UIKeyCommand.inputLeftArrow: "ArrowLeft",
    UIKeyCommand.inputRightArrow: "ArrowRight",
    UIKeyCommand.inputEscape: "Escape"
  ]
  private static let inputs = ["1", "2", "3", "4", "5", "6", "7", "8", "9", " "] + namedKeys.keys

  let onKeyPress = EventDispatcher()
  var active = false {
    didSet {
      if active {
        becomeFirstResponder()
      } else {
        resignFirstResponder()
      }
    }
  }

  override var canBecomeFirstResponder: Bool { active }

  override var keyCommands: [UIKeyCommand]? {
    guard active, isFrontmost else { return nil }

    return Self.inputs.map { input in
      let command = UIKeyCommand(input: input, modifierFlags: [], action: #selector(handleKeyCommand))
      command.wantsPriorityOverSystemBehavior = true
      command.allowsAutomaticLocalization = false
      command.allowsAutomaticMirroring = false
      return command
    }
  }

  override func didMoveToWindow() {
    super.didMoveToWindow()
    NotificationCenter.default.removeObserver(self, name: UIWindow.didBecomeKeyNotification, object: nil)
    guard let window else { return }

    NotificationCenter.default.addObserver(self, selector: #selector(refocus), name: UIWindow.didBecomeKeyNotification, object: window)
    refocus()
  }

  private var isFrontmost: Bool {
    var frontmostController = window?.rootViewController
    while let presentedController = frontmostController?.presentedViewController {
      frontmostController = presentedController
    }
    guard let frontmostView = frontmostController?.view else { return false }

    return isDescendant(of: frontmostView)
  }

  @objc private func refocus() {
    if active {
      becomeFirstResponder()
    }
  }

  @objc private func handleKeyCommand(_ command: UIKeyCommand) {
    guard isFrontmost, let input = command.input else { return }

    onKeyPress(["key": Self.namedKeys[input] ?? input])
  }
}
