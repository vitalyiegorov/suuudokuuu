import ExpoModulesCore
import UIKit

final class HardwareKeyboardView: ExpoView {
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
    guard active else { return nil }

    return (["1", "2", "3", "4", "5", "6", "7", "8", "9", " ", "\u{7F}",
      UIKeyCommand.inputUpArrow, UIKeyCommand.inputDownArrow,
      UIKeyCommand.inputLeftArrow, UIKeyCommand.inputRightArrow, UIKeyCommand.inputEscape, UIKeyCommand.inputDelete]
    ).map { input in
      let command = UIKeyCommand(input: input, modifierFlags: [], action: #selector(handleKeyCommand))
      command.wantsPriorityOverSystemBehavior = true
      command.allowsAutomaticLocalization = false
      command.allowsAutomaticMirroring = false
      return command
    }
  }

  override func didMoveToWindow() {
    super.didMoveToWindow()
    if window != nil && active {
      becomeFirstResponder()
    }
  }

  @objc private func handleKeyCommand(_ command: UIKeyCommand) {
    guard active, let input = command.input else { return }

    switch input {
    case UIKeyCommand.inputUpArrow: onKeyPress(["key": "ArrowUp"])
    case UIKeyCommand.inputDownArrow: onKeyPress(["key": "ArrowDown"])
    case UIKeyCommand.inputLeftArrow: onKeyPress(["key": "ArrowLeft"])
    case UIKeyCommand.inputRightArrow: onKeyPress(["key": "ArrowRight"])
    case UIKeyCommand.inputEscape: onKeyPress(["key": "Escape"])
    case UIKeyCommand.inputDelete: onKeyPress(["key": "Backspace"])
    case "\u{7F}": onKeyPress(["key": "Delete"])
    default: onKeyPress(["key": input])
    }
  }
}
