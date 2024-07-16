import { FontAwesome } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Header } from 'react-native-elements';
import { SafeAreaProvider } from "react-native-safe-area-context";
import CompanyLogo from './CompanyLogo';
import LPMSLogo from './LPMSLogo';

function ViewPage({ }) {
    const navigation = useNavigation();
    const route = useRoute();
    const [projectId, setProjectId] = useState('')
    const [response, setResponse] = useState([]);
    const [error, setError] = useState(null);

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
                    <Text style={styles.titleText}>Photo 1 :</Text>
                    <View style={styles.inputContainer}>
                    </View>
                    <Text style={styles.titleText}>Photo 2 :</Text>
                    <View style={styles.inputContainer}>
                    </View>
                    <Text style={styles.titleText}>Photo 3 :</Text>
                    <View style={styles.inputContainer}>
                    </View>
                    <Text style={styles.titleText}>Photo 4 :</Text>
                    <View style={styles.inputContainer}>
                    </View>
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