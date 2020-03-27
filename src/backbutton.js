import React from 'react';
import {TouchableNativeFeedback} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function BackButton({onPress}) {
  return (
    <TouchableNativeFeedback onPress={onPress}>
      <Ionicons size={28} color='white' name="ios-arrow-back" />
    </TouchableNativeFeedback>
  );
}