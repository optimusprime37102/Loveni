/**
 * Pick a physical USB Android device when an emulator is also connected.
 * Emulators are skipped (serial starts with "emulator-").
 */
const { execFileSync } = require('child_process');

function listDevices() {
  const out = execFileSync('adb', ['devices'], { encoding: 'utf8' });
  return out
    .split(/\r?\n/)
    .slice(1)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [serial, state] = line.split(/\s+/);
      return { serial, state };
    })
    .filter((d) => d.state === 'device');
}

function getUsbSerial() {
  const devices = listDevices();
  const usb = devices.filter((d) => !d.serial.startsWith('emulator-'));
  if (usb.length === 0) {
    throw new Error(
      'No USB Android phone found. Connect the phone with USB debugging on, then run: adb devices',
    );
  }
  if (usb.length > 1) {
    process.stderr.write(
      `Multiple USB devices found; using ${usb[0].serial}. Set ANDROID_SERIAL to override.\n`,
    );
  }
  return process.env.ANDROID_SERIAL && !process.env.ANDROID_SERIAL.startsWith('emulator-')
    ? process.env.ANDROID_SERIAL
    : usb[0].serial;
}

function adb(serial, args) {
  return execFileSync('adb', ['-s', serial, ...args], {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });
}

module.exports = { listDevices, getUsbSerial, adb };

if (require.main === module) {
  const cmd = process.argv[2] || 'serial';
  try {
    const serial = getUsbSerial();
    if (cmd === 'serial') {
      process.stdout.write(`${serial}\n`);
      process.exit(0);
    }
    if (cmd === 'reverse') {
      adb(serial, ['reverse', 'tcp:8081', 'tcp:8081']);
      process.stdout.write(`adb reverse on ${serial}: tcp:8081 -> tcp:8081\n`);
      process.exit(0);
    }
    if (cmd === 'uninstall') {
      const pkg = process.argv[3] || 'com.loveni.app';
      try {
        adb(serial, ['uninstall', pkg]);
        process.stdout.write(`Uninstalled ${pkg} from ${serial}\n`);
      } catch {
        process.stdout.write(`Nothing to uninstall (${pkg}) on ${serial}\n`);
      }
      process.exit(0);
    }
    throw new Error(`Unknown command: ${cmd}`);
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  }
}
