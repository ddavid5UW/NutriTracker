import { View, Text, StyleSheet, Image } from "react-native";
import { AntDesign } from "@expo/vector-icons";
// import { gql, useMutation } from '@apollo/client';
import { useRouter } from "expo-router";

const FoodLogListItem = ({ item }) => {
  return (
    <View style={styles.container}>
      <View style={{ flex: 1, gap: 5 }}>
        <Text style={{ fontWeight: "bold", fontSize: 16, color:"#fcfbf8" }}>{item.label}</Text>
        <Text style={{ color:"#fcfbf8" }}>{item.carb}g carb, {item.kcal} cal, {item.fat}g fat, {item.fiber}g fiber, {item.protien}g protein</Text>
      </View>
      {item.image && (
        <Image
          source={{ uri: item.image }}
          style={styles.image}
          resizeMode="contain"
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#4c4c54",
    padding: 10,
    borderRadius: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  image: {
    width: 100,
    height: 100,
    marginRight: 10,
    borderRadius: 8,
  },
});

export default FoodLogListItem;
