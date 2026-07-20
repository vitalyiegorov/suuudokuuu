#!/bin/bash
# Prewarm Redroid (Android-in-container) in the LINUX CI guest image.
# Google ships no emulator for arm64 Linux, and nested-KVM boots proved
# unstable on this host, so Android runs as a container instead: native
# arm64 speed, binder kernel module, no virtualization inside the guest.
# Android 14 images hard-lock the 6.17 guest kernel and 13 never boots;
# 15.0.0_64only is the verified-good tag (apps must ship arm64-v8a).
# Bakes: docker + binder autoload + pulled image + a prewarmed /data volume
# (first boot completed, animations off) + a manifest for CI jobs.
set -euo pipefail

REDROID_IMAGE='redroid/redroid:15.0.0_64only-latest'
DATA_DIR="$HOME/redroid-data"
MANIFEST_DIR="$HOME/.sudoku-ci"
sudo apt-get update -qq
sudo DEBIAN_FRONTEND=noninteractive apt-get install -y -qq docker.io adb >/dev/null
ADB=$(command -v adb)
sudo usermod -aG docker "$USER"

# binder must load on every boot; redroid 12+ needs no ashmem. On binderfs
# kernels (6.x) no /dev/binder appears on the host — the privileged container
# mounts binderfs itself, so only the module needs to be present.
echo binder_linux | sudo tee /etc/modules-load.d/redroid.conf >/dev/null
sudo modprobe binder_linux
test -d /sys/module/binder_linux

sudo docker pull "$REDROID_IMAGE"

echo "First boot to prewarm the data volume"
mkdir -p "$DATA_DIR"
sudo docker rm -f redroid-prewarm >/dev/null 2>&1 || true
sudo docker run -d --name redroid-prewarm --privileged \
    -v "$DATA_DIR":/data -p 5555:5555 \
    "$REDROID_IMAGE" androidboot.redroid_gpu_mode=guest

for _ in $(seq 1 120); do
    "$ADB" connect localhost:5555 >/dev/null 2>&1 || true
    [ "$("$ADB" -s localhost:5555 shell getprop sys.boot_completed 2>/dev/null | tr -d '\r')" = "1" ] && break
    sleep 5
done
[ "$("$ADB" -s localhost:5555 shell getprop sys.boot_completed | tr -d '\r')" = "1" ] || { echo "FATAL: redroid never finished booting" >&2; exit 1; }

"$ADB" -s localhost:5555 shell settings put global window_animation_scale 0
"$ADB" -s localhost:5555 shell settings put global transition_animation_scale 0
"$ADB" -s localhost:5555 shell settings put global animator_duration_scale 0

"$ADB" disconnect localhost:5555 || true
sudo docker stop redroid-prewarm
sudo docker rm redroid-prewarm
IMAGE_DIGEST=$(sudo docker inspect --format '{{index .RepoDigests 0}}' "$REDROID_IMAGE" 2>/dev/null || echo "$REDROID_IMAGE")

mkdir -p "$MANIFEST_DIR"
cat > "$MANIFEST_DIR/android-emulator.json" <<JSON
{
  "type": "redroid",
  "image": "$REDROID_IMAGE",
  "imageDigest": "$IMAGE_DIGEST",
  "dataDir": "$DATA_DIR",
  "adbSerial": "localhost:5555",
  "gpuMode": "guest",
  "animationsDisabled": true
}
JSON
echo "Redroid prewarm complete:"
cat "$MANIFEST_DIR/android-emulator.json"
