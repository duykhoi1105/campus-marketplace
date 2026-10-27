declare module 'expo-notifications' {
  export interface NotificationPermissionsStatus {
    status: 'granted' | 'undetermined' | 'denied';
  }

  export function getPermissionsAsync(): Promise<NotificationPermissionsStatus>;
  export function requestPermissionsAsync(): Promise<NotificationPermissionsStatus>;

  export interface NotificationContentInput {
    title?: string;
    body?: string;
    data?: Record<string, unknown>;
    sound?: boolean | string;
  }

  export interface NotificationRequestInput {
    content: NotificationContentInput;
    trigger: null | Record<string, unknown>;
  }

  export function scheduleNotificationAsync(
    request: NotificationRequestInput
  ): Promise<string>;
}

