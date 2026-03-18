import { Platform } from 'react-native';

import type { AppLanguage } from '@/context/preferences-context';

const GOOD_MORNING_KIND = 'daily-good-morning';
const ANDROID_CHANNEL_ID = 'daily-reminders-v2';

type NotificationsModule = typeof import('expo-notifications');

let notificationsModulePromise: Promise<NotificationsModule | null> | null = null;

async function getNotificationsModule(): Promise<NotificationsModule | null> {
  if (Platform.OS === 'web') {
    return null;
  }

  if (!notificationsModulePromise) {
    notificationsModulePromise = (async () => {
      try {
        const module = await import('expo-notifications');

        module.setNotificationHandler({
          handleNotification: async () => ({
            shouldShowBanner: true,
            shouldShowList: true,
            shouldPlaySound: false,
            shouldSetBadge: false,
          }),
        });

        return module;
      } catch {
        return null;
      }
    })();
  }

  return notificationsModulePromise;
}

function getGoodMorningCopy(language: AppLanguage) {
  if (language === 'pl') {
    return {
      title: 'Dzień dobry!',
      body: 'Miłego dnia!',
    };
  }

  return {
    title: 'Good morning!',
    body: 'Have a great day!',
  };
}

async function ensurePermissions(notifications: NotificationsModule): Promise<boolean> {
  const permissionStatus = await notifications.getPermissionsAsync();

  if (permissionStatus.granted) {
    return true;
  }

  const requestedStatus = await notifications.requestPermissionsAsync();
  return requestedStatus.granted;
}

async function ensureAndroidChannel(notifications: NotificationsModule): Promise<void> {
  if (Platform.OS !== 'android') {
    return;
  }

  await notifications.setNotificationChannelAsync(ANDROID_CHANNEL_ID, {
    name: 'Daily reminders',
    importance: notifications.AndroidImportance.DEFAULT,
  });
}

async function cancelExistingGoodMorningNotifications(notifications: NotificationsModule): Promise<void> {
  const scheduledNotifications = await notifications.getAllScheduledNotificationsAsync();
  const goodMorningNotifications = scheduledNotifications.filter(
    (request) => request.content.data?.kind === GOOD_MORNING_KIND
  );

  await Promise.all(
    goodMorningNotifications.map((request) =>
      notifications.cancelScheduledNotificationAsync(request.identifier)
    )
  );
}

export async function scheduleDailyGoodMorningNotification(language: AppLanguage): Promise<void> {
  const notifications = await getNotificationsModule();
  if (!notifications) {
    return;
  }

  const hasPermission = await ensurePermissions(notifications);
  if (!hasPermission) {
    return;
  }

  await ensureAndroidChannel(notifications);
  await cancelExistingGoodMorningNotifications(notifications);

  const copy = getGoodMorningCopy(language);

  await notifications.scheduleNotificationAsync({
    content: {
      title: copy.title,
      body: copy.body,
      data: { kind: GOOD_MORNING_KIND },
      ...(Platform.OS === 'android' ? { channelId: ANDROID_CHANNEL_ID } : {}),
    },
    trigger: {
      type: notifications.SchedulableTriggerInputTypes.DAILY,
      hour: 8,
      minute: 0,
    },
  });
}

export async function cancelDailyGoodMorningNotifications(): Promise<void> {
  const notifications = await getNotificationsModule();
  if (!notifications) {
    return;
  }

  await cancelExistingGoodMorningNotifications(notifications);
}
