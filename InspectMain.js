import { FontAwesome } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Header } from 'react-native-elements';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import CompanyLogo from './CompanyLogo';
import LPMSLogo from './LPMSLogo';

// Main functionality and main page
function InspectPage({ }) {
  // Connect to PostgreSQL Database
  const [capturedImage, setCapturedImage] = useState(null);
  const [response, setResponse] = useState([]);
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

  const saveData = async () => {
    const payload = {
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
    };
  
    console.log('Payload:', payload);
    
    const response = fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if ((await response).json()) {
      console.warn("Saved Succesfull'")
    }
    // try {
  
    //   // // Await the text() method to get the raw response text
    //   // const responseText = await response.text();
    //   // console.log('Raw response:', responseText);
  
    //   // if (!response.ok) {
    //   //   const errorMessage = `Network response was not ok: ${response.status} ${response.statusText}`;
    //   //   console.error(errorMessage);
    //   //   alert(`Error: ${errorMessage}. Details: ${responseText}`);
    //   //   return;
    //   // }
  
    //   // // Parse the responseText as JSON
    //   // const data = JSON.parse(responseText);
    //   if (await response.json()) {
    //     console.warn("Saved Successfully", data);
    //   }
    // } catch (error) {
    //   console.error('Fetch error:', error);
    //   alert('An error occurred: ' + error.message);
    // }
  };

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

  // Replace 'localhost' with your machine's IP address
  const API_URL = 'https://tp-phr.azurewebsites.net/api/material-storage';

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
    // console.log('Result:', response);
    // console.log(`Finding item with id ${proID}:`, item);
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

  // Capture image
  const photo3Capture = () => {
    navigation.navigate('Capture', {
      onCapture: (data) => {
        setCapturedImage(data);
        setPhoto3(data); // Setting the URI of the captured image
      }
    });
  };

  // Capture image
  const photo4Capture = () => {
    navigation.navigate('Capture', {
      onCapture: (data) => {
        setCapturedImage(data);
        setPhoto4(data); // Setting the URI of the captured image
      }
    });
  };

  const handleSubmit = () => {
    // Your submission logic here
    saveData();

    // Clear all box
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
                <Picker.Item label="Scroll Your Input" value="" enabled={false} />
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
            {/* <TextInput
              style={styles.input}
              onChangeText={setInOut}
              value={textG}
              placeholder="Input Your Text Here"
            /> */}
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={textG}
                onValueChange={(itemValue, itemIndex) =>
                  setInOut(itemValue)
                }
                style={styles.picker}
              >
                <Picker.Item label="Scroll Your Input" value="" enabled={false} />
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
              onPress={imageCapture}
            >
              <FontAwesome name="camera" size={30} color="white" />
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
              placeholder="Your Picture Link"
              editable={false}
            />
            <TouchableOpacity
              style={styles.scanButton}
              onPress={imageItemCapture}
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
              onPress={photo3Capture}
            >
              <FontAwesome name="camera" size={30} color="white" />
            </TouchableOpacity>
            {imageItem.length > 0 && (
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
              onPress={photo4Capture}
            >
              <FontAwesome name="camera" size={30} color="white" />
            </TouchableOpacity>
            {imageItem.length > 0 && (
              <TouchableOpacity style={styles.clearButton} onPress={() => handleClearText(setPhoto4)}>
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
    paddingLeft: 10,
    marginRight: 50,
    justifyContent: 'center',
    color: 'blue'
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