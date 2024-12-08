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
import FoodLogListItem from "../../components/FoodLogListItem";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CircularProgressBase } from 'react-native-circular-progress-indicator';

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
  const [username, setUsername] = useState<string | null>(null);
  const router = useRouter();
  const user_id = "Eric zhang";
  const date = dayjs().format("YYYY-MM-DD");
  const [carbGoal, setCarbGoal] = useState<string>('');
  const [calGoal, setCalGoal] = useState<string>('');
  const [proteinGoal, setProteinGoal] = useState<string>('');
  const [fatGoal, setFatGoal] = useState<string>('');
  const [fiberGoal, setFiberGoal] = useState<string>('');

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
        const name = await AsyncStorage.getItem("username")
        const savedGoals = await AsyncStorage.getItem("goals");
        if(name != null){
          setUsername(JSON.parse(name))
        }
        if(savedGoals){
          const goalsData = JSON.parse(savedGoals);
          setCarbGoal(goalsData.carbs || '');
          setCalGoal(goalsData.cals || '');
          setProteinGoal(goalsData.protein || '');
          setFatGoal(goalsData.fat || '');
          setFiberGoal(goalsData.fiber || '');
        }
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
  const totalCarbs = foodLogs.reduce((sum, log) => sum + (log.carb || 0), 0);
  const totalFat = foodLogs.reduce((sum, log) => sum + (log.fat || 0), 0);
  const totalFiber = foodLogs.reduce((sum, log) => sum + (log.fiber || 0), 0);
  const totalProtein = foodLogs.reduce((sum, log) => sum + (log.protien || 0), 0);

  // Calculate progress percentage
  const calcProgress = (actual: number, goal: string) => {
    const goalValue = parseFloat(goal);
    const progress = goalValue > 0 ? (actual / goalValue) * 100 : 0;
    return parseFloat(Math.min(progress, 100).toFixed(2));
  };
  
  const progressCalories = calcProgress(totalCalories, calGoal);
  const progressCarbs = calcProgress(totalCarbs, carbGoal);
  const progressProtein = calcProgress(totalProtein, proteinGoal);
  const progressFat = calcProgress(totalFat, fatGoal);
  const progressFiber = calcProgress(totalFiber, fiberGoal);

  const props = {
    activeStrokeWidth: 25,
    inActiveStrokeWidth: 25,
    inActiveStrokeOpacity: 0.2,
  };

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>{`Welcome, ${username}`}</Text>

      <View style={styles.mainContent}>
        <View style={styles.gaugeContainer}>
          {/* Calories Progress */}
          <CircularProgressBase
            {...props}
            value={progressCalories}
            radius={150}
            activeStrokeColor="#e84118"
            inActiveStrokeColor="#e84118"
          >
            {/* Carbs Progress */}
            <CircularProgressBase
              {...props}
              value={progressCarbs}
              radius={125}
              activeStrokeColor="#badc58"
              inActiveStrokeColor="#badc58"
            >
              {/* Protein Progress */}
              <CircularProgressBase
                {...props}
                value={progressProtein}
                radius={100}
                activeStrokeColor="#18dcff"
                inActiveStrokeColor="#18dcff"
              >
                {/* Fat Progress */}
                <CircularProgressBase
                  {...props}
                  value={progressFat}
                  radius={75}
                  activeStrokeColor="#feca57"
                  inActiveStrokeColor="#feca57"
                >
                  {/* Fiber Progress */}
                  <CircularProgressBase
                    {...props}
                    value={progressFiber}
                    radius={50}
                    activeStrokeColor="#a29bfe"
                    inActiveStrokeColor="#a29bfe"
                  />
                </CircularProgressBase>
              </CircularProgressBase>
            </CircularProgressBase>
          </CircularProgressBase>
        </View>

        {/* Legend Section */}
        <View style={styles.legendContainer}>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: "#e84118" }]} />
            <Text style={styles.legendText}>Calories: {progressCalories}%</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: "#badc58" }]} />
            <Text style={styles.legendText}>Carbs: {progressCarbs}%</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: "#18dcff" }]} />
            <Text style={styles.legendText}>Protein: {progressProtein}%</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: "#feca57" }]} />
            <Text style={styles.legendText}>Fat: {progressFat}%</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: "#a29bfe" }]} />
            <Text style={styles.legendText}>Fiber: {progressFiber}%</Text>
          </View>
        </View>
      </View>

      <View style={styles.headerRow}>
        <Text style={styles.subtitle}>Today's Log</Text>
        {/* <Link href={"/search"} asChild>
          <Button title="ADD FOOD" />
        </Link>
        <Link href={"/weight"} asChild>
          <Button title="WEIGHT" />
        </Link>
        <Button title="Logout" onPress={handleLogout} />
        <Link href={"/foodLog"} asChild>
          <Button title="View Logs" />
        </Link> */}
      </View>
      <FlatList
        data={foodLogs}
        contentContainerStyle={{ gap: 10 }}
        renderItem={({ item }) => <FoodLogListItem item={item} />}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#22272b',
  },
  mainContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  gaugeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  legendContainer: {
    marginLeft: 20,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  legendColor: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 10,
  },
  legendText: {
    color: "#fcfbf8",
    fontSize: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: "#fcfbf8",
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fcfbf8",
    marginBottom: 10,
  },
});

