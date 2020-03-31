import React from 'react';
import {
  createStackNavigator,
  TransitionSpecs,
  HeaderStyleInterpolators,
} from 'react-navigation-stack';
import HomeScreen from './src/HomeScreen';
import {createAppContainer} from 'react-navigation';
import Header from './src/header';
import AddChores from './src/addChores';
import BackButton from './src/backbutton';

const App = createStackNavigator(
  {
    'Your daily routine': {
      screen: HomeScreen,
    },
    AddChores: {
      screen: AddChores,
    },
  },
  {
    defaultNavigationOptions: {
      initialRouteName: 'Your daily routine',
      transitionSpec: {
        open: TransitionSpecs.TransitionIOSSpec,
        close: TransitionSpecs.TransitionIOSSpec,
      },
      cardStyle: {
        backgroundColor: 'white'
      },
      cardStyleInterpolator: ({current, next, layouts}) => {
        return {
          cardStyle: {
            transform: [
              {
                translateX: current.progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [layouts.screen.width, 0],
                }),
              },
            ],
          },
          overlayStyle: {
            opacity: current.progress.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 0.1],
            }),
          },
        };
      },
      header: ({scene, previous, navigation}) => {
        const {options} = scene.descriptor;
        const title =
          options.headerTitle !== undefined
            ? options.headerTitle
            : options.title !== undefined
            ? options.title
            : scene.route.routeName;

        return (
          <Header
            title={title}
            showPlus={previous === undefined ? true : false}
            leftButton={
              previous ? (
                <BackButton onPress={() => navigation.goBack()} />
              ) : (
                undefined
              )
            }
          />
        );
      },
    },
  },
);

export default createAppContainer(App);
