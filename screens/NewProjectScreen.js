import React, { useState } from 'react';
import { View, Alert, TextInput, Button, StyleSheet } from 'react-native';
import { db } from '../firebase/Config';
import { ref, push, set } from 'firebase/database';
import { useNavigation } from '@react-navigation/native';

const NewProjectScreen = () => {
  const [projectName, setProjectName] = useState('');
  const { navigate } = useNavigation();

  const handleCreateProject = async () => {
    try {
      const newProjectRef = push(ref(db, 'boards'));
      await set(newProjectRef, { name: projectName });
      console.log("Project Name:", projectName); 
      Alert.alert("Succès", "Projet créé avec succès.");
      navigate('Home');
    } catch (error) {
      console.error("Erreur lors de la création du projet:", error);
      Alert.alert("Erreur", "Une erreur s'est produite lors de la création du projet.");
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Project Name"
        placeholderTextColor="#B0B0B0"
        value={projectName}
        onChangeText={setProjectName}
      />
      <View style={styles.buttonContainer}>
        <Button title="Create Project" onPress={handleCreateProject} color="#BB86FC" />
      </View>
    </View>
);
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#121212',
  },
  input: {
    height: 50,
    borderColor: '#3E3E3E',
    borderWidth: 0.5,
    marginBottom: 25,
    paddingLeft: 12,
    borderRadius: 5,
    fontSize: 18,
    color: '#E0E0E0',
    backgroundColor: 'rgba(45, 45, 45, 0.9)',
  },
  buttonContainer: {
    width: '100%',
    borderRadius: 5,
    overflow: 'hidden',
  },
});


export default NewProjectScreen;
