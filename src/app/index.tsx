import { Link, useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Button,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { gql, useQuery } from "@apollo/client";
import dayjs from "dayjs";
import FoodLogListItem from "../components/FoodLogListItem";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Query to fetch food logs for a specific date
const foodLogsQuery = gql`
  query foodLogsForDate($date: Date!, $user_id: String!) {
    foodLogsForDate(date: $date, user_id: $user_id) {
      food_id
      user_id
      created_at
      label
      carb
      kcal
      fat
      fiber
      protien
      image
      id
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

  // Check login status on component mount
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const userData = await AsyncStorage.getItem("status");
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
    router.replace("/login");
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.setItem("status", JSON.stringify(false));
      setLoggedIn(false);
      Alert.alert("Logged Out", "You have been logged out.");
    } catch (error) {
      console.error("Error setting logout status", error);
    }
  };

  if (loading) {
    return <ActivityIndicator />;
  }

  if (!loggedIn) {
    return (
      <View>
        <Text>Looks like you're not signed in</Text>
        <Button title="Get Started" onPress={handleLogin} />
      </View>
    );
  }

  if (foodLoading) {
    return <ActivityIndicator />;
  }

  if (foodError) {
    return <Text>Failed to fetch data</Text>;
  }

  const foodLogs = foodData?.foodLogsForDate || [];
  // Calculate total calories dynamically
  const totalCalories = foodLogs.reduce((sum, log) => sum + (log.kcal || 0), 0);

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.subtitle}>Total Calories</Text>
        <Text style={{ fontSize: 18 }}>{`${totalCalories} kcal`}</Text>
      </View>
      <View style={styles.headerRow}>
        <Text style={styles.subtitle}>Today's Log</Text>
        <Link href={"/search"} asChild>
          <Button title="ADD FOOD" />
        </Link>
        <Link href={"/weight"} asChild>
          <Button title="WEIGHT" />
        </Link>
        <Button title="Logout" onPress={handleLogout} />
        <Link href={"/foodLog"} asChild>
          <Button title="View Logs" />
        </Link>
      </View>
      <FlatList
        data={foodLogs}
        contentContainerStyle={{ gap: 10, paddingRight: 10}}
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
