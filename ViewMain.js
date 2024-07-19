import { FontAwesome } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Header } from 'react-native-elements';
import { SafeAreaProvider } from "react-native-safe-area-context";
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import CompanyLogo from './CompanyLogo';
import LPMSLogo from './LPMSLogo';

function ViewPage({ }) {
    const navigation = useNavigation();
    const route = useRoute();
    const [projectId, setProjectId] = useState(111)
    const [response, setResponse] = useState([]);
    const [responseAttachment, setResponseAttachment] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [imageUri, setImageUri] = useState('');

    // Handle QRScanner navigation and data retrieval from QRScanner page
    const dataProjectId = () => {
        navigation.navigate('QRScanner', {
        onScan: (data) => {
            setProjectId(Number(data))
        }
        });
    }; 

    // Replace 'localhost' with your machine's IP address
    const API_URL = 'https://tp-phr.azurewebsites.net/api/material-storage';
    const API_URL_ATTACHMENT = 'https://tp-phr.azurewebsites.net/api/material-attachment';

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
            if (response[i].id === proID) {
                item = response[i];
                break;
            }
        }
        // console.log('Result:', response);
        // console.log(`Finding item with id ${proID}:`, item);
        return item ? item[column] : '......';
    };
    
    const projectName = getColumnDataById(projectId, 'project_name');
    const mrrNo = getColumnDataById(projectId, 'mrr_no');
    const materialId = getColumnDataById(projectId, 'material_id');
    const locationArea = getColumnDataById(projectId, 'location_area');
    const newOrExcess = getColumnDataById(projectId, 'new_or_excess');
    const locationId = getColumnDataById(projectId, 'location_id');
    const outdoorIndoor = getColumnDataById(projectId, 'outdoor_indoor');
    const createdBy = getColumnDataById(projectId, 'created_by');
    const createdOn = getColumnDataById(projectId, 'created_on');
    const updatedBy = getColumnDataById(projectId, 'updated_by');
    const updatedOn = getColumnDataById(projectId, 'updated_on');
    const status = getColumnDataById(projectId, 'status');

     // Use fetch with apiUrl
     useEffect(() => {
        fetch(API_URL_ATTACHMENT)
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
                    setResponseAttachment(result);
                },
                (error) => {
                    setError(error.message);
                }
            )
            .catch((error) => {
                setError(error.message);
            });
    }, [API_URL_ATTACHMENT]);

    const getPhotoByMaterialId = (materialId, column) => {
        let item = null;
        for (let i = 0; i < responseAttachment.length; i++) {
            if (responseAttachment[i].material_storage_id === materialId) {
                item = responseAttachment[i];
                break;
            }
        }
        // console.log('Result:', response);
        // console.log(`Finding item with id ${proID}:`, item);
        return item ? item[column] : 'No Image Found'
    };

    const blob_url = getPhotoByMaterialId(projectId, 'attachment_url');

    const fetchImageAsBase64 = async (url) => {
        try {
            console.log(`Fetching image from URL: ${url}`);
            const fileUri = FileSystem.documentDirectory + 'temp_image.png';
        
            // Retry logic in case of temporary issues
            let attempts = 0;
            let maxAttempts = 3;
            let downloadedFile;
    
            while (attempts < maxAttempts) {
                downloadedFile = await FileSystem.downloadAsync(url, fileUri);
                console.log('Downloaded file status:', downloadedFile);

                if (downloadedFile.status === 200) {
                    break;
                }

                attempts += 1;
                console.log(`Attempt ${attempts} failed. Retrying...`);
            }

            if (downloadedFile.status !== 200) {
                throw new Error(`Image fetch failed with status: ${downloadedFile.status}`);
            }

            const base64 = await FileSystem.readAsStringAsync(downloadedFile.uri, {
                encoding: FileSystem.EncodingType.Base64,
            });
            const imageUri = `data:image/png;base64,${base64}`;
            setImageUri(imageUri);
            setLoading(false);

        } catch (error) {
          console.error('Error fetching image:', error);
          setError(error.message);
          setLoading(false);
        }
    };

    useEffect(() => {
        const url = getPhotoByMaterialId(projectId, 'attachment_url');
        if (url && url !== 'No Image Found') {
            setLoading(true);
            fetchImageAsBase64(url);
        }
    }, [projectId, responseAttachment]);

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
                    <Text style={styles.titleText}>Scan Project Barcode</Text>
                    <TouchableOpacity
                        style={styles.scanButton}
                        onPress={dataProjectId}
                    >
                        <FontAwesome name="qrcode" size={150} color="white" />
                    </TouchableOpacity>
                    <Text style={styles.titleText}>Project Name :</Text>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            onChangeText={setProjectId}
                            value={projectName}
                            editable={false}
                        />
                    </View>
                    <Text style={styles.titleText}>MRR Number :</Text>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            onChangeText={setProjectId}
                            value={mrrNo}
                            editable={false}
                        />
                    </View>
                    <Text style={styles.titleText}>Material Id :</Text>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            onChangeText={setProjectId}
                            value={materialId}
                            editable={false}
                        />
                    </View>
                    <Text style={styles.titleText}>Location Area :</Text>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            onChangeText={setProjectId}
                            value={locationArea}
                            editable={false}
                        />
                    </View>
                    <Text style={styles.titleText}>New or Excess :</Text>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            onChangeText={setProjectId}
                            value={newOrExcess}
                            
                            editable={false}
                        />
                    </View>
                    <Text style={styles.titleText}>Location Id :</Text>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            onChangeText={setProjectId}
                            value={locationId}                            
                            editable={false}
                        />
                    </View>
                    <Text style={styles.titleText}>Outdoor or Indoor:</Text>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            onChangeText={setProjectId}
                            value={outdoorIndoor}                           
                            editable={false}
                        />
                    </View>
                    <Text style={styles.titleText}>Created By :</Text>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            onChangeText={setProjectId}
                            value={createdBy}                           
                            editable={false}
                        />
                    </View>
                    <Text style={styles.titleText}>Created On :</Text>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            onChangeText={setProjectId}
                            value={createdOn}                            
                            editable={false}
                        />
                    </View>
                    <Text style={styles.titleText}>Updated By :</Text>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            onChangeText={setProjectId}
                            value={updatedBy}                            
                            editable={false}
                        />
                    </View>
                    <Text style={styles.titleText}>Updated On :</Text>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            onChangeText={setProjectId}
                            value={updatedOn}                         
                            editable={false}
                        />
                    </View>
                    <Text style={styles.titleText}>Status :</Text>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.inputStatus}
                            onChangeText={setProjectId}
                            value={status}                          
                            editable={false}
                        />
                    </View>
                    <Text style={styles.titleText}>Preview :</Text>
                    {error && <Text style={styles.errorText}>{error}</Text>}
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.inputStatus}
                            onChangeText={setProjectId}
                            value={blob_url || ''}                          
                            editable={false}
                        />
                        {imageUri ? (
                            <Image source={{ uri: imageUri }} style={styles.image} />
                        ) : (
                            <View style={styles.placeholder}>
                                <Text>Image not Available</Text>
                            </View>
                        )}
                    </View>
                    {/* <Text style={styles.titleText}>Photo 2 :</Text>
                    <View style={styles.inputContainer}>
                    </View>
                    <Text style={styles.titleText}>Photo 3 :</Text>
                    <View style={styles.inputContainer}>
                    </View>
                    <Text style={styles.titleText}>Photo 4 :</Text>
                    <View style={styles.inputContainer}>
                    </View> */}
                </View>
            </ScrollView>      
        </SafeAreaProvider>
    );
}

