// ─────────────────────────────────────────────────────────────
// Local timeline-reminder notifications (Phase 6, Task 6.3).
// All local — no push server. Reminds the user to check their FBR
// status once they reach the typical processing window.
// ─────────────────────────────────────────────────────────────

import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

import { timelines } from '@/content/timelines';

const APPROX_MONTH_SECONDS = 30 * 24 * 60 * 60;

export async function ensureNotificationPermission(): Promise<boolean> {
  const { status } = await Notifications.getPermissionsAsync();
  if (status === 'granted') return true;
  const req = await Notifications.requestPermissionsAsync();
  return req.status === 'granted';
}

/**
 * Schedule a reminder to check application status, fired `offsetMonths` after
 * the submission date. Pass a small `testOffsetSeconds` to verify locally.
 * Returns the scheduled notification id, or null if permission was denied.
 */
export async function scheduleStatusReminder(
  submittedISO: string,
  opts: { offsetMonths?: number; testOffsetSeconds?: number } = {},
): Promise<string | null> {
  const granted = await ensureNotificationPermission();
  if (!granted) return null;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('fbr-reminders', {
      name: 'FBR reminders',
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }

  const offsetMonths = opts.offsetMonths ?? timelines.statusCheckAfterMonths;
  const submittedMs = new Date(submittedISO).getTime();
  const fireMs = opts.testOffsetSeconds
    ? Date.now() + opts.testOffsetSeconds * 1000
    : submittedMs + offsetMonths * APPROX_MONTH_SECONDS * 1000;

  // If the target time is already in the past, fire shortly so the user still
  // gets a useful nudge.
  const seconds = Math.max(5, Math.round((fireMs - Date.now()) / 1000));

  return Notifications.scheduleNotificationAsync({
    content: {
      title: 'Time to check your FBR application',
      body: `It's been about ${offsetMonths} months. You can check your status via the DFA webchat on ireland.ie.`,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds,
    },
  });
}

export async function cancelAllReminders(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}
