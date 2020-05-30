import React from 'react';
import {View, Text} from 'react-native';
export default function NoChoresText() {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text style={{color: 'grey', fontFamily: 'Roboto-Light', fontSize: 20}}>
        No chores? How about adding some?... :)
      </Text>
    </View>
  );
}
