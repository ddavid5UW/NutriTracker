import {
  View,
  Text,
  FlatList,
  Button,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { Link } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import FoodListItem from "../../components/FoodListItem";
import {
  GestureHandlerRootView,
  TextInput,
} from "react-native-gesture-handler";
import { gql, useLazyQuery } from "@apollo/client";
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
          image
          nutrients {
            CHOCDF
            ENERC_KCAL
            FAT
            FIBTG
            PROCNT
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
    // setSearch("");
  };

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
              style={{
                flex: 1,
                alignSelf: "flex-end",
                alignItems: "center",
              }}
              onPress={toggleCameraFacing}
            >
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: "bold",
                  color: "white",
                  backgroundColor: "#22272b",
                  borderColor: "dimgrey",
                  borderRadius: 15,
                  borderWidth: 1,
                  paddingLeft:10,
                  paddingRight:10,
                  paddingBottom: 5,
                  paddingTop: 5,

                }}
              >
                Flip Camera
              </Text>
            </TouchableOpacity>
          </View>

          <Ionicons
            onPress={() => setScannerEnabled(false)}
            name="close"
            size={40}
            color="#624580"
            style={{ position: "absolute", right: 10, top: 10 }}
          />
        </CameraView>
      </View>
    );
  }

  const items = data?.search?.hints || [];
  // console.log(data);

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
            color="#9856db"
          />
        </View>
        {search && (
          <TouchableOpacity style={styles.searchButton} onPress={performSearch}>
            <Text style={styles.searchButtonText}>Search</Text>
          </TouchableOpacity>
        )}
        {loading && <ActivityIndicator />}
        <FlatList
          style={{ paddingRight: 10 }}
          data={items}
          renderItem={({ item }) => <FoodListItem item={item} />}
          keyExtractor={(item) => item.label}
          ListEmptyComponent={() => <Text></Text>}
          contentContainerStyle={{ gap: 10 }}
        />
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#22272b",
    padding: 10,
    gap: 10,
  },
  input: {
    backgroundColor: "white",
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
    color: "white",
    backgroundColor: "white",
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
  searchButton: {
    backgroundColor: "#9856db",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  searchButtonText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 18,
  },
});
