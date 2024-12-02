import { View, Text, StyleSheet } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { gql, useMutation } from "@apollo/client";
import { useRouter } from "expo-router";

const mutation = gql`
  mutation MyMutation(
    $food_id: String!
    $carb: Int!
    $kcal: Int!
    $fat: Int!
    $fiber: Int!
    $protien: Int!
    $label: String!
    $user_id: String!
  ) {
    insertFood_log(
      food_id: $food_id
      carb: $carb
      kcal: $kcal
      fat: $fat
      fiber: $fiber
      protien: $protien
      label: $label
      user_id: $user_id
    ) {
      created_at
      food_id
      id
      carb
      kcal
      fat
      fiber
      protien
      label
      user_id
    }
  }
`;

const FoodListItem = ({ item }) => {
  const [logFood] = useMutation(mutation, {
    refetchQueries: ["foodLogsForDate"],
  });
  const router = useRouter();

  const onPlusPressed = async () => {
    await logFood({
      variables: {
        food_id: item.food.foodId,
        carb: item.food.nutrients.CHOCDF,
        kcal: item.food.nutrients.ENERC_KCAL,
        fat: item.food.nutrients.FAT,
        fiber: item.food.nutrients.FIBTG,
        protien: item.food.nutrients.PROCNT,
        label: item.food.label,
        user_id: "Eric zhang",
      },
    });
    router.back();
  };

  return (
    <View style={styles.container}>
      <View style={{ flex: 1, gap: 5 }}>
        <Text style={{ fontWeight: "bold", fontSize: 16 }}>
          {item.food.label}
        </Text>
        <Text style={{ color: "dimgray" }}>
          {parseInt(item.food.nutrients.CHOCDF)}g carb, {parseInt(item.food.nutrients.ENERC_KCAL)} cal, {parseInt(item.food.nutrients.FAT)}g fat, {parseInt(item.food.nutrients.FIBTG)}g fiber, {parseInt(item.food.nutrients.PROCNT)}g protein, {item.food.brand}
        </Text>
      </View>
      <AntDesign
        name="pluscircleo"
        size={24}
        color="royalblue"
        onPress={onPlusPressed}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f6f6f8",
    padding: 10,
    borderRadius: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});

export default FoodListItem;
