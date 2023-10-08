import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ref, update, onValue } from 'firebase/database';
import { db, handleDelete, handleEdit } from '../firebase/Config';

const Task = ({ task, boardId, columnId }) => {
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [descriptionModalVisible, setDescriptionModalVisible] = useState(false);
  const [descriptionEditModalVisible, setDescriptionEditModalVisible] = useState(false);
  const [moveModalVisible, setMoveModalVisible] = useState(false);

  const [newTaskName, setNewTaskName] = useState(task.name);
  const [newDescription, setNewDescription] = useState(task.description || '');
  const [selectedColumnId, setSelectedColumnId] = useState('');
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    const columnsRef = ref(db, `boards/${boardId}/columns`);
    const unsubscribe = onValue(columnsRef, (snapshot) => {
      const fetchedColumns = [];
      snapshot.forEach((child) => {
        const columnData = child.val();
        const tasksArray = columnData.tasks 
          ? Object.keys(columnData.tasks).map(key => ({
              id: key,
              ...columnData.tasks[key],
            }))
          : [];
        fetchedColumns.push({
          id: child.key,
          ...columnData,
          tasks: tasksArray,
        });
      });
      setColumns(fetchedColumns);
    });

    return () => unsubscribe();
  }, [boardId]);

  const isValidReference = () => {
    if (!boardId || !columnId || !task.id) {
      console.error('Invalid references:', { boardId, columnId, taskId: task.id });
      alert('Action cannot be completed due to invalid references.');
      return false;
    }
    return true;
  };

  const handleTaskDelete = async () => {
    if (!isValidReference()) return;

    try {
      await handleDelete(`boards/${boardId}/columns/${columnId}/tasks/${task.id}`);
      console.log('Task deleted!');
    } catch (error) {
      console.error('Error deleting task:', error);
      alert('Error deleting task. Please try again.');
    }
  };

  const handleTaskEdit = async (path, data) => {
    if (!isValidReference()) return;

    try {
      await handleEdit(path, data);
      console.log('Task updated!');
    } catch (error) {
      console.error('Error editing task:', error);
      alert('Error editing task. Please try again.');
    }
  };

  const handleMoveTask = async () => {
    if (!isValidReference() || !selectedColumnId) {
      console.error('Invalid move references:', { boardId, columnId, selectedColumnId, taskId: task.id });
      alert('Cannot move task due to invalid references.');
      return;
    }

    const fromPath = `boards/${boardId}/columns/${columnId}/tasks/${task.id}`;
    const toPath = `boards/${boardId}/columns/${selectedColumnId}/tasks/${task.id}`;
    const updates = { [fromPath]: null, [toPath]: task };

    try {
      await update(ref(db), updates);
      console.log('Task moved successfully!');
      setMoveModalVisible(false);
    } catch (error) {
      console.error('Error moving task:', error);
      alert('Error moving task. Please try again.');
    }
  };

return (
  <View style={styles.taskContainer}>
    <TouchableOpacity onPress={handleDescriptionPress}>
      <Text style={styles.taskText}>{newTaskName}</Text>
    </TouchableOpacity>
    <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.menuButton}>
      <Text style={styles.menuButtonText}>...</Text>
    </TouchableOpacity>

    
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(!modalVisible);
      }}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Button title="Edit Name" onPress={handleEditPress} />
          <Button title="Edit Description" onPress={() => {
            setDescriptionEditModalVisible(true);
            setModalVisible(false);
          }} />
          <Button title="Delete" onPress={handleTaskDelete} />
          <Button title="Cancel" onPress={() => setModalVisible(false)} />
        </View>
      </View>
    </Modal>

    
    <Modal
      animationType="slide"
      transparent={true}
      visible={editModalVisible}
      onRequestClose={() => {
        setEditModalVisible(!editModalVisible);
      }}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <TextInput
            style={styles.input}
            placeholder="New Task Name"
            value={newTaskName}
            onChangeText={setNewTaskName}
          />
          <Button title="Confirm" onPress={handleEditConfirm} />
          <Button title="Cancel" onPress={() => setEditModalVisible(false)} />
        </View>
      </View>
    </Modal>

   
    <Modal
      animationType="slide"
      transparent={true}
      visible={descriptionModalVisible}
      onRequestClose={() => {
        setDescriptionModalVisible(!descriptionModalVisible);
      }}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text>{task.description || "No description available."}</Text>
          <Button title="Close" onPress={() => setDescriptionModalVisible(false)} />
          <Button title="Move" onPress={handleMovePress} />
        </View>
      </View>
    </Modal>

    
    <Modal
      animationType="slide"
      transparent={true}
      visible={descriptionEditModalVisible}
      onRequestClose={() => {
        setDescriptionEditModalVisible(!descriptionEditModalVisible);
      }}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <TextInput
            style={styles.input}
            placeholder="Enter description"
            value={newDescription}
            onChangeText={setNewDescription}
          />
          <Button title="Confirm" onPress={() => {
            handleDescriptionEdit();
            setDescriptionEditModalVisible(false);
          }} />
          <Button title="Cancel" onPress={() => setDescriptionEditModalVisible(false)} />
        </View>
      </View>
    </Modal>
    
    <Modal
      animationType="slide"
      transparent={true}
      visible={moveModalVisible}
      onRequestClose={() => {
        setMoveModalVisible(!moveModalVisible);
      }}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text>Select a column to move the task to:</Text>
          <ScrollView style={{ maxHeight: 200 }}>
           
            {columns.length > 0 ? (
              columns.map((column, key) => (
                <TouchableOpacity
                  key={column.id} 
                  onPress={() => setSelectedColumnId(column.id)}>
                  <Text
                  style={{
                      backgroundColor: '#007bff', 
                      color: 'white', 
                      padding: 10, 
                      marginVertical: 5, 
                      borderRadius: 5, 
                      textAlign: 'center', 
                    }}>{column.name}</Text>
                </TouchableOpacity>
              ))
            ) : (
              <Text>No columns available</Text>
            )}
          </ScrollView>
          <Button title="Confirm" onPress={handleMoveTask} />
          <Button title="Cancel" onPress={() => setMoveModalVisible(false)} />
        </View>
      </View>
    </Modal>
    </View>
  );
};
Task.propTypes = {
  task: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
  }).isRequired,
  boardId: PropTypes.string.isRequired,
  columnId: PropTypes.string.isRequired,
};
const styles = StyleSheet.create({
  taskContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', 
    backgroundColor: '#424242', 
    marginVertical: 8,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  taskText: {
    fontSize: 16,
    flex: 1,
    color: '#FFFFFF', 
    padding: 10,
  },
  menuButton: {
    padding: 12,
    borderRadius: 5,
    backgroundColor: '#545454',
  },
  menuButtonText: {
    fontSize: 16,
    color: '#FFFFFF', 
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: '#757575', 
    borderRadius: 15,
    padding: 25,
    width: '80%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  input: {
    height: 44,
    borderColor: '#5E5E5E',
    borderWidth: 1,
    marginBottom: 20,
    width: '100%',
    textAlign: 'center',
    color: '#FFFFFF', 
    backgroundColor: '#6B6B6B',
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#5E5E5E',
    borderRadius: 8,
    color: '#FFFFFF', 
    backgroundColor: '#6B6B6B',
    paddingRight: 30,
    width: '100%',
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#5E5E5E',
    borderRadius: 8,
    color: '#FFFFFF', 
    backgroundColor: '#6B6B6B',
    paddingRight: 30, 
    width: '100%',
  },
});


export default Task;



