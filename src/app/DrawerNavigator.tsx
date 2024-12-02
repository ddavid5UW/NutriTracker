import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeScreen from './HomeScreen';
import LoginScreen from './login';
import SearchScreen from './search';
import WeightScreen from './weight';
import FoodLogScreen from './foodLog';
import LogoutScreen from './logout';

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator initialRouteName="Home">
      <Drawer.Screen name="Home" component={HomeScreen} />
      {/* <Drawer.Screen name="Login" component={LoginScreen} /> */}
      <Drawer.Screen name="Search" component={SearchScreen} />
      <Drawer.Screen name="Weight" component={WeightScreen} />
      <Drawer.Screen name="Food Log" component={FoodLogScreen} />
      <Drawer.Screen name="Logout" component={LogoutScreen} />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;