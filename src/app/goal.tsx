import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
} from "react-native";

const GoalsPage: React.FC = () => {
  // State variables for goals
  const [carbs, setCarbs] = useState<string>("");
  const [cals, setCals] = useState<string>("");
  const [protein, setProtein] = useState<string>("");
  const [fat, setFat] = useState<string>("");
  const [fiber, setFiber] = useState<string>("");

  const router = useRouter();

  useEffect(() => {
    const loadGoals = async () => {
      try {
        const savedGoals = await AsyncStorage.getItem("goals");
        if (savedGoals) {
          const goalsData = JSON.parse(savedGoals);
          setCarbs(goalsData.carbs || "");
          setCals(goalsData.cals || "");
          setProtein(goalsData.protein || "");
          setFat(goalsData.fat || "");
          setFiber(goalsData.fiber || "");
        }
      } catch (error) {
        console.log("Error loading goals:", error);
      }
    };

    loadGoals();
  }, []);

  const handleSubmit = async () => {
    if (carbs && cals && protein && fat && fiber) {
      try {
        const goalsData = {
          carbs,
          cals,
          protein,
          fat,
          fiber,
        };
        await AsyncStorage.setItem("goals", JSON.stringify(goalsData));
        router.replace("/");
      } catch (error) {
        console.error("Error saving goals data", error);
      }
    } else {
      Alert.alert("Invalid Input", "Please fill in all goal fields.");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.subtitle}>Set Your Goals</Text>
      </View>

      <View style={styles.formGroup}>
        <Text style={{ color: "white", paddingLeft: 5, paddingBottom: 3 }}>
          Carbohydrates (g):
        </Text>
        <TextInput
          style={styles.input}
          value={carbs}
          placeholder={carbs ? carbs : "Enter Carbs Goal"}
          keyboardType="numeric"
          onChangeText={setCarbs}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={{ color: "white", paddingLeft: 5, paddingBottom: 3 }}>
          Calories (kcal):
        </Text>
        <TextInput
          style={styles.input}
          value={cals}
          placeholder={cals ? cals : "Enter Calories Goal"}
          keyboardType="numeric"
          onChangeText={setCals}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={{ color: "white", paddingLeft: 5, paddingBottom: 3 }}>
          Protein (g):
        </Text>
        <TextInput
          style={styles.input}
          value={protein}
          placeholder={protein ? protein : "Enter Protein Goal"}
          keyboardType="numeric"
          onChangeText={setProtein}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={{ color: "white", paddingLeft: 5, paddingBottom: 3 }}>
          Fat (g):
        </Text>
        <TextInput
          style={styles.input}
          value={fat}
          placeholder={fat ? fat : "Enter Fat Goal"}
          keyboardType="numeric"
          onChangeText={setFat}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={{ color: "white", paddingLeft: 5, paddingBottom: 3 }}>
          Fiber (g):
        </Text>
        <TextInput
          style={styles.input}
          value={fiber}
          placeholder={fiber ? fiber : "Enter Fiber Goal"}
          keyboardType="numeric"
          onChangeText={setFiber}
        />
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.searchButton} onPress={handleSubmit}>
          <Text style={styles.searchButtonText}>Save Goals</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
    backgroundColor: "#22272b",
  },
  headerRow: {
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  formGroup: {
    marginBottom: 15,
  },
  label: {
    fontWeight: "bold",
    color: "white",
  },
  input: {
    borderWidth: 2,
    borderColor: "#ccc",
    borderRadius: 15,
    padding: 10,
    backgroundColor: "white",
  },
  buttonRow: {
    marginTop: 20,
    alignItems: "center",
  },
  searchButton: {
    backgroundColor: '#9856db',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  searchButtonText: {
    color: '#ffffff',
    fontWeight: "bold",
    fontSize: 18,
  },
});

export default GoalsPage;
