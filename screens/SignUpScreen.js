import React, { useState } from 'react';
import { View, Alert } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { auth } from '../firebase/Config';
import { useNavigation } from '@react-navigation/native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { StyleSheet } from 'react-native';

const signUpUser = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log('Inscription réussie:', userCredential.user);
    return { success: true };
  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error);
    return { success: false, error };
  }
};

const SignUpScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { navigate } = useNavigation();

  const handleSignUp = async () => {
    const { success, error } = await signUpUser(email, password);
    if (success) {
      navigate('SignIn');
    } else {
      Alert.alert('Erreur', 'Une erreur s\'est produite lors de l\'inscription.');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
        theme={inputTheme}
      />
      <TextInput
        label="Mot de passe"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
        theme={inputTheme}
      />
      <Button mode="contained" onPress={handleSignUp} style={styles.button}>
        S'inscrire
      </Button>
      <Button mode="text" onPress={() => navigate('SignIn')} color="#BB86FC">
        Avez-vous un compte ? Se connecter
      </Button>
    </View>
);
};
const inputTheme = {
  colors: {
    primary: '#BB86FC',
    underlineColor: 'transparent',
    text: '#FFFFFF'
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#121212',
  },
  input: {
    marginBottom: 20,
    width: '90%',
    backgroundColor: '#2D2D2D',
    borderColor: '#3E3E3E', 
    borderWidth: 0.5,
    borderRadius: 5,
  },
  button: {
    marginBottom: 20,
    width: '90%',
    backgroundColor: 'rgba(187, 134, 252, 0.9)', 
    borderColor: '#3E3E3E',
    borderWidth: 0.5,
    borderRadius: 5,
  },
});


export default SignUpScreen;
