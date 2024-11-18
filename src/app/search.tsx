import {
  View,
  Text,
  FlatList,
  Button,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect } from "react";
import { Link } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import FoodListItem from "../components/FoodListItem";
import {
  GestureHandlerRootView,
  TextInput,
} from "react-native-gesture-handler";
import { gql, useLazyQuery, useQuery } from "@apollo/client";
import { Ionicons } from "@expo/vector-icons";
import {
  CameraView,
  CameraType,
  useCameraPermissions,
  Camera,
} from "expo-camera";

const query = gql`
  query search($ingr: String, $upc: String) {
    search(ingr: $ingr, upc: $upc) {
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
  const [scannerEnabled, setScannerEnabled] = useState(false);
  const [runSearch, { data, loading, error }] = useLazyQuery(query);
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>("back");

  requestPermission();

  const performSearch = () => {
    runSearch({ variables: { ingr: search } });
  };

  useEffect(() => {
    if (data) {
      console.log(data);
    }
  }, [data]);

  // if (loading) {
  //   return <ActivityIndicator />;
  // }

  if (error) {
    return <Text>Failed to search</Text>;
  }

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  if (scannerEnabled) {
    return (
      <View style={styles.container}>
        <CameraView
          style={styles.camera}
          facing={facing}
          onBarcodeScanned={(data) => {
            runSearch({ variables: { upc: data.data } });
            setScannerEnabled(false);
          }}
        >
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={toggleCameraFacing}
            >
              <Text style={styles.text}>Flip Camera</Text>
            </TouchableOpacity>
          </View>

          <Ionicons
            onPress={() => setScannerEnabled(false)}
            name="close"
            size={40}
            color="dimgray"
            style={{ position: "absolute", right: 10, top: 10 }}
          />
        </CameraView>
      </View>
    );
  }

  const items = data?.search?.hints || [];

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search..."
            style={styles.input}
          />
          <Ionicons
            onPress={() => setScannerEnabled(true)}
            name="barcode-outline"
            size={32}
            color="dimgray"
          />
        </View>
        {search && <Button title="Search" onPress={performSearch} />}
        {loading && <ActivityIndicator />}
        <FlatList
          data={items}
          renderItem={({ item }) => <FoodListItem item={item} />}
          keyExtractor={(item, index) => `${item.label}-${index}`}
          ListEmptyComponent={() => <Text>Search a food</Text>}
          contentContainerStyle={{ gap: 5 }}
        />
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
    gap: 10,
  },
  input: {
    backgroundColor: "dimgray",
    padding: 10,
    borderRadius: 20,
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
});
