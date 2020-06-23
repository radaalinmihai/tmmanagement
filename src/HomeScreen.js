import React from 'react';
import {StyleSheet, View} from 'react-native';
import NoChoresText from './noChoresText';
import {getItem, storeItem, removeItem} from '../utils';
import ChoreItem from './choreItem';
import {RNToasty} from 'react-native-toasty';
import {CancelNotification} from './services/LocalPushController';
import {FlatList} from 'react-native-gesture-handler';

export default class HomeScreen extends React.Component {
  state = {
    chores: [],
  };
  getChores = async () => {
    const chores = await getItem('@chores');
    if (chores !== null) this.setState({chores});
  };
  deleteChore = async (id) => {
    this.setState((prevState) => ({
      chores: prevState.chores.filter((item) => item.id !== id),
    }));

    CancelNotification(id.toString());
    await removeItem('@chores');
    await storeItem('@chores', this.state.chores);
    RNToasty.Error({
      title: 'Chore deleted',
      duration: 0,
    });
  };
  setDoneChore = async (id) => {
    this.setState((prevState) => ({
      chores: prevState.chores.map((chore) =>
        chore.id === id ? {...chore, done: !chore.done} : chore,
      ),
    }));
    await removeItem('@chores');
    await storeItem('@chores', this.state.chores);
    if (this.state.chores[id - 1].done)
      RNToasty.Info({
        title: 'Good job!',
        duration: 0,
      });
    else
      RNToasty.Warn({
        title: "Well, that's bad..",
        duration: 0,
      });
  };
  componentDidMount = async () => this.checkScreenState();
  renderItem = ({item}) => (
    <ChoreItem
      deleteChore={this.deleteChore}
      setDoneChore={this.setDoneChore}
      item={item}
    />
  );
  itemSeparator = () => <View style={styles.separator} />;
  checkScreenState = () =>
    this.props.navigation.addListener(
      'didFocus',
      async () => await this.getChores(),
    );
  render() {
    const {chores} = this.state;
    return (
      <FlatList
        data={chores}
        ItemSeparatorComponent={this.itemSeparator}
        ListEmptyComponent={NoChoresText}
        renderItem={this.renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
    );
  }
}

const styles = StyleSheet.create({
  separator: {
    height: 1,
    width: '100%',
    backgroundColor: '#58595B',
  },
});
