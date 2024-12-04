import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import {useRouter } from "expo-router";
import { View, Text, TextInput, Button, StyleSheet, ScrollView } from 'react-native';

const SettingsPage: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [currentUsername, setCurrentUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [notifications, setNotifications] = useState<boolean>(true);
  const [goal, setGoal] = useState<string>('');
  const [unitMeasure, setUnitMeasure] = useState<string>('metric');
  const router = useRouter();

  useEffect(() => {
    const updateStatus = async () => {
      try {
        const name = await AsyncStorage.getItem("username")
        const userGoal = await AsyncStorage.getItem("goal")
        const users = await AsyncStorage.getItem('users');
        const usersData = users ? JSON.parse(users) : {};      
        if(userGoal != null){
          setGoal(JSON.parse(userGoal))
        }
        if(name != null){
          const currName = JSON.parse(name) 
          setUsername(JSON.parse(name))
          if(usersData != null){
            setPassword((usersData[currName]))
          }
        }
      } catch (error) {
        console.log(error);
      }
    };
    updateStatus();
  }, []);
  const handleSubmit = async () => {
    if (username || password || goal) {
        try {
            // Get users data from AsyncStorage
            const users = await AsyncStorage.getItem('users');
            const usersData = users ? JSON.parse(users) : {};  
            const name = await AsyncStorage.getItem("username")
            if(name != null){
              const currUser = JSON.parse(name) 
              if (usersData[currUser]) {
                console.log(`Deleting user: ${currUser}`);  // Log the username being deleted
                delete usersData[currUser];
                console.log('usersData after deletion:', usersData);
              }
            }
            console.log('Current usersData:', usersData);  // Log current state of usersData
            // Add new or update user password
            usersData[username] = password;
            console.log('usersData after adding/updating:', usersData);
            // Save updated usersData to AsyncStorage
            await AsyncStorage.setItem('users', JSON.stringify(usersData));
            await AsyncStorage.setItem('username', JSON.stringify(username));
            await AsyncStorage.setItem('goal', JSON.stringify(goal));
            // Redirect to the home page
            router.replace("/");

        } catch (error) {
            console.error('Error saving user data', error);
        }
    } else {
        Alert.alert('Invalid Input', 'Please enter both a username and password.');
    }
};


  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.subtitle}>Settings</Text>
      </View>
      
      <View style={styles.formGroup}>
        <Text>New Username:</Text>
        <TextInput
          style={styles.input}
          value={username}
          placeholder={username || "Enter New Username"}
          onChangeText={setUsername}
        />
      </View>

      <View style={styles.formGroup}>
        <Text>New Password:</Text>
        <TextInput
          style={styles.input}
          value={password}
          placeholder={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>

      <View style={styles.formGroup}>
        <Text>Set Goal:</Text>
        <TextInput
          style={styles.input}
          value={goal}
          placeholder={goal}
          onChangeText={setGoal}
        />
      </View>


      <View style={styles.buttonRow}>
        <Button title="Save Changes" onPress={handleSubmit} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
  },
  headerRow: {
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  formGroup: {
    marginBottom: 15,
  },
  label: {
    fontWeight: 'bold',
  },
  currentUsername: {
    fontSize: 18,
    marginBottom: 10,
    color: 'gray',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 10,
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 10,
    height: 80,
  },
  buttonRow: {
    marginTop: 20,
    alignItems: 'center',
  },
  checkboxRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
});

export default SettingsPage;
