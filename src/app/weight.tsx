import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

interface WeightLog {
  id: string;
  weight: number;
  date: string;
}

const WeightScreen = () => {
  const [weight, setWeight] = useState('');
  const [weightLogs, setWeightLogs] = useState<WeightLog[]>([]);

  // Load weight logs from AsyncStorage on component mount
  useEffect(() => {
    loadWeightLogs();
  }, []);

  const loadWeightLogs = async () => {
    try {
      const logs = await AsyncStorage.getItem('weightLogs');
      if (logs) {
        setWeightLogs(JSON.parse(logs));
      }
    } catch (error) {
      console.error('Error loading weight logs:', error);
    }
  };

  const handleAddWeight = async () => {
    if (!weight) {
      alert('Please enter a weight');
      return;
    }

    try {
      const newLog: WeightLog = {
        id: Date.now().toString(),
        weight: parseFloat(weight),
        date: new Date().toISOString(),
      };

      const updatedLogs = [...weightLogs, newLog];
      await AsyncStorage.setItem('weightLogs', JSON.stringify(updatedLogs));
      setWeightLogs(updatedLogs);
      setWeight('');
    } catch (error) {
      console.error('Error saving weight:', error);
      alert('Failed to save weight');
    }
  };

  const chartData = {
    labels: weightLogs
      .slice(-7)
      .map(log => new Date(log.date).toLocaleDateString()),
    datasets: [{
      data: weightLogs.slice(-7).map(log => log.weight),
    }],
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={weight}
          onChangeText={setWeight}
          placeholder="Enter weight (kg)"
          keyboardType="numeric"
        />
        <Button title="Add Weight" onPress={handleAddWeight} />
      </View>

      {weightLogs.length > 0 && (
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Weight History</Text>
          <LineChart
            data={chartData}
            width={Dimensions.get('window').width - 40}
            height={220}
            chartConfig={{
              backgroundColor: '#ffffff',
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#ffffff',
              decimalPlaces: 1,
              color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`,
              style: {
                borderRadius: 16,
              },
            }}
            style={styles.chart}
          />
        </View>
      )}

      <FlatList
        data={weightLogs.slice().reverse()}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.logItem}>
            <Text>Weight: {item.weight} kg</Text>
            <Text>Date: {new Date(item.date).toLocaleDateString()}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 10,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  chartContainer: {
    marginVertical: 20,
    alignItems: 'center',
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  logItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
});

export default WeightScreen; 