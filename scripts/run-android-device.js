/**
 * Prep USB Metro reverse, then let Expo show the device picker
 * (same UX as `expo run:android --device`).
 */
const { spawnSync } = require('child_process');
const path = require('path');
const { listDevices, adb } = require('./adb-usb');

function reverseUsbDevices() {
  const usb = listDevices().filter((d) => !d.serial.startsWith('emulator-'));
  if (usb.length === 0) {
    process.stdout.write(
      'No USB phone found for adb reverse (emulator-only is fine; Expo picker will still open).\n',
    );
    return;
  }
  for (const device of usb) {
    adb(device.serial, ['reverse', 'tcp:8081', 'tcp:8081']);
    process.stdout.write(`adb reverse on ${device.serial}: tcp:8081 -> tcp:8081\n`);
  }
}

function main() {
  reverseUsbDevices();

  const env = {
    ...process.env,
    REACT_NATIVE_PACKAGER_HOSTNAME: '127.0.0.1',
  };
  // Do not set ANDROID_SERIAL — Expo needs that unset to show the picker.
  delete env.ANDROID_SERIAL;

  const expoCli = require.resolve('expo/bin/cli');
  const result = spawnSync(
    process.execPath,
    [expoCli, 'run:android', '--device'],
    {
      env,
      stdio: 'inherit',
      cwd: path.resolve(__dirname, '..'),
      shell: false,
    },
  );

  process.exit(result.status == null ? 1 : result.status);
}

main();
