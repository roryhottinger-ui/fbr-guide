import { Linking } from 'react-native';

/** Open an external URL in the system browser. Safe no-op on failure. */
export async function openExternal(url: string): Promise<void> {
  try {
    await Linking.openURL(url);
  } catch {
    // Swallow — the app remains fully usable offline; links are a convenience.
  }
}
