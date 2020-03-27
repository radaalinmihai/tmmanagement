import React from 'react';
import {createStackNavigator} from 'react-navigation-stack';
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
              ) : undefined
            }
          />
        );
      },
    },
  },
);

export default createAppContainer(App);
