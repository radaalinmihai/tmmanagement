import React from 'react';
import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  TouchableNativeFeedback,
  ScrollView,
  StyleSheet,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {getItem, storeItem} from '../utils';
import {RNToasty} from 'react-native-toasty';
import moment from 'moment';
import {
  LocalNotification,
  CancelNotification,
} from './services/LocalPushController';
import {withNavigation} from 'react-navigation';

class AddChores extends React.Component {
  static navigationOptions = {
    title: null,
  };
  state = {
    time: moment(),
    title: '',
    description: '',
    show: false,
    editId: this.props.navigation.getParam('id', 'NO-ID'),
  };
  showTimer = () => this.setState({show: true});
  setTime = (event, time) =>
    time !== undefined
      ? this.setState({
          time:
            moment(time).diff(moment()) <= 0
              ? moment(time).add(1, 'day')
              : moment(time),
          show: false,
        })
      : undefined;
  componentDidMount = async () => {
    const {editId} = this.state;
    if (editId !== 'NO-ID') {
      const chores = await getItem('@chores'),
        chore = chores.filter(chore => chore.id === editId);
      this.setState({
        title: chore[0].title,
        description: chore[0].description,
        time: moment(chore[0].time),
      });
    }
  };
  save = async () => {
    const {title, description, time} = this.state,
      {navigation} = this.props;

    if (title.trim() !== '' && description.trim() !== '') {
      let choresList = (await getItem('@chores')) || [],
        id = choresList.length + 1,
        chore = {
          id,
          title,
          description,
          time,
          done: false,
        };
      choresList.push(chore);
      await storeItem('@chores', choresList);
      this.saveToast();
      this.setNotification(id);
      navigation.goBack();
    }
  };
  edit = async () => {
    const {title, description, time, editId} = this.state;

    if (title.trim() !== '' && description.trim() !== '') {
      let chores = await getItem('@chores');
      chores.map(chore => {
        if (chore.id === editId) {
          chore.title = title;
          chore.description = description;
          chore.time = time;
        }
      });
      await storeItem('@chores', chores);
      CancelNotification(editId);
      this.editToast();
      this.setNotification(editId);
      this.props.navigation.goBack();
    }
  };
  setNotification = id => {
    const {title, description, time} = this.state;
    LocalNotification(
      id.toString(),
      description,
      'Daily routine',
      `You have a notification regarding '${title}'`,
      moment(time).valueOf(),
    );
  };
  saveToast = () =>
    RNToasty.Success({
      title: 'Chore saved',
      duration: 0,
    });
  editToast = () =>
    RNToasty.Success({
      title: 'Chore edited',
      duration: 0,
    });
  cancel = () => this.props.navigation.goBack();
  render() {
    const {time, show, title, description, editId} = this.state;
    return (
      <KeyboardAvoidingView
        style={{
          flex: 1,
          padding: 20,
        }}
        enabled>
        <ScrollView
          contentContainerStyle={{flex: 1}}
          keyboardShouldPersistTaps="never">
          <View style={styles.input}>
            <TextInput
              style={styles.textInput}
              value={title}
              onChangeText={title => this.setState({title})}
              placeholder="Title..."
            />
          </View>
          <View style={styles.input}>
            <TextInput
              style={styles.textInput}
              value={description}
              multiline
              onChangeText={description => this.setState({description})}
              placeholder="What do you need to do..."
            />
          </View>
          <TouchableNativeFeedback onPress={this.showTimer}>
            <View
              style={[{paddingLeft: 14, paddingVertical: 15}, styles.input]}>
              <Text style={[styles.textInput, {color: 'grey'}]}>
                {time.format('HH:mm')}
              </Text>
            </View>
          </TouchableNativeFeedback>
          {show && (
            <DateTimePicker
              value={new Date(time)}
              mode="time"
              is24Hour
              display="spinner"
              onChange={this.setTime}
            />
          )}
          <View style={styles.bottomButtonsWrapper}>
            <TouchableNativeFeedback onPress={this.cancel}>
              <View style={styles.button}>
                <Text style={styles.buttonText}>Cancel</Text>
              </View>
            </TouchableNativeFeedback>
            <TouchableNativeFeedback
              onPress={editId !== 'NO-ID' ? this.edit : this.save}>
              <View style={[styles.button, {backgroundColor: '#F85C50'}]}>
                <Text style={styles.buttonText}>
                  {editId !== 'NO-ID' ? 'Edit' : 'Save'}
                </Text>
              </View>
            </TouchableNativeFeedback>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
}

export default withNavigation(AddChores);

const styles = StyleSheet.create({
  input: {
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'grey',
    marginTop: 25,
  },
  textInput: {
    fontSize: 15,
    fontFamily: 'Roboto-Regular',
  },
  button: {
    padding: 15,
    backgroundColor: '#6D6E71',
    borderRadius: 6,
    width: 80,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
  bottomButtonsWrapper: {
    flex: 1,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 20,
  },
});
