import { FontAwesome } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Header } from 'react-native-elements';
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import CompanyLogo from './CompanyLogo';
import LPMSLogo from './LPMSLogo';

// Main functionality and main page
function InspectPage({ }) {
  // Connect to PostgreSQL Database
  const [capturedImage, setCapturedImage] = useState(null);
  const [response, setResponse] = useState([]);
  const navigation = useNavigation();

  const formatDateForDatabase = (date) => {
    const pad = (number) => (number < 10 ? `0${number}` : number);
  
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1); // Months are zero-based
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());
    const milliseconds = date.getMilliseconds().toString().padStart(3, '0');
  
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;
  };
  
  const formattedDate = formatDateForDatabase(new Date());

  // Replace 'localhost' with your machine's IP address
  // const API_URL = 'http://10.97.109.199:3000/api/material-storage';
  // const API_URL_UPLOAD = 'http://10.97.109.199:3000/api/upload';

  // For Remote Server on Azure
  const API_URL = 'https://tp-phr.azurewebsites.net/api/material-storage';
  const API_URL_UPLOAD = 'https://tp-phr.azurewebsites.net/api/upload';

  const saveData = async () => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          materialId: textC,
          projectName: text,
          mrrNo: textB,
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
  
      if (!response.ok) {
        const message = `An error has occurred: ${response.status}`;
        throw new Error(message);
      }
    
      // Read and parse the response body only once
      const rawResponse = await response.text();
      console.log('Raw response text:', rawResponse);
    
      const data = JSON.parse(rawResponse);
      console.warn('Saved Successfully:', data);
    
      return data;
    } catch (error) {
      console.error('Error during fetch:', error);
    }
  };

  // Use fetch with apiUrl
  useEffect(() => {
    fetch(API_URL)
        .then(res => {
            if (!res.ok) {
                throw new Error('Network response was not ok ' + res.statusText);
            }
            return res.json();
        })
        .then(
            (result) => {
                // For debugging
                // console.log('Fetched data:', result);
                setResponse(result);
            },
            (error) => {
                setError(error.message);
            }
        )
        .catch((error) => {
            setError(error.message);
        });
  }, [API_URL]);

  const getColumnDataById = (proID, column) => {
    let item = null;
    for (let i = 0; i < response.length; i++) {
        if (response[i].material_id === proID) {
            item = response[i];
            break;
        }
    }
    return item ? item[column] : '';
  };

  // Input variable
  const [textC, setMaterialId] = useState('1042.0160')
  const text = getColumnDataById(textC, 'project_name')
  const textB = getColumnDataById(textC, 'mrr_no')
  const [textD, setLocationArea] = useState('Bintaro')
  const [textE, setNew] = useState('New')
  const [textF, setLocationId] = useState('Indy Bintaro')
  const [textG, setInOut] = useState('Indoor')
  const [textH, setStatus] = useState('Available')
  const [images, setImage] = useState('')
  const [imageItem, setImageItem] = useState('')
  const [photo3, setPhoto3] = useState('')
  const [photo4, setPhoto4] = useState('')

  const handleImageCapture = (setImage) => {
    navigation.navigate('Capture', {
      onCapture: (data) => {
        setImage(data);
        // uploadImage(data, setImage);
      }
    });
  };

  const uploadImage = async (uri, materialStorageId) => {
    try {
      let formData = new FormData();
      formData.append('file', {
        uri,
        type: 'image/png'
      });
      formData.append('material_storage_id', materialStorageId);
      formData.append('originalname', "photo.png");
  
      const response = await fetch(API_URL_UPLOAD, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
          // Add any necessary headers like authorization token if required
        },
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        const message = `An error has occurred: ${response.status}, ${errorText}`;
        throw new Error(message);
      }
  
      const data = await response.json();
      console.log('Upload successful:', data);
      return data.attachment_url; // Return the URL of the uploaded image
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  // For deleting input inside the TextInput
  const handleClearText = (setter) => {
    setter('');
  };

  // Handle QRScanner navigation and data retrieval from QRScanner page
  const dataQRMaterialID = () => {
    navigation.navigate('QRScanner', {
      onScan: (data) => {
        setMaterialId(data)
      }
    });
  };

  // // Capture image
  // const imageCapture = () => {
  //   navigation.navigate('Capture', {
  //     onCapture: (data) => {
  //       setCapturedImage(data);
  //       setImage(data); // Setting the URI of the captured image
  //     }
  //   });
  // };

  // // Capture image
  // const imageItemCapture = () => {
  //   navigation.navigate('Capture', {
  //     onCapture: (data) => {
  //       setCapturedImage(data);
  //       setImageItem(data); // Setting the URI of the captured image
  //     }
  //   });
  // };

  // // Capture image
  // const photo3Capture = () => {
  //   navigation.navigate('Capture', {
  //     onCapture: (data) => {
  //       setCapturedImage(data);
  //       setPhoto3(data); // Setting the URI of the captured image
  //     }
  //   });
  // };

  // // Capture image
  // const photo4Capture = () => {
  //   navigation.navigate('Capture', {
  //     onCapture: (data) => {
  //       setCapturedImage(data);
  //       setPhoto4(data); // Setting the URI of the captured image
  //     }
  //   });
  // };

  const handleSubmit = async () => {
    try {
      // Save the data first
      const savedData = await saveData();
      const materialStorageId = savedData.id;
      console.log('Material ID in Database : ', materialStorageId)

      
      if (savedData) {
        // Update the database with the image URL
        // Upload the image with the material_storage_id
        const imageUrl = await uploadImage(images, materialStorageId);
        if (!imageUrl) {
          throw error
        }
        console.log('Image uploaded successfully:', imageUrl);
        
        // Clear all input boxes
        handleClearText(setMaterialId);
        handleClearText(setLocationArea);
        handleClearText(setNew);
        handleClearText(setLocationId);
        handleClearText(setInOut);
        handleClearText(setStatus);
        handleClearText(setImage);
        // handleClearText(setImageItem);
        // handleClearText(setPhoto3);
        // handleClearText(setPhoto4);
      } else {
        throw new Error('Failed to retrieve saved data ID.');
      }
    } catch (error) {
      console.error('Error during submission:', error);
    }
  };  

  return (
    <SafeAreaProvider>
      <Header
        leftComponent={<LPMSLogo />}
        centerComponent={
          <Text
            style={{
              color: '#232C69',
              fontWeight: 'bold',
              marginTop: 10,
              fontSize: 16,
              textAlign: 'center',
              maxWidth: '80%',  // Adjust this as needed
              flexShrink: 1,    // Allows the text to shrink within the space
              flexWrap: 'wrap', // Ensures text wraps to the next line
            }}
            numberOfLines={2}   // Limits to 2 lines, adjust as needed
            allowFontScaling={false}  // Disables font scaling to ensure consistency
          >
            LPMS Warehouse Management System
          </Text>
        }
        rightComponent={<CompanyLogo />}
        containerStyle={styles.header}
      />
      <ScrollView>
        <View style={styles.container}>
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
              <FontAwesome name="qrcode" size={34} color="white" />
            </TouchableOpacity>
            {textC.length > 0 && (
              <TouchableOpacity style={styles.clearButton} onPress={() => handleClearText(setMaterialId)}>
                <FontAwesome name="close" size={24} color="red" />
              </TouchableOpacity>
            )}
          </View>
          <Text style={styles.titleText}>MRR Number :</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              onChangeText={setMaterialId}
              value={textB}
              placeholder="Scan Material ID"
              editable={false}
            />
          </View>
          <Text style={styles.titleText}>Project Name:</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              onChangeText={setMaterialId}
              value={text}
              editable={false}
              placeholder="Scan Material ID"
            />
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
            {/* <TextInput
              style={styles.input}
              onChangeText={setNew}
              value={textE}
              placeholder="Input Your Text Here"
            /> */}
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={textE}
                onValueChange={(itemValue, itemIndex) =>
                  setNew(itemValue)
                }
                style={styles.picker}
              >
                <Picker.Item label="Choose Your Input" value="" enabled={false} />
                <Picker.Item label="New" value="New" />
                <Picker.Item label="Excess" value="Excess" />
              </Picker>
            </View> 
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
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={textG}
                onValueChange={(itemValue, itemIndex) =>
                  setInOut(itemValue)
                }
                style={styles.picker}
              >
                <Picker.Item label="Choose Your Input" value="" enabled={false} />
                <Picker.Item label="Outdoor" value="Outdoor" />
                <Picker.Item label="Indoor" value="Indoor" />
              </Picker>
            </View>           
            {textG.length > 0 && (
              <TouchableOpacity style={styles.clearButton} onPress={() => handleClearText(setInOut)}>
                <FontAwesome name="close" size={24} color="red" />
              </TouchableOpacity>
            )}
          </View>
          <Text style={styles.titleText}>Remarks :</Text>
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
              placeholder="Your Picture Link"
              editable={false}
            />
            <TouchableOpacity
              style={styles.scanButton}
              onPress={() => handleImageCapture(setImage)}
            >
              <FontAwesome name="camera" size={30} color="white" />
            </TouchableOpacity>
            {images.length > 0 && (
              <TouchableOpacity style={styles.clearButton} onPress={() => handleClearText(setImage)}>
                <FontAwesome name="close" size={24} color="red" />
              </TouchableOpacity>
            )}
          </View>
          {/* <Text style={styles.titleText}>Attachment Item :</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              onChangeText={setImageItem}
              value={imageItem}
              placeholder="Your Picture Link"
              editable={false}
            />
            <TouchableOpacity
              style={styles.scanButton}
              onPress={ () => handleImageCapture(setImageItem)}
            >
              <FontAwesome name="camera" size={30} color="white" />
            </TouchableOpacity>
            {imageItem.length > 0 && (
              <TouchableOpacity style={styles.clearButton} onPress={() => handleClearText(setImageItem)}>
                <FontAwesome name="close" size={24} color="red" />
              </TouchableOpacity>
            )}
          </View>
          <Text style={styles.titleText}>Attachment Item 2 :</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              onChangeText={setPhoto3}
              value={photo3}
              placeholder="Your Picture Link"
              editable={false}
            />
            <TouchableOpacity
              style={styles.scanButton}
              onPress={() => handleImageCapture(setPhoto3)}
            >
              <FontAwesome name="camera" size={30} color="white" />
            </TouchableOpacity>
            {photo3.length > 0 && (
              <TouchableOpacity style={styles.clearButton} onPress={() => handleClearText(setPhoto3)}>
                <FontAwesome name="close" size={24} color="red" />
              </TouchableOpacity>
            )}
          </View>
          <Text style={styles.titleText}>Attachment Item 3 :</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              onChangeText={setPhoto4}
              value={photo4}
              placeholder="Your Picture Link"
              editable={false}
            />
            <TouchableOpacity
              style={styles.scanButton}
              onPress={() => handleImageCapture(setPhoto4)}
            >
              <FontAwesome name="camera" size={30} color="white" />
            </TouchableOpacity>
            {photo4.length > 0 && (
              <TouchableOpacity style={styles.clearButton} onPress={() => handleClearText(setPhoto4)}>
                <FontAwesome name="close" size={24} color="red" />
              </TouchableOpacity>
            )}
          </View> */}
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
    color: '#232c69',
    fontWeight: 'bold',
    alignSelf: 'center',
    fontSize: 18,
  },
  submitButton: {
    marginTop: 40,
    marginLeft: 110,
    marginRight: 110,
    marginBottom: 50,
    borderRadius: 10,
    padding: 20,
    backgroundColor: 'white',
  },
  titleText: {
    fontSize: 16,
    fontWeight: 'bold',
    margin: 20,
    color: 'white'
  },
  pickerWrapper: {
    height: 50,
    borderWidth: 3,
    borderColor: 'black',
    backgroundColor: 'white',
    borderRadius: 5,
    paddingLeft: 0,
    marginRight: 50,
    justifyContent: 'center',
    color: 'blue',
    fontWeight: 'bold',
  },
  picker: {
    width: '100%',
    color: 'blue',
    fontWeight: 'bold',
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
    backgroundColor: '#232C69', // Added for visibility
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