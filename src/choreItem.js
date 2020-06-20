import React from 'react';
import {View, Text, Dimensions, StyleSheet} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialCommunity from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import moment from 'moment';
import {withNavigation} from 'react-navigation';
import {
  PanGestureHandler,
  State,
  RectButton,
} from 'react-native-gesture-handler';
import Animated, {
  interpolate,
  Extrapolate,
  Value,
  event,
  block,
  cond,
  eq,
  add,
  set,
  greaterOrEq,
  Clock,
  stopClock,
  greaterThan,
  and,
  lessOrEq,
  lessThan,
  call,
  debug,
  clockRunning,
  spring,
  SpringUtils,
} from 'react-native-reanimated';
import runSpring from './reanimated/spring';

class ChoreItem extends React.Component {
  delete = async () => await this.props.deleteChore(this.props.item.id);
  resetPos = () => {
    const config = SpringUtils.makeConfigFromBouncinessAndSpeed({
      bounciness: 0,
      speed: 12,
      toValue: 0,
      ...SpringUtils.makeDefaultConfig(),
    });
    spring(this.dragX, config).start();
  };
  edit = () => {
    this.resetPos();
    this.props.navigation.navigate('AddChores', {id: this.props.item.id});
  };
  width = Dimensions.get('window').width;
  dragX = new Value(0);
  offsetX = new Value(0);
  swipeDir = new Value(-1);
  clock = new Clock();
  threshold = this.width / 2;
  leftSide = interpolate(this.dragX, {
    inputRange: [0, this.width],
    outputRange: [-this.width, 0],
    extrapolate: Extrapolate.CLAMP,
  });
  rightSide = interpolate(this.dragX, {
    inputRange: [-this.width, 0],
    outputRange: [0, this.width],
    extrapolate: Extrapolate.CLAMP,
  });
  handleGesture = event([
    {
      nativeEvent: ({translationX: x, state}) =>
        block([
          cond(eq(state, State.ACTIVE), [
            set(this.dragX, add(this.offsetX, x)),
            stopClock(this.clock),
          ]),
          cond(eq(state, State.END), [
            cond(
              and(
                greaterThan(this.dragX, 0),
                greaterOrEq(this.dragX, this.threshold),
              ),
              set(this.swipeDir, 1),
              cond(
                and(
                  lessThan(this.dragX, 0),
                  lessOrEq(this.dragX, -this.threshold),
                ),
                set(this.swipeDir, 0),
                set(this.swipeDir, -1),
              ),
            ),
            cond(eq(this.swipeDir, -1), [
              set(this.dragX, runSpring(this.clock, this.dragX, 0)),
              set(this.offsetX, 0),
            ]),
            cond(eq(this.swipeDir, 1), [
              set(this.dragX, runSpring(this.clock, this.dragX, this.width)),
              set(this.offsetX, this.width),
            ]),
            cond(eq(this.swipeDir, 0), [
              set(this.dragX, runSpring(this.clock, this.dragX, -this.width)),
              set(this.offsetX, -this.width),
            ]),
          ]),
        ]),
    },
  ]);
  render() {
    const {item} = this.props,
      {width} = this;
    return (
      <View style={{flex: 1}}>
        <PanGestureHandler
          onGestureEvent={this.handleGesture}
          onHandlerStateChange={this.handleGesture}>
          <Animated.View style={{flex: 1, flexDirection: 'row'}}>
            <Animated.View
              style={[
                styles.sides,
                {transform: [{translateX: this.leftSide}]},
              ]}>
              <RectButton
                containerStyle={{flex: 1}}
                onPress={this.delete}
                style={styles.deleteButton}>
                <MaterialCommunity
                  name="delete-forever"
                  size={38}
                  color="white"
                />
              </RectButton>
            </Animated.View>
            <Animated.View
              style={{
                padding: 25,
                flex: 1,
                width,
                transform: [{translateX: this.dragX}],
              }}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text
                  style={{
                    fontSize: 17,
                    fontFamily: 'Roboto-Regular',
                    letterSpacing: 1.3,
                    color: 'black',
                  }}>
                  {item.title}
                </Text>
                <Entypo name="dot-single" size={17} style={{color: 'black'}} />
                <Text
                  style={{
                    fontSize: 17,
                    fontFamily: 'Roboto-Regular',
                    color: 'black',
                  }}>
                  {moment(this.props.item.time).format('HH:mm')}
                </Text>
              </View>
              <Text
                style={{
                  fontFamily: 'Roboto-Italic',
                  fontSize: 16,
                  marginLeft: 3,
                  color: '#939598',
                }}>
                {item.description}
              </Text>
            </Animated.View>
            <Animated.View
              style={[
                styles.sides,
                {
                  transform: [
                    {
                      translateX: this.rightSide,
                    },
                  ],
                  flexDirection: 'row',
                },
              ]}>
              <RectButton
                containerStyle={{
                  flex: 1,
                }}
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#35D073',
                  width: '100%',
                }}>
                <MaterialIcons name="done-all" size={38} color="white" />
              </RectButton>
              <RectButton
                onPress={this.edit}
                containerStyle={{
                  flex: 1,
                }}
                style={{
                  backgroundColor: '#ebebeb',
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%',
                }}>
                <MaterialIcons name="edit" size={38} color="black" />
              </RectButton>
            </Animated.View>
          </Animated.View>
        </PanGestureHandler>
      </View>
    );
  }
}
export default withNavigation(ChoreItem);

const styles = StyleSheet.create({
  sides: {
    flex: 1,
    ...StyleSheet.absoluteFill,
  },
  deleteButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EE3D48',
  },
});
