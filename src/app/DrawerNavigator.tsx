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
import { NavigationContainer } from '@react-navigation/native';

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  return (
      <Drawer.Navigator
        initialRouteName="Home"
        screenOptions={{
          drawerStyle: {
            backgroundColor: '#22272c', // Change this to your desired background color
            width: 240, // Adjust the width of the drawer if needed
          },
          headerStyle: {
            backgroundColor: '#22272c', // Set the background color of the header
          },
          headerTintColor: '#ffffff',
          drawerActiveTintColor: '#000000', // Color for the active item text
          drawerInactiveTintColor: '#ffffff', // Color for the inactive item text
          drawerActiveBackgroundColor: '#ffffff', // Background color for the active item
        }}
      >
        <Drawer.Screen name="Home" component={HomeScreen} />
        {/* <Drawer.Screen name="Login" component={LoginScreen} /> */}
        <Drawer.Screen name="Search" component={SearchScreen} />
        <Drawer.Screen name="Weight" component={WeightScreen} />
        <Drawer.Screen name="Food Log" component={FoodLogScreen} />
        <Drawer.Screen name="Goals" component={GoalSetting} />
        <Drawer.Screen name="Settings" component={SettingsPage} />
        <Drawer.Screen name="Logout" component={LogoutScreen} />

      </Drawer.Navigator>
  );
};

export default DrawerNavigator;
