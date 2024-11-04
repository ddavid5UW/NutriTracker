import {
  View,
  Text,
  FlatList,
  Button,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { Link } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import FoodListItem from "../components/FoodListItem";
import {
  GestureHandlerRootView,
  TextInput,
} from "react-native-gesture-handler";
import { gql, useLazyQuery } from "@apollo/client";

const query = gql`
  query search($ingr: String) {
    search(ingr: $ingr) {
      text
      hints {
        food {
          label
          brand
          foodId
          nutrients {
            ENERC_KCAL
          }
        }
      }
    }
  }
`;

export default function SearchScreen() {
  const [search, setSearch] = useState("");

  const [runSearch, { data, loading, error }] = useLazyQuery(query);

  const performSearch = () => {
    runSearch({ variables: { ingr: search } });
    // setSearch("");
  };

  // if (loading) {
  //   return <ActivityIndicator />;
  // }

  if (error) {
    return <Text>Failed to search</Text>;
  }

  const items = data?.search?.hints || [];

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          value={search}
          onChangeText={(text) => setSearch(text)}
          placeholder="Search foods"
        />
        <Button title="Search" onPress={performSearch} />
        {loading && <ActivityIndicator />}
        <FlatList
          data={items}
          renderItem={({ item }) => <FoodListItem item={item} />}
          keyExtractor={(item) => item.label}
          ListEmptyComponent={() => <Text>Search a food</Text>}
          contentContainerStyle={{ gap: 5 }}
        />
      </View>
    </GestureHandlerRootView>
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
  input: {
    backgroundColor: "dimgray",
    padding: 10,
    borderRadius: 20,
  },
});
