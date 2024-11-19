import { Link } from "expo-router";
import {
  View,
  Text,
  FlatList,
  Button,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { gql, useQuery } from "@apollo/client";
import dayjs from "dayjs";
import FoodLogListItem from "../components/FoodLogListItem";
import { useState } from "react";

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

export default function HomeScreen() {
  const user_id = "Eric zhang";
  const today = dayjs().format("YYYY-MM-DD");
  const [date, setDate] = useState(today);

  // Fetch food logs
  const { data, loading, error } = useQuery(foodLogsQuery, {
    variables: { date, user_id },
  });

  // Functions to change the date
  const goToPreviousDay = () => {
    setDate(dayjs(date).subtract(1, 'day').format("YYYY-MM-DD"));
  };

  const goToNextDay = () => {
    setDate(dayjs(date).add(1, 'day').format("YYYY-MM-DD"));
  };

  // Determine if "Next Day" button should be disabled
  const isToday = date === today;

  // Calculate total calories
  const totalCalories = data?.foodLogsForDate?.reduce((sum: any, log: { kcal: any; }) => sum + log.kcal, 0) || 0;

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Button title="Previous" onPress={goToPreviousDay} />
        <Text style={styles.dateText}>{dayjs(date).format("MMMM DD, YYYY")}</Text>
        <Button
          title="Next"
          onPress={goToNextDay}
          disabled={isToday}
          color={isToday ? "gray" : "#007AFF"} // Change color when disabled
        />
      </View>

      <Text style={styles.caloriesText}>Total Calories: {totalCalories} kcal</Text>
      
      {loading && <ActivityIndicator size="large" color="gray" />}
      {error && <Text>Error loading data.</Text>}
      {data && (
        <FlatList
          data={data.foodLogsForDate}
          contentContainerStyle={{ gap: 5 }}
          renderItem={({ item }) => <FoodLogListItem item={item} />}
          keyExtractor={(item) => item.id.toString()}
        />
      )}
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
    marginVertical: 10,
  },
  dateText: {
    fontSize: 18,
    fontWeight: "500",
    color: "dimgray",
  },
  caloriesText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "black",
    marginVertical: 10,
    textAlign: "center",
  },
});
