import { FontAwesome } from '@expo/vector-icons';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FlatList, Image, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Header } from 'react-native-elements';
import { useAssets, Asset } from 'expo-asset';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import InspectMain from './InspectMain';
import QRScanner from './QRScanner';
import ViewMain from './ViewMain';
import Capture from './Capture';
import CompanyLogo from './CompanyLogo';
import LPMSLogo from './LPMSLogo';

// Variable for navigation and page linking
const Stack = createStackNavigator();

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#232C69',
    background: '#ffffff',
    card: '#7dbe32', // Warna hijau Tripatra
    text: 'black',
    border: '#e0e0e0',
    notification: '#ff6347',
  },
};

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
        leftComponent={<LPMSLogo />}
        centerComponent={
          <Text
            style={{
              color: '#232C69',
              fontWeight: 'bold',
              marginTop: 15,
              fontSize: 14,
              textAlign: 'center',
              maxWidth: '80%',  // Adjust this as needed
              flexShrink: 1,    // Allows the text to shrink within the space
              flexWrap: 'wrap', // Ensures text wraps to the next line
            }}
            numberOfLines={2}   // Limits to 2 lines, adjust as needed
            allowFontScaling={false}  // Disables font scaling to ensure consistency
          >
            LPMS - WAREHOUSE MANAGEMENT SYSTEM
          </Text>
        }
        rightComponent={<CompanyLogo />}
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
    <NavigationContainer theme={MyTheme}>
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
    color: '#232C69',
    fontWeight: 'bold',
    alignSelf: 'center',
    fontSize: 18,
  },
  submitButton: {
    marginTop: 50,
    marginLeft: 110,
    marginRight: 110,
    borderRadius: 10,
    padding: 20,
    backgroundColor: '#ffff',
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
    backgroundColor: '#232C69',
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
    backgroundColor: '#ffff',
  },
});