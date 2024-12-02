import { Stack, Link } from "expo-router";
import React, { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

//import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from '.';
import LoginScreen from './login';
import SearchScreen from './search';
import WeightScreen from './weight';

//const Stack = createStackNavigator();

import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  gql,
} from "@apollo/client";

const client = new ApolloClient({
  uri: "https://alayotes.us-east-a.ibm.stepzen.net/api/mollified-buffoon/__graphql",
  cache: new InMemoryCache(),
  headers: {
    Authorization:
      "apikey alayotes::local.net+1000::8af6cc6f7cc13822193d7bf2acb43c210d128fb1116cef7a82b5307155516c49",
  },
});

const RootLayout = () => {
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const setloggedin = async() => {
    const loggedin = await AsyncStorage.getItem('status');
    const loggedinp = loggedin ? JSON.parse(loggedin) : {};
    if(loggedinp == true){
      await AsyncStorage.setItem('status', JSON.stringify(false));
    }
  }

  return (
    <ApolloProvider client={client}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="login" />
        <Stack.Screen name="index" />
        <Stack.Screen name="search" />
        <Stack.Screen name="logout" />
        <Stack.Screen name="weight" />
      </Stack>
    </ApolloProvider>
  );
};


export default RootLayout;
