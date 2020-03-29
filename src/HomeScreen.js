import React from 'react';
import {FlatList, AppState} from 'react-native';
import NoChoresText from './noChoresText';
import {getItem, storeItem, removeItem} from '../utils';
import ChoreItem from './choreItem';
import {RNToasty} from 'react-native-toasty';
import {CancelNotification} from './services/LocalPushController';

export default class HomeScreen extends React.Component {
  state = {
    chores: [],
  };
  getChores = async () => {
    const chores = await getItem('@chores');
    if (chores !== null) this.setState({chores});
  };
  deleteChore = async id => {
    this.setState(prevState => ({
      chores: prevState.chores.filter(item => item.id !== id),
    }));

    CancelNotification(id.toString());
    await removeItem('@chores');
    await storeItem('@chores', this.state.chores);
    RNToasty.Error({
      title: 'Chore deleted',
      duration: 0,
    });
  };
  componentDidMount = async () => this.checkScreenState();
  checkScreenState = () =>
    this.props.navigation.addListener(
      'didFocus',
      async () => await this.getChores(),
    );
  render() {
    const {chores} = this.state;
    return (
      <React.Fragment>
        {chores.length > 0 ? (
          <FlatList
            data={chores}
            renderItem={({item}) => (
              <ChoreItem deleteChore={this.deleteChore} item={item} />
            )}
            keyExtractor={item => item.id.toString()}
          />
        ) : (
          <NoChoresText />
        )}
      </React.Fragment>
    );
  }
}
