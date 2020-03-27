import PushNotification from 'react-native-push-notification';

PushNotification.configure({
  onNotification: async notification => {
    console.log(notification);
    /* const chores = await getItem('@chores');
    chores.map(chore => {
      if(chore.id === notification.notificationId)
        chore.time = moment(chore.time).add(1, 'minute');
    });
    await storeItem('@chores', chores);
    notification.localNotificationSchedule(); */
  },
  popInitialNotification: true,
  requestPermissions: true,
});

const LocalNotification = (id, bigText, subText, message, date) => {
  PushNotification.localNotificationSchedule({
    id,
    bigText,
    subText,
    message,
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
