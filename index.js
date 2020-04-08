import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import BackgroundFetch from 'react-native-background-fetch';
import {getItem, removeItem, storeItem} from './utils';
import moment from 'moment';

BackgroundFetch.configure(
  {
    minimumFetchInterval: 120,
    forceAlarmManager: true,
    stopOnTerminate: false,
    startOnBoot: true,
    requiredNetworkType: BackgroundFetch.NETWORK_TYPE_NONE,
    enableHeadless: true,
  },
  async (taskId) => MidnightCheck(taskId),
  (error) => console.warn(error),
);

let MidnightCheck = async (taskId) => {
  let chores = await getItem('@chores');

  if ((await getItem('@time')) === null) await storeItem('@time', moment());

  if (chores !== null) {
    let time = await getItem('@time');
    if (moment(time).get('D') !== moment().get('D')) {
      for(let i = 0; i < chores.length; i++)
        chores[i].done = false;
      await removeItem('@time');
      await removeItem('@chores');
      await storeItem('@chores', chores);
    }
  }
  console.log('Checked. Changes should have been made if it was the case');
  BackgroundFetch.finish(taskId);
};

BackgroundFetch.registerHeadlessTask(MidnightCheck);
AppRegistry.registerComponent(appName, () => App);
