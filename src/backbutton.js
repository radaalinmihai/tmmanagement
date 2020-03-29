import React from 'react';
import {TouchableNativeFeedback, View} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function BackButton({onPress}) {
  return (
    <TouchableNativeFeedback onPress={onPress}>
      <View style={{width: 28, alignItems: 'center'}}>
        <Ionicons size={28} color="white" name="ios-arrow-back" />
      </View>
    </TouchableNativeFeedback>
  );
}
