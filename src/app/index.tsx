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
  const user_id = "Eric zhang";
  const date = dayjs().format("YYYY-MM-DD");

  // Fetch food logs
  const { data, loading, error } = useQuery(foodLogsQuery, {
    variables: { date, user_id },
  });

  // Fetch total calories for the day
  const {
    data: kcalData,
    loading: kcalLoading,
    error: kcalError,
  } = useQuery(kcalTotalQuery, {
    variables: { date, user_id },
  });

  if (loading || kcalLoading) {
    return <ActivityIndicator />;
  }

  if (error || kcalError) {
    return <Text>Failed to fetch data</Text>;
  }

  const totalCalories = kcalData?.KcalTotalForDate?.total_kcal || 0;

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.subtitle}>Total Calories</Text>
        <Text style={{fontSize: 18}}>{`${totalCalories}`}</Text>
      </View>
      <View style={styles.headerRow}>
        <Text style={styles.subtitle}>Today's Log</Text>
        <Link href={"/search"} asChild>
          <Button title="ADD FOOD" />
        </Link>
        <Link href={"/foodLog"} asChild>
          <Button title="View Logs" />
        </Link>
      </View>
      <FlatList
        data={data.foodLogsForDate}
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
