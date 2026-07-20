#!/bin/bash
# Recoverable Maestro iOS driver failures: accessibility snapshot corruption
# (kAXErrorInvalidUIElement), driver startup timeouts, and dead driver ports
# (Maestro issues #3254 / #3318 on iOS 26). Plain assertion/element failures
# must NOT match — those are real test results.
export MAESTRO_RECOVERABLE_FAILURE_PATTERN='kAXErrorInvalidUIElement|iOS driver not ready|Connection refused|SocketTimeoutException'
