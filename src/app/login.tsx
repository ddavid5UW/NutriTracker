import React, { useState, useEffect } from 'react';
import { Stack, Link, useRouter } from "expo-router";
import { View, Text, TextInput, Button, StyleSheet, Alert, Linking } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLinkTo } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import RootLayout from './_layout';
import HomeScreen from '.';

const LoginScreen: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isLoginMode, setIsLoginMode] = useState<boolean>(true);
  const [loggedIn, setLoggedIn] = useState<boolean>(false);

// Modified code from my CS 571 p9 from a few semesters ago
  const handleSignUp = async () => {
    if (username && password) {
      try {
        const users = await AsyncStorage.getItem('users');
        const usersData = users ? JSON.parse(users) : {};

        if (usersData[username]) {
          Alert.alert('Sign Up Failed', 'Username already exists. Please choose another one.');
        } else {
          usersData[username] = password;
          await AsyncStorage.setItem('users', JSON.stringify(usersData));
          Alert.alert('Sign Up Successful', 'You can now log in with your new account.');
          setIsLoginMode(true);
        }
      } catch (error) {
        console.error('Error saving user data', error);
      }
    } else {
      Alert.alert('Invalid Input', 'Please enter both a username and password.');
    }
  };

  useEffect(() => {
    const checkLog = async () => {
      try {
        //console.log('before get');

        const userData = await AsyncStorage.getItem('status');
        if (userData !== null) {
          setLoggedIn(JSON.parse(userData) == true);
          Alert.alert("status", loggedIn.toString())
        }
      } catch (error) {
        console.log(error); 
      }
    };
    checkLog();
  }, [loggedIn]); 

  const handleLogin = async () => {
    //const linkTo = useLinkTo();
    if (username && password) {
      try {
        const users = await AsyncStorage.getItem('users');
        const usersData = users ? JSON.parse(users) : {};


        if (usersData[username] && usersData[username] === password) {
          await AsyncStorage.setItem('status', JSON.stringify(true));
          const val = await AsyncStorage.getItem('status')
          setLoggedIn(true)
          Alert.alert("status", val?.toString())
          
        } else {
          Alert.alert('Login Failed', 'Invalid username or password.');
        }
      } catch (error) {
        console.error('Error retrieving user data', error);
      }
    } else {
      Alert.alert('Invalid Input', 'Please enter both a username and password.');
    }
  };

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    setUsername('');
    setPassword('');
  };
  


  return (
    !loggedIn ?
    <View style={styles.container}>
      <Text style={styles.title}>{isLoginMode ? 'Welcome to Nutritracker!' : "Let's get you signed up!"}</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
        
      <Button
        title={isLoginMode ? 'Login' : 'Sign Up'}
        onPress={isLoginMode ? handleLogin : handleSignUp}
      />
      <Button
        title={isLoginMode ? 'Go to Sign Up' : 'Back to Login'}
        onPress={toggleMode}
        color="#888"
      />
    </View>: <View><Link href={"/home"} asChild>
    <Button title="Continue" />
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

export default LoginScreen;
