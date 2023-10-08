import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const BoardBanner = ({ board, navigateToBoard }) => {
  const handleNavigation = () => {
    if (navigateToBoard && typeof navigateToBoard === 'function' && board) {
      navigateToBoard(board.id, board.name);
    }
  };

  return (
    <TouchableOpacity onPress={handleNavigation}>
      <View style={styles.banner}>
        <Text style={styles.text}>{board?.name}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  banner: {
    backgroundColor: '#424242',  
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
  text: {
    color: '#E0E0E0',   
    fontSize: 16,
  },
});

export default BoardBanner;
