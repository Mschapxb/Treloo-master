import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { handleAdd } from '../firebase/Config';

const AddTaskScreen = () => {
  const [taskName, setTaskName] = useState('');
  const { boardId, columnId } = useRoute().params;
  const navigation = useNavigation();

  const addTask = async () => {
    if (taskName.trim() === '') {
      Alert.alert('Error', 'Task name cannot be empty!');
      return;
    }

    try {
      await handleAdd(`boards/${boardId}/columns/${columnId}/tasks`, { name: taskName });
      navigation.goBack();
    } catch (error) {
      console.error("Error adding task:", error);
      Alert.alert('Error', 'Error adding task. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Task</Text>
      <TextInput
        style={styles.input}
        placeholder="Task Name"
        placeholderTextColor="#888"
        value={taskName}
        onChangeText={setTaskName}
      />
      <Button title="Add Task" onPress={addTask} color="#FF4500" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#181818',
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    marginBottom: 24,
    color: '#FF4500',
  },
  input: {
    height: 48,
    marginBottom: 28,
    borderWidth: 1,
    borderColor: '#3E3E3E',
    padding: 12,
    fontSize: 16,
    borderRadius: 8,
    color: '#FFF',
    backgroundColor: '#242424',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
});


export default AddTaskScreen;
