import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeScreen from './HomeScreen';
import LoginScreen from './login';
import SearchScreen from './search';
import WeightScreen from './weight';
import FoodLogScreen from './foodLog';
import LogoutScreen from './logout';
import SettingsPage from './settings';
import GoalSetting from './goal';

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
      <Drawer.Screen name='Goals' component={GoalSetting} />
      <Drawer.Screen name='Settings' component={SettingsPage} />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;