import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { db, handleDelete } from '../firebase/Config';
import { ref, onValue } from 'firebase/database';

const HomeScreen = () => {
  const [boards, setBoards] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const boardsRef = ref(db, 'boards');
    const unsubscribe = onValue(boardsRef, (snapshot) => {
      const fetchedBoards = [];
      snapshot.forEach((childSnapshot) => {
        const boardData = childSnapshot.val();
        fetchedBoards.push({
          id: childSnapshot.key,
          ...boardData,
        });
      });
      setBoards(fetchedBoards);
    });

    return () => unsubscribe();
  }, []);

  const navigateToBoard = (boardId, boardName) => {
    navigation.navigate('Board', { boardId, boardName });
  };

  const deleteBoard = async (boardId) => {
    try {
      if (!boardId) {
        console.error('Invalid board reference: ', boardId);
        alert('Cannot delete board due to invalid reference.');
        return;
      }
      await handleDelete(`boards/${boardId}`);
      console.log('Board deleted!');
    } catch (error) {
      console.error('Error deleting board:', error);
      alert('Error deleting board. Please try again.');
    }
  };

  const confirmDeleteBoard = (boardId, boardName) => {
    Alert.alert(
      "Supprimer le Board",
      `Êtes-vous sûr de vouloir supprimer le board "${boardName}"?`,
      [
        {
          text: "Non",
          style: "non"
        },
        { 
          text: "OK", 
          onPress: async () => {
            await deleteBoard(boardId);
            Alert.alert('Succès', 'Board supprimé avec succès.');
          }
        }
      ],
      { cancelable: true }
    );
  };

  const renderBoard = ({ item }) => (
    <TouchableOpacity
      style={styles.boardCard}
      onPress={() => navigateToBoard(item.id, item.name)}
      onLongPress={() => confirmDeleteBoard(item.id, item.name)}
    >
      <Text style={styles.boardTitle}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Boards</Text>
      <FlatList
        data={boards}
        renderItem={renderBoard}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.list}
      />
      <TouchableOpacity
        style={styles.createBoardButton}
        onPress={() => navigation.navigate('NewProject')}  
      >
        <Text style={styles.createBoardButtonText}>Create New Board</Text>
      </TouchableOpacity>
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
    marginBottom: 20,
  },
  list: {
    alignItems: 'center',
  },
  boardCard: {
    backgroundColor: '#2D2D2D',
    padding: 18,
    margin: 10,
    borderRadius: 10,
    width: 155,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#3E3E3E',
    borderWidth: 0.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 3,
  },
  boardTitle: {
    fontSize: 19,
    fontWeight: '500',
    color: '#BB86FC',
  },
  createBoardButton: {
    backgroundColor: '#BB86FC',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  createBoardButtonText: {
    color: '#121212',
    fontSize: 18,
    fontWeight: '600',
  },
});


export default HomeScreen;

