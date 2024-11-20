import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { Stack, Link, useRouter } from "expo-router";
import { View, Text, TextInput, Button, StyleSheet, ScrollView } from 'react-native';

const SettingsPage: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [currentUsername, setCurrentUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [notifications, setNotifications] = useState<boolean>(true);
  const [healthDetails, setHealthDetails] = useState<string>('');
  const [unitMeasure, setUnitMeasure] = useState<string>('metric');
  const router = useRouter();

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const users = await AsyncStorage.getItem('users');
        const username = await AsyncStorage.getItem('username')
        const usersData = users ? JSON.parse(users) : {};
        if(username != null){
            const password = usersData[username];
        }
        if (username && password) {
          setPassword(password);
          setUsername(username); // Set the current username
        }
      } catch (error) {
        console.error('Error loading user data', error);
      }
    };

    loadUserData();
  }, [username]);

  const handleSubmit = async () => {
    if (username && password) {
        try {
            const users = await AsyncStorage.getItem('users');
            const usersData = users ? JSON.parse(users) : {};

            if (usersData[username]) {
                delete usersData[username];
                await AsyncStorage.setItem('users', JSON.stringify(usersData)); 
            }
            usersData[username] = password;
            await AsyncStorage.setItem('users', JSON.stringify(usersData));
            await AsyncStorage.setItem('username',JSON.stringify(username));
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
          placeholder={username}
          onChangeText={setUsername}
        />
      </View>

      <View style={styles.formGroup}>
        <Text>New Password:</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
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
