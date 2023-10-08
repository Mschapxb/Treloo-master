import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { db } from '../firebase/Config';
import { ref, push, set } from 'firebase/database';

const AddColumnScreen = () => {
  const [columnName, setColumnName] = useState('');
  const { boardId } = useRoute().params;
  const navigation = useNavigation();

  const handleAddColumn = () => {
    if(columnName.trim() === '') {
      Alert.alert('Error', 'Column name cannot be empty!');
      return;
    }
    const newColumnRef = push(ref(db, `boards/${boardId}/columns`));
    set(newColumnRef, { name: columnName }).then(() => {
      console.log("Column Name:", columnName);
      navigation.goBack();
    });
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Column Name"
        placeholderTextColor="#888"
        value={columnName}
        onChangeText={setColumnName}
      />
      <Button title="Add Column" onPress={handleAddColumn} color="#FF4500" />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#181818',
  },
  input: {
    height: 48,
    borderColor: '#3E3E3E',
    borderWidth: 1,
    marginBottom: 24,
    paddingLeft: 12,
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


export default AddColumnScreen;
