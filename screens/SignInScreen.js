import React, { useState } from 'react';
import { View, Alert } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { auth } from '../firebase/Config';
import { useNavigation } from '@react-navigation/native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { StyleSheet } from 'react-native';


const signInUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log('Connexion réussie:', userCredential.user);
    return { success: true };
  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    return { success: false, error };
  }
};

const SignInScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { navigate } = useNavigation();

  const handleSignIn = async () => {
    const { success, error } = await signInUser(email, password);
    if (success) {
      navigate('Home');
    } else {
      Alert.alert('Erreur', 'Une erreur s\'est produite lors de la connexion.');
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
      <Button mode="contained" onPress={handleSignIn} style={styles.button}>
        Se connecter
      </Button>
      <Button mode="text" onPress={() => navigate('SignUp')} color="#BB86FC">
        Pas de compte ? S'inscrire
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


export default SignInScreen;
