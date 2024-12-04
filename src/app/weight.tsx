import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import dayjs from 'dayjs';
import { AntDesign } from '@expo/vector-icons';

interface WeightLog {
  id: string;
  weight: number;
  date: string;
}

const WeightScreen = () => {
  const [weight, setWeight] = useState('');
  const [weightLogs, setWeightLogs] = useState<WeightLog[]>([]);
  const [currentMonth, setCurrentMonth] = useState(dayjs());

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
    const weightValue = parseFloat(weight);
    if (!weight || weightValue > 300) {
      alert('Please enter a valid weight (up to 300 kg)');
      return;
    }

    try {
      const newLog: WeightLog = {
        id: Date.now().toString(),
        weight: weightValue,
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

  const filteredLogs = weightLogs.filter(log =>
    dayjs(log.date).isSame(currentMonth, 'month')
  );

  const chartData = {
    labels: filteredLogs.map(log => dayjs(log.date).format('DD')),
    datasets: [{
      data: filteredLogs.map(log => log.weight),
    }],
  };

  const handleMonthChange = (direction: 'prev' | 'next') => {
    setCurrentMonth(currentMonth.add(direction === 'next' ? 1 : -1, 'month'));
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

      <View style={styles.monthNavigation}>
        <TouchableOpacity onPress={() => handleMonthChange('prev')}>
          <AntDesign name="left" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.monthLabel}>{currentMonth.format('MMMM YYYY')}</Text>
        <TouchableOpacity onPress={() => handleMonthChange('next')}>
          <AntDesign name="right" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {filteredLogs.length > 0 ? (
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
      ) : (
        <Text>No logs for this month</Text>
      )}

      <FlatList
        data={filteredLogs.slice().reverse()}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.logItem}>
            <Text>Weight: {item.weight} kg</Text>
            <Text>Date: {dayjs(item.date).format('DD/MM/YYYY')}</Text>
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
  monthNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  monthLabel: {
    fontSize: 16,
    fontWeight: 'bold',
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