import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';


import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import NewProjectScreen from '../screens/NewProjectScreen';
import BoardScreen from '../screens/BoardScreen';
import AddColumnScreen from '../screens/AddColumnScreen';
import ColumnScreen from '../screens/ColumnScreen';
import AddTaskScreen from '../screens/AddTaskScreen';

const Tab = createBottomTabNavigator();

const HomeTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: ['Board', 'AddColumn', 'Column', 'AddTask'].includes(route.name) ? false : true,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="NewProject" component={NewProjectScreen} />
      <Tab.Screen name="Board" component={BoardScreen} />
      <Tab.Screen name="AddColumn" component={AddColumnScreen} />
      <Tab.Screen name="Column" component={ColumnScreen} />
      <Tab.Screen name="AddTask" component={AddTaskScreen} />
    </Tab.Navigator>
  );
};

export default HomeTabNavigator;
