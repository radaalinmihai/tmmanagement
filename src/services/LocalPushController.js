import PushNotification from 'react-native-push-notification';
import { Platform } from 'react-native';

PushNotification.configure({
  onNotification: async notification => {
    console.log(notification);
  },
  popInitialNotification: true,
  requestPermissions: Platform.OS === 'ios',
});

const LocalNotification = (id, bigText, subText, message, date) => {
  PushNotification.localNotificationSchedule({
    id,
    bigText,
    subText,
    message,
    largeIcon: 'none',
    smallIcon: 'ic_stat_tm',
    autoCancel: true,
    vibrate: true,
    vibration: 300,
    playSound: true,
    soundName: 'default',
    repeatType: 'day',
    date: new Date(date),
  });
};

const CancelAllNotifications = () =>
  PushNotification.cancelAllLocalNotifications();

const CancelNotification = id =>
  PushNotification.cancelLocalNotifications({id});

export {LocalNotification, CancelAllNotifications, CancelNotification};
