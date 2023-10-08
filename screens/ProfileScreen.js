import React, { useEffect, useState } from 'react';
import { View, Alert, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { auth } from '../firebase/Config'; 
import { useNavigation } from '@react-navigation/native';


const signOutUser = async () => {
  try {
    await auth.signOut();
    console.log('Déconnexion réussie');
    return { success: true };
  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error);
    return { success: false, error };
  }
};

const ProfileScreen = () => {
  const [userEmail, setUserEmail] = useState('');
  const { navigate } = useNavigation();

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setUserEmail(user.email);
    }
  }, []);

  const handleSignOut = async () => {
    const { success, error } = await signOutUser();
    if (success) {
      navigate('SignIn');
    } else {
      Alert.alert('Erreur', 'Une erreur s\'est produite lors de la déconnexion.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profil</Text>
      <Text style={styles.email}>Email: {userEmail}</Text>
      <Button mode="contained" onPress={handleSignOut} style={styles.button} theme={buttonTheme}>
        Se déconnecter
      </Button>
    </View>
);
};
const buttonTheme = {
  colors: {
    primary: '#BB86FC',
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
  title: {
    fontSize: 28,
    marginBottom: 25,
    fontWeight: 'bold',
    color: '#BB86FC',
    letterSpacing: 1,
  },
  email: {
    fontSize: 20,
    marginBottom: 50,
    color: '#E0E0E0',
  },
  button: {
    width: '90%',
    backgroundColor: 'rgba(187, 134, 252, 0.9)',
    borderColor: '#3E3E3E',
    borderWidth: 0.5,
    borderRadius: 5,
  },
});


export default ProfileScreen;
