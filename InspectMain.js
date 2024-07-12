import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Header } from 'react-native-elements';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import CompanyLogo from './CompanyLogo';

// Main functionality and main page
function InspectPage({ }) {
  // Connect to PostgreSQL Database
  const [capturedImage, setCapturedImage] = useState(null);
  const navigation = useNavigation();
  const currentDate = new Date();

  // Extract date, month, and year from Date object
  const date = currentDate.getDate();
  const month = currentDate.getMonth() + 1; // January is 0, so we add 1
  const year = currentDate.getFullYear();

  // Extract hours, minutes, and seconds from Date object
  const hours = currentDate.getHours();
  const minutes = currentDate.getMinutes();
  const seconds = currentDate.getSeconds();
  const milliseconds = currentDate.getMilliseconds().toString().padStart(3, '0');

  // Format the date to your desired format
  const formattedDate = `${date}/${month}/${year} ${hours}:${minutes}:${seconds}.${milliseconds}`;

  const saveData = async() => {
    const apiUrl = 'https://tp-phr.azurewebsites.net/api/material-storage';
    const response = fetch(apiUrl, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        projectName: text,
        mrrNo: textB,
        materialId: textC,
        locationArea: textD,
        newOrExcess: textE,
        locationId: textF,
        outdoorIndoor: textG,
        createdBy: 'Marc Salvadore',
        createdOn: formattedDate,
        updatedBy: 'Marc Salvadore',
        updatedOn: formattedDate,
        status: textH,
      }),
    });
    // const re = await response.json();
    if (await response.json()) {
      console.warn("Saved Successfull")
    }
  }

  const handleDeletePicture = async () => {
    if (capturedImage) {
      try {
        const path = capturedImage.split("file:///").pop();
        await RNFetchBlob.fs.unlink(path);
        alert("File deleted");
        setCapturedImage(null);
      } catch (err) {
        alert("Failed to delete file: " + err.message);
      }
    }
  };

  // Input variable
  const [text, setProjectName] = useState('')
  const [textB, setMRR] = useState('')
  const [textC, setMaterialId] = useState('')
  const [textD, setLocationArea] = useState('')
  const [textE, setNew] = useState('')
  const [textF, setLocationId] = useState('')
  const [textG, setInOut] = useState('')
  const [textH, setStatus] = useState('')
  const [images, setImage] = useState('')
  const [imageItem, setImageItem] = useState('')

  // For deleting input inside the TextInput
  const handleClearText = (setter) => {
    setter('');
  };

  // Handle QRScanner navigation and data retrieval from QRScanner page
  const dataQRMMR = () => {
    navigation.navigate('QRScanner', {
      onScan: (data) => {
        setMRR(data)
      }
    });
  };

  // Handle QRScanner navigation and data retrieval from QRScanner page
  const dataQRMaterialID = () => {
    navigation.navigate('QRScanner', {
      onScan: (data) => {
        setMaterialId(data)
      }
    });
  };

  // Capture image
  const imageCapture = () => {
    navigation.navigate('Capture', {
      onCapture: (data) => {
        setCapturedImage(data);
        setImage(data); // Setting the URI of the captured image
      }
    });
  };

  // Capture image
  const imageItemCapture = () => {
    navigation.navigate('Capture', {
      onCapture: (data) => {
        setCapturedImage(data);
        setImageItem(data); // Setting the URI of the captured image
      }
    });
  };

  const handleSubmit = () => {
    // Your submission logic here
    saveData();

    // Clear all box
    handleClearText(setProjectName);
    handleClearText(setMRR);
    handleClearText(setMaterialId);
    handleClearText(setLocationArea);
    handleClearText(setNew);
    handleClearText(setLocationId);
    handleClearText(setInOut);
    handleClearText(setStatus);
    // Delete the captured image after submission
    // handleDeletePicture();
  };

  return (
    <SafeAreaProvider>
      <Header
        leftComponent={<CompanyLogo />}
        centerComponent={{ text: 'Tripatra Engineering', style: { color: '#fff', fontWeight: 'bold', marginTop: 10, fontSize: 16 } }}
        containerStyle={styles.header}
      />
      <ScrollView>
        <View style={styles.container}>
          <Text style={styles.titleText}>Project Name:</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              onChangeText={setProjectName}
              value={text}
              placeholder="Input Your Text Here"
            />
            {text.length > 0 && (
              <TouchableOpacity style={styles.clearButton} onPress={() => handleClearText(setProjectName)}>
                <FontAwesome name="close" size={24} color="red" />
              </TouchableOpacity>
            )}
          </View>
          <Text style={styles.titleText}>MRR Number :</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              onChangeText={setMRR}
              value={textB}
              placeholder="Scan the barcode"
              editable={false}
            />
            <TouchableOpacity
              style={styles.scanButton}
              onPress={dataQRMMR}
            >
              <FontAwesome name="qrcode" size={34} color="black" />
            </TouchableOpacity>
            {textB.length > 0 && (
              <TouchableOpacity style={styles.clearButton} onPress={() => handleClearText(setMRR)}>
                <FontAwesome name="close" size={24} color="red" />
              </TouchableOpacity>
            )}
          </View>
          <Text style={styles.titleText}>Material ID :</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              onChangeText={setMaterialId}
              value={textC}
              placeholder="Scan the barcode"
              editable={false}
            />
            <TouchableOpacity
              style={styles.scanButton}
              onPress={dataQRMaterialID}
            >
              <FontAwesome name="qrcode" size={34} color="black" />
            </TouchableOpacity>
            {textC.length > 0 && (
              <TouchableOpacity style={styles.clearButton} onPress={() => handleClearText(setMaterialId)}>
                <FontAwesome name="close" size={24} color="red" />
              </TouchableOpacity>
            )}
          </View>
          <Text style={styles.titleText}>Location Area :</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              onChangeText={setLocationArea}
              value={textD}
              placeholder="Input Your Text Here"
            />
            {textD.length > 0 && (
              <TouchableOpacity style={styles.clearButton} onPress={() => handleClearText(setLocationArea)}>
                <FontAwesome name="close" size={24} color="red" />
              </TouchableOpacity>
            )}
          </View>
          <Text style={styles.titleText}>New or Excess :</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              onChangeText={setNew}
              value={textE}
              placeholder="Choose Your Input"
            />
            {textE.length > 0 && (
              <TouchableOpacity style={styles.clearButton} onPress={() => handleClearText(setNew)}>
                <FontAwesome name="close" size={24} color="red" />
              </TouchableOpacity>
            )}
          </View>
          <Text style={styles.titleText}>Location ID :</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              onChangeText={setLocationId}
              value={textF}
              placeholder="Input Your Text Here"
            />
            {textF.length > 0 && (
              <TouchableOpacity style={styles.clearButton} onPress={() => handleClearText(setLocationId)}>
                <FontAwesome name="close" size={24} color="red" />
              </TouchableOpacity>
            )}
          </View>
          <Text style={styles.titleText}>Outdoor-Indoor :</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              onChangeText={setInOut}
              value={textG}
              placeholder="Choose Your Input"
            />
            {textG.length > 0 && (
              <TouchableOpacity style={styles.clearButton} onPress={() => handleClearText(setInOut)}>
                <FontAwesome name="close" size={24} color="red" />
              </TouchableOpacity>
            )}
          </View>
          <Text style={styles.titleText}>Status :</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              onChangeText={setStatus}
              value={textH}
              placeholder="Input Your Text Here"
            />
            {textH.length > 0 && (
              <TouchableOpacity style={styles.clearButton} onPress={() => handleClearText(setStatus)}>
                <FontAwesome name="close" size={24} color="red" />
              </TouchableOpacity>
            )}
          </View>
          <Text style={styles.titleText}>Attachment Photo Document :</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              onChangeText={setImage}
              value={images}
              placeholder="Your Photo Here"
              editable={false}
            />
            <TouchableOpacity
              style={styles.scanButton}
              onPress={imageCapture}
            >
              <FontAwesome name="camera" size={30} color="black" />
            </TouchableOpacity>
            {images.length > 0 && (
              <TouchableOpacity style={styles.clearButton} onPress={() => handleClearText(setImage)}>
                <FontAwesome name="close" size={24} color="red" />
              </TouchableOpacity>
            )}
          </View>
          <Text style={styles.titleText}>Attachment Item :</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              onChangeText={setImageItem}
              value={imageItem}
              placeholder="Your Photo Here"
              editable={false}
            />
            <TouchableOpacity
              style={styles.scanButton}
              onPress={imageItemCapture}
            >
              <FontAwesome name="camera" size={30} color="black" />
            </TouchableOpacity>
            {imageItem.length > 0 && (
              <TouchableOpacity style={styles.clearButton} onPress={() => handleClearText(setImageItem)}>
                <FontAwesome name="close" size={24} color="red" />
              </TouchableOpacity>
            )}
          </View>
          <Pressable style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitText}>Submit</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaProvider>
  );
}

export default InspectPage;

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
    fontWeight: 'bold',
    color: 'blue',
    overflow: 'visible',
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
    overflow: 'visible',
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