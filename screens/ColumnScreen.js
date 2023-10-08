import React, { useEffect, useState } from 'react';
import { View, Text, Button, TextInput, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { db } from '../firebase/Config';
import { ref, onValue, push, set, createRef } from 'firebase/database';
import Task from '../components/Task';

const ColumnScreen = () => {
  const [tasks, setTasks] = useState({});
  const [newTaskName, setNewTaskName] = useState('');
  const navigation = useNavigation();
  const route = useRoute();
  const { boardId, columnId, columnName } = route.params;

  useEffect(() => {
    const columnsRef = ref(db, `boards/${boardId}/columns`);
    const unsubscribe = onValue(columnsRef, (snapshot) => {
      const columnTasksData = {};
      snapshot.forEach((columnSnapshot) => {
        const columnData = columnSnapshot.val();
        const currentColumnId = columnSnapshot.key;
        if (columnData.tasks) {
          const tasksData = [];
          Object.keys(columnData.tasks).forEach((taskId) => {
            const taskData = columnData.tasks[taskId];
            if (taskData.columnId === currentColumnId) {
              tasksData.push({
                id: taskId,
                ...taskData,
              });
            }
          });
          columnTasksData[currentColumnId] = tasksData;
        }
      });
      setTasks(columnTasksData);
    });

    return () => unsubscribe();
  }, [boardId]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{columnName}</Text>
      <TextInput
        style={styles.input}
        placeholder="New Task Name"
        placeholderTextColor="#757575"
        value={newTaskName}
        onChangeText={setNewTaskName}
      />
      <Button title="Add Task" onPress={handleAddTask} color="#BB86FC" />
      <ScrollView style={styles.tasksContainer}>
        {tasks[columnId] && tasks[columnId].map((task) => (
          <Task 
            key={task.id} 
            task={task} 
            boardId={boardId} 
            columnId={columnId}
          />
        ))}
      </ScrollView>
    </View>
);
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#121212',
  },
  title: {
    fontSize: 26,
    fontWeight: '600',
    color: '#BB86FC',
    marginBottom: 14,
  },
  input: {
    height: 44,
    backgroundColor: '#242424',
    borderColor: '#3E3E3E',
    borderWidth: 1,
    marginBottom: 24,
    paddingLeft: 12,
    borderRadius: 10,
    color: '#BB86FC',
  },
  tasksContainer: {
    marginTop: 12,
  },
  task: {
    fontSize: 18,
    backgroundColor: '#2D2D2D',
    padding: 14,
    marginVertical: 8,
    borderRadius: 8,
    width: Dimensions.get('window').width - 40,
    borderColor: '#3E3E3E',
    borderWidth: 0.5,
    color: '#BB86FC',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
});


export default ColumnScreen;