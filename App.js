import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import SignInScreen from './screens/SignInScreen';
import SignUpScreen from './screens/SignUpScreen';
import HomeScreen from './screens/HomeScreen';
import ProfileScreen from './screens/ProfileScreen';
import NewProjectScreen from './screens/NewProjectScreen';
import BoardScreen from './screens/BoardScreen';
import AddColumnScreen from './screens/AddColumnScreen';
import ColumnScreen from './screens/ColumnScreen';
import AddTaskScreen from './screens/AddTaskScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const HomeTabNavigator = () => (
  <Tab.Navigator>
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);

const MainStackNavigator = () => (
  <Stack.Navigator 
    initialRouteName="SignIn" 
    screenOptions={{ headerShown: false }} 
  >
    <Stack.Screen name="SignIn" component={SignInScreen} />
    <Stack.Screen name="SignUp" component={SignUpScreen} />
    <Stack.Screen name="Home" component={HomeTabNavigator} />
    <Stack.Screen name="NewProject" component={NewProjectScreen} options={{ headerShown: true }} />
    <Stack.Screen name="Board" component={BoardScreen} options={{ headerShown: true }} />
    <Stack.Screen name="AddColumn" component={AddColumnScreen} />
    <Stack.Screen name="Column" component={ColumnScreen} />
    <Stack.Screen name="AddTask" component={AddTaskScreen} />
  </Stack.Navigator>
);

const App = () => (
  <NavigationContainer>
    <MainStackNavigator />
  </NavigationContainer>
);

export default App;
