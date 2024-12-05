import React, { useState, useEffect } from 'react';
import { Stack, Link, useRouter } from "expo-router";
import { View, Text, TextInput, Button, StyleSheet, Alert, Linking } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLinkTo } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import RootLayout from '../_layout';
import HomeScreen from '.';

const LogoutScreen: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isLoginMode, setIsLoginMode] = useState<boolean>(true);
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
const router = useRouter();

  const handleLogout = async () => {
    //const linkTo = useLinkTo();
      try {
        await AsyncStorage.setItem('status', JSON.stringify(false));
        const val = await AsyncStorage.getItem('status')
        Alert.alert("status", val?.toString())

        router.replace('/login');
      } 
      catch (error) {
        console.error('Error retrieving user data', error);
      }

  };

  useEffect(() => {handleLogout()}, [])
  return (
<View><Text>"You have been successfuly logged out"</Text><Link href={"/login"} asChild>
    <Button title="Continue to login" />
  </Link></View>
  ) ;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
});

export default LogoutScreen;
