import { Link, useRouter } from "expo-router";
import React, {  createContext, useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  Button,
  StyleSheet,
  ActivityIndicator, Alert,
} from "react-native";
import { gql, useQuery } from "@apollo/client";
import dayjs from "dayjs";
import FoodLogListItem from "../components/FoodLogListItem";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge';
import Stack from '@mui/material/Stack';

// Query to fetch food logs for a specific date
const foodLogsQuery = gql`
  query foodLogsForDate($date: Date!, $user_id: String!) {
    foodLogsForDate(date: $date, user_id: $user_id) {
      food_id
      user_id
      created_at
      label
      kcal
      id
    }
  }
`;

// Query to fetch total calories for a specific date
const kcalTotalQuery = gql`
  query KcalTotalForDate($date: Date!, $user_id: String!) {
    KcalTotalForDate(date: $date, user_id: $user_id) {
      total_kcal
    }
  }
`;




export default function HomeScreen() {
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const user_id = "Eric zhang";
  const date = dayjs().format("YYYY-MM-DD");

  // Fetch food logs query, skipped until user is logged in
  const { data: foodData, loading: foodLoading, error: foodError } = useQuery(foodLogsQuery, {
    variables: { date, user_id },
    skip: !loggedIn,
  });

  // Fetch total calories query, skipped until user is logged in
  const { data: kcalData, loading: kcalLoading, error: kcalError } = useQuery(kcalTotalQuery, {
    variables: { date, user_id },
    skip: !loggedIn,
  });

  // Check login status on component mount
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const userData = await AsyncStorage.getItem('status');
        const isLoggedIn = userData ? JSON.parse(userData) === true : false;
        setLoggedIn(isLoggedIn);
        setLoading(false); // Stop loading after login status is checked
      } catch (error) {
        console.log(error);
      }
    };
    checkLoginStatus();
  }, []);

  const handleLogin = async () => {
    router.replace('/login');
  };
 

  const handleLogout = async () => {
    try {
      await AsyncStorage.setItem('status', JSON.stringify(false));
      setLoggedIn(false);
      Alert.alert("Logged Out", "You have been logged out.");
    } catch (error) {
      console.error('Error setting logout status', error);
    }
  };

  if (loading) {
    return <ActivityIndicator />;
  }

  if (!loggedIn) {
    return (
      <View>
        <Text>Looks like you're not signed in</Text>
          <Button title="Get Started" onPress={handleLogin}/>
      </View>
    );
  }

  if (foodLoading || kcalLoading) {
    return <ActivityIndicator />;
  }

  if (foodError || kcalError) {
    return <Text>Failed to fetch data</Text>;
  }

  const foodLogs = foodData?.foodLogsForDate || [];
  const totalCalories = kcalData?.KcalTotalForDate?.total_kcal || 0;
  //dummy value to change
  const goal = 200
  const calDisp = totalCalories

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.subtitle}>Total Calories</Text>
        <Text style={{ fontSize: 18 }}>{`${totalCalories}`}</Text>
      </View>
      <View>
        <center>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={{ xs: 1, md: 2 }}>
          <Gauge width={150} height={150} value={calDisp} valueMax={goal}
            text={
              `Calories \n ${totalCalories}`
           } />
        </Stack>
        </center>
      </View>
      <View style={styles.headerRow}>
        <Text style={styles.subtitle}>Today's Log</Text>
        <Link href={"/search"} asChild>
          <Button title="ADD FOOD" />
        </Link>
        <Button title="Logout" onPress={handleLogout} />
      </View>
      <FlatList
        data={foodLogs}
        contentContainerStyle={{ gap: 5 }}
        renderItem={({ item }) => <FoodLogListItem item={item} />}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1,
    padding: 10,
    gap: 10,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "500",
    flex: 1,
    color: "dimgray",
  },
});

