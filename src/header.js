import React from 'react';
import {View, Text, TouchableNativeFeedback, StatusBar} from 'react-native';
import Fontisto from 'react-native-vector-icons/Fontisto';
import {withNavigation} from 'react-navigation';

class Header extends React.Component {
  render() {
    const {title, navigation, leftButton, showPlus} = this.props;
    return (
      <View
        style={{
          backgroundColor: '#6D6E71',
          padding: 15,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <StatusBar backgroundColor="#6D6E71" />
        {leftButton}
        <Text
          style={{
            textAlign: 'center',
            fontSize: 28,
            color: 'white',
            fontFamily: 'Roboto-Light',
          }}>
          {title}
        </Text>
        {showPlus ? (
          <TouchableNativeFeedback onPress={() => navigation.push('AddChores')}>
            <Fontisto name="plus-a" size={23} color="white" />
          </TouchableNativeFeedback>
        ) : null}
      </View>
    );
  }
}

export default withNavigation(Header);
