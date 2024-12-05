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
import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Box } from '@mui/material';

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
  const [username, setUsername] = useState<string | null>(null); // State for username
  const router = useRouter();
  const [goal, setGoal] = useState<string>('');
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
  const intGoal = parseInt(goal,10)
  const calDisp = totalCalories

  


  return (
    <View style={styles.container}>
        <Text style={styles.welcomeText}>{`Welcome, ${username}`}</Text>
        {/*<View style={styles.headerRow}>
        <Text style={styles.subtitle}>Total Calories</Text>
        <Text style={{ fontSize: 18 }}>{`${totalCalories} kcal`}</Text>
      </View>
      <View style={styles.headerRow}>
        <Text style={styles.subtitle}>Total Carbs</Text>
        <Text style={{ fontSize: 18 }}>{`${totalCarbs} carbs`}</Text>
      </View>
      <View style={styles.headerRow}>
        <Text style={styles.subtitle}>Total Fat</Text>
        <Text style={{ fontSize: 18 }}>{`${totalFat} Fat`}</Text>
      </View>
      <View style={styles.headerRow}>
        <Text style={styles.subtitle}>Total Fiber</Text>
        <Text style={{ fontSize: 18 }}>{`${totalFiber} fiber`}</Text>
      </View>
      <View style={styles.headerRow}>
        <Text style={styles.subtitle}>Total Protein</Text>
        <Text style={{ fontSize: 18 }}>{`${totalProtein} protein`}</Text>
      </View>*/}
      <center>
      <View style={styles.gaugeContainer}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={{ xs: 1, md: 2 }}>
        <MultiRingGauge
          calories={totalCalories}
          carbs={totalCarbs}
          fats={totalFat}
          fibers={totalFiber}
          protein={totalProtein}
          carbsGoal={parseInt(carbGoal,10) ? parseInt(carbGoal,10) : 0}
          calsGoal = {parseInt(calGoal,10) ? parseInt(calGoal,10) : 0}
          fatsGoal = {parseInt(fatGoal,10) ? parseInt(fatGoal,10) : 0}
          fibersGoal = {parseInt(fiberGoal,10) ? parseInt(fiberGoal,10) : 0}
          proteinsGoal = {parseInt(proteinGoal,10) ? parseInt(proteinGoal,10) : 0}
        />
        </Stack>
      </View>
      </center>
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
  gaugeContainer: {
    flex: 1, // Take full height and width available
    justifyContent: 'center', // Center content vertically
    alignItems: 'center', // Center content horizontally
    marginBottom: 20, // Adjust margin if needed
  },
}); 
interface MultiRingGaugeProps {
  calories: number;
  carbs: number;
  fats: number;
  fibers: number;
  protein: number;
  carbsGoal : number
  calsGoal : number
  fatsGoal : number
  fibersGoal : number
  proteinsGoal : number

}

const MultiRingGauge: React.FC<MultiRingGaugeProps> = ({
  calories,
  carbs,
  fats,
  fibers,
  protein,
  carbsGoal,
  calsGoal,
  fatsGoal,
  fibersGoal,
  proteinsGoal,
}) => {
  return (
    <Stack direction="row" spacing={4} alignItems="center" justifyContent="center">
      {/* Gauge with 5 Rings */}
      <div style={{ position: 'relative', width: 300, height: 300 }}>
        {/* Outer Gauge Ring - Calories */}
        <Gauge
          width={300}
          height={300}
          value={calories}
          valueMax={calsGoal}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 1,
          }}
          sx={(theme) => ({
            [`& .${gaugeClasses.valueText}`]: {
              fontSize: 0,
            },
            [`& .${gaugeClasses.valueArc}`]: {
              fill: '#52b202',
            },
            [`& .${gaugeClasses.referenceArc}`]: {
              fill: theme.palette.text.disabled,
            },
          })}
        />
        {/* 2nd Ring - Carbs */}
        <Gauge
          width={250}
          height={250}
          value={carbs}
          valueMax={carbsGoal}
          style={{
            position: 'absolute',
            top: 25,
            left: 25,
            zIndex: 2,
          }}
          sx={(theme) => ({
            [`& .${gaugeClasses.valueText}`]: {
              fontSize: 0,
            },
            [`& .${gaugeClasses.valueArc}`]: {
              fill: '#e54020',
            },
            [`& .${gaugeClasses.referenceArc}`]: {
              fill: theme.palette.text.disabled,
            },
          })}
        />
        {/* 3rd Ring - Fats */}
        <Gauge
          width={200}
          height={200}
          value={fats}
          valueMax={fatsGoal}
          style={{
            position: 'absolute',
            top: 50,
            left: 50,
            zIndex: 3,
          }}
          sx={(theme) => ({
            [`& .${gaugeClasses.valueText}`]: {
              fontSize: 0,
            },
            [`& .${gaugeClasses.valueArc}`]: {
              fill: '#6620e5',
            },
            [`& .${gaugeClasses.referenceArc}`]: {
              fill: theme.palette.text.disabled,
            },
          })}
        />
        {/* 4th Ring - Fibers */}
        <Gauge
          width={150}
          height={150}
          value={fibers}
          valueMax={fibersGoal}
          style={{
            position: 'absolute',
            top: 75,
            left: 75,
            zIndex: 4,
          }}
          sx={(theme) => ({
            [`& .${gaugeClasses.valueText}`]: {
              fontSize: 0,
            },
            [`& .${gaugeClasses.valueArc}`]: {
              fill: '#e5ab20',
            },
            [`& .${gaugeClasses.referenceArc}`]: {
              fill: theme.palette.text.disabled,
            },
          })}
        />
        {/* 5th Ring - Protein */}
        <Gauge
          width={100}
          height={100}
          value={protein}
          valueMax={proteinsGoal}
          style={{
            position: 'absolute',
            top: 100,
            left: 100,
            zIndex: 5,
          }}
          sx={(theme) => ({
            [`& .${gaugeClasses.valueText}`]: {
              fontSize: 0,
            },
            [`& .${gaugeClasses.valueArc}`]: {
              fill: '#20e5db',
            },
            [`& .${gaugeClasses.referenceArc}`]: {
              fill: theme.palette.text.disabled,
            },
          })}
          
        />
      </div>

      {/* Legend */}
      <Box>
        <Stack direction="column" spacing={1}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Box
              sx={{
                width: 20,
                height: 20,
                backgroundColor: '#52b202',
              }}
            />
            <Typography variant="body1" component="div">
              Calories ({calories}kcal) / {calsGoal}
            </Typography>
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center">
            <Box
              sx={{
                width: 20,
                height: 20,
                backgroundColor: '#e54020',
              }}
            />
            <Typography variant="body1" component="div">
              Carbs ({carbs}g) / {carbsGoal}
            </Typography>
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center">
            <Box
              sx={{
                width: 20,
                height: 20,
                backgroundColor: '#6620e5',
              }}
            />
            <Typography variant="body1" component="div">
              Fats ({fats}g) / {fatsGoal}
            </Typography>
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center">
            <Box
              sx={{
                width: 20,
                height: 20,
                backgroundColor: '#e5ab20',
              }}
            />
            <Typography variant="body1" component="div">
              Fibers ({fibers}g) / {fibersGoal}
            </Typography>
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center">
            <Box
              sx={{
                width: 20,
                height: 20,
                backgroundColor: '#20e5db',
              }}
            />
            <Typography variant="body1" component="div">
              Protein ({protein}g) / {proteinsGoal}
            </Typography>
          </Stack>
        </Stack>
      </Box>
    </Stack>
  );
};