import { FontAwesome } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FlatList, Image, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Header } from 'react-native-elements';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import InspectMain from './InspectMain';
import QRScanner from './QRScanner';
import ViewMain from './ViewMain';
import Capture from './Capture';

const CompanyLogo = () => (
  <Image
    source={require('./assets/tripatra-logo.jpeg')}
    style={{ width: 60, height: 50 }}
  />
);

// Variable for navigation and page linking
const Stack = createStackNavigator();

// Main functionality and main page
function HomeScreen({ navigation }) {
  const handleView = () => {
    navigation.navigate('View');
  }

  const handleInspect = () => {
    navigation.navigate('Inspect');
  }

  return (
    <SafeAreaProvider>
      <Header
        leftComponent={<CompanyLogo />}
        centerComponent={{ text: 'Tripatra Engineering', style: { color: '#fff', fontWeight: 'bold', marginTop: 10, fontSize: 16 } }}
        containerStyle={styles.header}
      />
      <View style={styles.container}>
        <Pressable style={styles.submitButton} onPress={handleView}>
          <Text style={styles.submitText}>View</Text>
        </Pressable>
        <Pressable style={styles.submitButton} onPress={handleInspect}>
          <Text style={styles.submitText}>Inspect</Text>
        </Pressable>
      </View>
    </SafeAreaProvider>
  );
}

// For navigating throughout the app
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Home"
        screenOptions={{
          headerTitleAlign: 'center',
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Inspect" component={InspectMain} />
        <Stack.Screen name="View" component={ViewMain} />
        <Stack.Screen name="QRScanner" component={QRScanner} />
        <Stack.Screen name="Capture" component={Capture} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  submitText: {
    color: 'white',
    fontWeight: 'bold',
    alignSelf: 'center',
    fontSize: 18,
  },
  submitButton: {
    marginTop: 30,
    marginLeft: 110,
    marginRight: 110,
    borderRadius: 10,
    padding: 20,
    backgroundColor: '#232C69',
  },
  titleText: {
    fontSize: 16,
    fontWeight: 'bold',
    margin: 12,
  },
  input: {
    height: 50,
    borderWidth: 3,
    borderBlockColor: '#232C69',
    backgroundColor: 'white',
    borderRadius: 5,
    paddingLeft: 10,
    marginRight: 50,
  },
  scanButton: {
    position: 'absolute',
    right: 0,
    top: 5,
    backgroundColor: '#F0F0F0', // Added for visibility
    padding: 5,
    borderRadius: 15,
    marginRight: 0,
  },
  clearButton: {
    position: 'absolute',
    right: 0,
    top: 8,
    backgroundColor: 'white', // Added for visibility
    padding: 5,
    borderRadius: 15,
    marginRight: 60,
  },
  inputContainer: {
    position: 'relative',
    width: '90%',
    paddingLeft: 12,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#F0F0F0',
  },
  camera: {
    flex: 1,
    margin: 32,
    marginTop: 20,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 20,
    marginRight: 20,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    backgroundColor: 'black',
  },
  header: {
    backgroundColor: '#232C69',
  },
});