export default ViewPage;

const styles = StyleSheet.create({
    inputContainer: {
        position: 'relative',
        width: '90%',
    },
    placeholder: {
        marginHorizontal: 30,
        height: 300,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ddd',
        marginTop: 40,
        marginBottom: 40,
    },
    image: {
        marginHorizontal: 30,
        height: 300,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ddd',
        marginTop: 40,
        marginBottom: 40,
    },
    inputStatus: {
        height: 50,
        borderWidth: 3,
        borderBlockColor: 'white',
        backgroundColor: 'white',
        borderRadius: 5,
        padding: 10,
        marginHorizontal: 30,
        fontWeight: 'bold',
        color: 'blue',
        textAlign: 'center',
    },
    input: {
        height: 50,
        borderWidth: 3,
        borderBlockColor: 'white',
        backgroundColor: 'white',
        borderRadius: 5,
        padding: 10,
        marginHorizontal: 30,
        fontWeight: 'bold',
        color: 'blue',
        textAlign: 'center',
    },
    titleText: {
        fontSize: 16,
        fontWeight: 'bold',
        margin: 20,
        color: 'white',
    },
    headerText: {
        fontSize: 26,
        fontWeight: 'bold',
        margin: 20,
    },
    header: {
        backgroundColor: '#ffff',
    },
    container: {
        flex: 2,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#232C69'
    }
});