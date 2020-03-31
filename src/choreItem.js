import React from 'react';
import {
  View,
  Text,
  Animated,
  PanResponder,
  TouchableNativeFeedback,
  Dimensions,
  Vibration,
} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialCommunity from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import moment from 'moment';
import {withNavigation} from 'react-navigation';

class ChoreItem extends React.Component {
  constructor(props) {
    super(props);

    const {width} = Dimensions.get('screen');

    this.state = {
      leftButtonsWidth: width / 5,
      rightButtonsWidth: width / (5 / 2),
    };

    const {leftButtonsWidth, rightButtonsWidth} = this.state;

    this.item = new Animated.ValueXY({x: 0, y: 0});
    this.checked = new Animated.Value(0);
    this.left = this.item.x.interpolate({
      inputRange: [0, leftButtonsWidth],
      outputRange: [-leftButtonsWidth, 0],
      extrapolate: 'clamp',
    });
    this.right = this.item.x.interpolate({
      inputRange: [-rightButtonsWidth, 0],
      outputRange: [0, -rightButtonsWidth],
      extrapolate: 'clamp',
    });
    this.x = this.item.x.interpolate({
      inputRange: [-rightButtonsWidth, 0, leftButtonsWidth],
      outputRange: [-rightButtonsWidth, 0, leftButtonsWidth],
      extrapolate: 'clamp',
    });

    this.titleColor = this.checked.interpolate({
      inputRange: [0, 1],
      outputRange: ['black', 'white'],
    });

    this.descriptionColor = this.checked.interpolate({
      inputRange: [0, 1],
      outputRange: ['#939598', 'white'],
    });

    this.successColor = this.checked.interpolate({
      inputRange: [0, 1],
      outputRange: ['white', 'rgba(65, 182, 25, .6)'],
    });

    this.swipedRight = false;
    this.swipedLeft = false;

    this.pan = PanResponder.create({
      onStartShouldSetPanResponder: (event, gestureState) =>
        Math.abs(gestureState.dx) !== 0,
      onMoveShouldSetPanResponder: (event, gestureState) =>
        Math.abs(gestureState.dx) !== 0,
      onPanResponderGrant: () => {
        this.item.setOffset({x: this.item.x._value, y: this.item.y._value});
      },
      onPanResponderMove: Animated.event([null, {dx: this.item.x}]),
      onPanResponderRelease: (event, gestureState) => {
        this.item.flattenOffset();
        if (gestureState.dx > leftButtonsWidth)
          this.changeSwipeDir(false, true);
        else if (gestureState.dx < -rightButtonsWidth)
          this.changeSwipeDir(true, false);
        else this.changeSwipeDir(false, false);

        if (this.swipedRight)
          Animated.spring(this.item.x, {
            toValue: leftButtonsWidth,
            bounciness: 0,
          }).start();
        else if (this.swipedLeft)
          Animated.spring(this.item.x, {
            toValue: -rightButtonsWidth,
            bounciness: 0,
          }).start();
        else
          Animated.spring(this.item.x, {
            toValue: 0,
            bounciness: 0,
          }).start();
      },
    });
  }
  resetPos = () => {
    this.changeSwipeDir(false, false);
    Animated.spring(this.item.x, {
      toValue: 0,
      bounciness: 0,
    }).start();
  };
  changeSwipeDir = (left, right) => {
    this.swipedLeft = left;
    this.swipedRight = right;
  };
  longPressShowLeft = () => {
    Vibration.vibrate(15);
    Animated.spring(this.item.x, {
      toValue: this.state.leftButtonsWidth,
    }).start();
  };
  changeColor = () => Animated.timing(this.checked, {toValue: 1}).start();
  delete = async () => await this.props.deleteChore(this.props.item.id);
  edit = () => {
    this.resetPos();
    this.props.navigation.navigate('AddChores', {id: this.props.item.id});
  };
  render() {
    const {item} = this.props,
      {leftButtonsWidth, rightButtonsWidth} = this.state;
    const AnimatedEntypo = Animated.createAnimatedComponent(Entypo);
    return (
      <View
        style={{
          borderBottomWidth: 1,
          borderBottomColor: '#D1D3D4',
          flexDirection: 'row',
        }}>
        <Animated.View
          style={{
            position: 'absolute',
            width: leftButtonsWidth,
            height: '100%',
            top: 0,
            left: this.left,
          }}>
          <TouchableNativeFeedback onPress={this.delete}>
            <View
              style={{
                backgroundColor: '#EE3D48',
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                paddingHorizontal: 10,
              }}>
              <MaterialCommunity
                name="delete-forever"
                size={38}
                color="white"
              />
            </View>
          </TouchableNativeFeedback>
        </Animated.View>
        <Animated.View
          style={{
            padding: 20,
            width: '100%',
            backgroundColor: this.successColor,
            transform: [{translateX: this.x}],
          }}
          {...this.pan.panHandlers}>
          <TouchableNativeFeedback
            background={TouchableNativeFeedback.Ripple('transparent')}
            onLongPress={this.longPressShowLeft}>
            <View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Animated.Text
                  style={{
                    fontSize: 17,
                    fontFamily: 'Roboto-Regular',
                    letterSpacing: 1.3,
                    color: this.titleColor,
                  }}>
                  {item.title}
                </Animated.Text>
                <AnimatedEntypo name="dot-single" size={17} style={{color: this.titleColor}} />
                <Animated.Text
                  style={{
                    fontSize: 17,
                    fontFamily: 'Roboto-Regular',
                    color: this.titleColor,
                  }}>
                  {moment(this.props.item.time).format('HH:mm')}
                </Animated.Text>
              </View>
              <Animated.Text
                style={{
                  fontFamily: 'Roboto-Italic',
                  fontSize: 16,
                  marginLeft: 3,
                  color: this.descriptionColor,
                }}>
                {item.description}
              </Animated.Text>
            </View>
          </TouchableNativeFeedback>
        </Animated.View>
        <Animated.View
          style={{
            position: 'absolute',
            flexDirection: 'row',
            width: rightButtonsWidth,
            height: '100%',
            top: 0,
            right: this.right,
          }}>
          <TouchableNativeFeedback onPress={this.changeColor}>
            <View
              style={{
                backgroundColor: '#4BB462',
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                paddingHorizontal: 10,
              }}>
              <Entypo name="check" size={38} color="white" />
            </View>
          </TouchableNativeFeedback>
          <TouchableNativeFeedback onPress={this.edit}>
            <View
              style={{
                backgroundColor: '#58595B',
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                paddingHorizontal: 10,
              }}>
              <MaterialIcons name="edit" size={38} color="white" />
            </View>
          </TouchableNativeFeedback>
        </Animated.View>
      </View>
    );
  }
}
export default withNavigation(ChoreItem);
