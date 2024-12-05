import { View, Text, StyleSheet, Image } from "react-native";
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
    $image: String!
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
      image: $image
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
      image
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
    console.log(item.food.image)
    if(item.food.image === null){
      await logFood({
        variables: {
          food_id: item.food.foodId,
          carb: item.food.nutrients.CHOCDF,
          kcal: item.food.nutrients.ENERC_KCAL,
          fat: item.food.nutrients.FAT,
          fiber: item.food.nutrients.FIBTG,
          protien: item.food.nutrients.PROCNT,
          image: "",
          label: item.food.label,
          user_id: "Eric zhang",
        },
      });
    }
    else{
      await logFood({
        variables: {
          food_id: item.food.foodId,
          carb: item.food.nutrients.CHOCDF,
          kcal: item.food.nutrients.ENERC_KCAL,
          fat: item.food.nutrients.FAT,
          fiber: item.food.nutrients.FIBTG,
          protien: item.food.nutrients.PROCNT,
          image: item.food.image,
          label: item.food.label,
          user_id: "Eric zhang",
        },
      });
    }
    router.back();
  };

  return (
    <View style={styles.container}>
      <View style={{ flex: 1, gap: 5 }}>
        <Text style={{ fontWeight: "bold", fontSize: 16, color: "#fcfbf8" }}>
          {item.food.label}
        </Text>
        <Text style={{ color: "#fcfbf8" }}>
          {parseInt(item.food.nutrients.CHOCDF)}g carb,{" "}
          {parseInt(item.food.nutrients.ENERC_KCAL)} cal,{" "}
          {parseInt(item.food.nutrients.FAT)}g fat,{" "}
          {parseInt(item.food.nutrients.FIBTG)}g fiber,{" "}
          {parseInt(item.food.nutrients.PROCNT)}g protein, {item.food.brand}
        </Text>
      </View>
      {item.food.image && (
        <Image
          source={{ uri: item.food.image }}
          style={styles.image}
          resizeMode="contain"
        />
      )}
      <AntDesign
        name="pluscircleo"
        size={24}
        color="white"
        onPress={onPlusPressed}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#4c4c54",
    padding: 10,
    borderRadius: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  image: {
    width: 100,
    height: 100,
    marginRight: 10,
    borderRadius: 8,
  }
});

export default FoodListItem;
