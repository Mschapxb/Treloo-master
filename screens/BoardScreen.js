import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Button, StyleSheet, TouchableOpacity, Dimensions, Modal, TextInput, Alert  } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { db, handleDelete } from '../firebase/Config';
import { ref, onValue, update } from 'firebase/database';
import Task from '../components/Task';

const BoardScreen = () => {
  const [columns, setColumns] = useState([]);
  const navigation = useNavigation();
  const route = useRoute();
  const { boardId, boardName } = route.params;
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingColumn, setEditingColumn] = useState(null);
  const [newColumnName, setNewColumnName] = useState('');


  useEffect(() => {
    const columnsRef = ref(db, `boards/${boardId}/columns`);
    const unsubscribe = onValue(columnsRef, (snapshot) => {
      try {
        const fetchedColumns = [];
        snapshot.forEach((childSnapshot) => {
          const columnData = childSnapshot.val();
          const tasksArray = columnData.tasks 
            ? Object.keys(columnData.tasks).map(key => ({
                id: key,
                ...columnData.tasks[key],
              }))
            : [];
          fetchedColumns.push({
            id: childSnapshot.key,
            ...columnData,
            tasks: tasksArray,
          });
        });
        setColumns(fetchedColumns);
      } catch (error) {
        console.error("Error fetching columns:", error);
      }
    });
  
    return () => unsubscribe();
  }, []);

  const showEditModal = (column) => {
    setEditingColumn(column);
    setNewColumnName(column.name);
    setIsEditModalVisible(true);
  };

  const navigateToAddColumn = () => {
    navigation.navigate('AddColumn', { boardId });
  };

  const handleLongPress = (column) => {
    Alert.alert(
      "Column Options",
      "Choose an option",
      [
        { text: "Modifier", onPress: () => handleEditColumn(column) },
        { text: "Supprimer", onPress: () => confirmDeleteColumn(boardId, column.id, column.name) },
        { text: "annuler" }
      ],
      { cancelable: true }
    );
  };

  const handleEditColumn = (column) => {
    showEditModal(column);
  };

  
  const handleEditColumnSubmit = () => {
    if (newColumnName) {
      const columnRef = ref(db, `boards/${boardId}/columns/${editingColumn.id}`);
      update(columnRef, { name: newColumnName });
    }
    setIsEditModalVisible(false);
    setEditingColumn(null);
    setNewColumnName('');
  };

  const deleteColumn = async (boardId, columnId) => {
    try {
      if (!boardId || !columnId) {
        console.error('Invalid board or column reference: ', boardId, columnId);
        alert('Cannot delete column due to invalid reference.');
        return;
      }
      await handleDelete(`boards/${boardId}/columns/${columnId}`);
      console.log('Column deleted!');
    } catch (error) {
      console.error('Error deleting column:', error);
      alert('Error deleting column. Please try again.');
    }
  };
  

  const confirmDeleteColumn = (boardId, columnId, columnName) => {
    Alert.alert(
      "Supprimer la Colonne",
      `Êtes-vous sûr de vouloir supprimer la colonne "${columnName}"?`,
      [
        {
          text: "Non",
          style: "non"
        },
        { text: "OK", onPress: () => deleteColumn(boardId, columnId) }
      ],
      { cancelable: false }
    );
  };
  

  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{boardName}</Text>
      <Button title="Add Column" onPress={navigateToAddColumn} color="#BB86FC" />
      <ScrollView horizontal style={styles.columnsContainer}>
        {columns.map((column) => (
          <TouchableOpacity 
            key={column.id} 
            style={styles.column}
            onPress={() => navigation.navigate('AddTask', { boardId, columnId: column.id })}
            onLongPress={() => handleLongPress(column)}
          >
            <Text style={styles.columnTitle}>{column.name}</Text>
            <View style={styles.tasksContainer}>
              {column.tasks?.map((task) => (
                <Task key={task.id} task={task} boardId={boardId} columnId={column.id} />
              ))}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isEditModalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setIsEditModalVisible(!isEditModalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Edit Column Name</Text>
            <TextInput 
              style={styles.input}
              placeholder="Column Name"
              placeholderTextColor="#666"
              value={newColumnName}
              onChangeText={setNewColumnName}
            />
            <Button onPress={handleEditColumnSubmit} title="Submit" color="#BB86FC" />
            <Button onPress={() => setIsEditModalVisible(false)} title="Cancel" color="#BB86FC" />
          </View>
        </View>
      </Modal>
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
    fontSize: 30,
    fontWeight: '600',
    marginBottom: 16,
    color: '#BB86FC',
  },
  columnsContainer: {
    flexDirection: 'row',
    flex: 1,
    marginTop: 16,
  },
  column: {
    width: 160,
    padding: 16,
    borderWidth: 1,
    borderColor: '#3E3E3E',
    marginRight: 12,
    borderRadius: 12,
    backgroundColor: '#2D2D2D',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  columnTitle: {
    fontSize: 24,
    fontWeight: '500',
    marginBottom: 12,
    color: '#BB86FC',
  },
  tasksContainer: {
    maxHeight: 220,
    height: windowHeight - 2,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    width: '85%',
    backgroundColor: "#2D2D2D",
    padding: 28,
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 6
  },
  modalText: {
    marginBottom: 20,
    textAlign: "center",
    fontSize: 22,
    fontWeight: '500',
    color: '#BB86FC',
  },
  input: {
    width: '100%',
    height: 44,
    backgroundColor: '#242424',
    borderColor: '#3E3E3E',
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 12,
    borderRadius: 10,
    color: '#BB86FC',
  },
});

export default BoardScreen;


