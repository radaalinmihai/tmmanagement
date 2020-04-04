import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import BackgroundFetch from 'react-native-background-fetch';
import {getItem, removeItem, storeItem} from './utils';
import moment from 'moment';

BackgroundFetch.configure(
  {
    minimumFetchInterval: 60,
    stopOnTerminate: false,
    startOnBoot: true,
    requiredNetworkType: BackgroundFetch.NETWORK_TYPE_NONE,
    enableHeadless: true,
  },
  async () => MidnightCheck(),
  (error) => console.warn(error),
);

let MidnightCheck = async (event) => {
  let taskId = event.taskId;
  const chores = await getItem('@chores');

  if (chores.length > 0) {
    if (moment().diff(moment().endOf('day')) >= 0)
      chores.map((chore) => (chore.done ? {...chore, done: false} : chore));
    await removeItem('@chores');
    await storeItem('@chores', chores);
  }
  console.log('Checked. Changes should have been made if it was the case');
  BackgroundFetch.finish(taskId);
};

BackgroundFetch.registerHeadlessTask(MidnightCheck);
AppRegistry.registerComponent(appName, () => App);
