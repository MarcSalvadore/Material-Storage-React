import { FontAwesome } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Camera, CameraView } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library'; // Import MediaLibrary to save captured photo
import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, Image, Pressable, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { RNCamera } from 'react-native-camera';

const WINDOW_HEIGHT = Dimensions.get("window").height;
const captureSize = Math.floor(WINDOW_HEIGHT * 0.09);

export default function Capture() {
  const [hasPermission, setHasPermission] = useState(null);
  const [isPreview, setIsPreview] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const cameraRef = useRef();
  const navigation = useNavigation();
  const route = useRoute();
  const { onCapture } = route.params;

  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    getCameraPermissions();
  }, []);

  const onCameraReady = () => {
    setIsCameraReady(true);
  };

  const handleTakePicture = async () => {
    if (cameraRef.current) {
      try {
        const { uri } = await cameraRef.current.takePictureAsync();
        console.log('Photo taken:', uri);

        // Save the photo to the device's gallery using MediaLibrary
        const asset = await MediaLibrary.createAssetAsync(uri);
        onCapture(uri);

        // Display the captured image
        setCapturedImage(uri);
      } catch (error) {
        console.error('Failed to take picture:', error);
        // Handle error taking photo
      }
    }
  };

  const handleRetakePicture = () => {
    // Clear the captured image URI to go back to camera preview
    setCapturedImage(null);
  };

  const goToHomePage = () => {
    navigation.goBack();
  };

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <SafeAreaView style={styles.container}>
    {capturedImage ? (
        <View style={{ flex: 1 }}>
          <Image source={{ uri: capturedImage }} style={{ flex: 1 }} />
          <View style={styles.fixToText}>
            <Pressable style={styles.captureButton} onPress={handleRetakePicture}>
                <FontAwesome name="close" size={70} color="red" />
            </Pressable>
            <Pressable style={styles.doneButton} onPress={goToHomePage}>
                <FontAwesome name="check" size={70} color="green" />
            </Pressable>
          </View>
        </View>
      ) : (
        <View style={{ flex: 1 }}>
            <CameraView
                ref={cameraRef}
                style={styles.container}
                type={RNCamera.Constants.Type.back}
                flashMode={RNCamera.Constants.FlashMode.on}
                onCameraReady={onCameraReady}
                onMountError={(error) => {
                console.log("camera error", error);
                }}
            />
          <View style={styles.buttonContainer}>
            <TouchableOpacity
                style={styles.captureButton}
                onPress={handleTakePicture}
            >
                <FontAwesome name="dot-circle-o" size={100} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    fixToText: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        position: 'absolute',
        alignSelf: 'center',
        bottom: 0,
        marginBottom: 50,
        width: '50%',
    },
    doneButton: {
        marginBottom: 15,
        justifyContent: 'flex-end',
    },
    captureButton: {
        marginBottom: 15,
        alignItems: 'center',
    },
    capture: {
        backgroundColor: "#f5f6f5",
        borderRadius: 5,
        height: captureSize,
        width: captureSize,
        borderRadius: Math.floor(captureSize / 2),
        marginHorizontal: 31,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    buttonContainer: {
        position: 'absolute',
        bottom: 20,
        alignSelf: 'center',
        marginBottom: 20,
    },
    retryContainer: {
        position: 'absolute',
        bottom: 20,
        marginBottom: 20,
    },
});
