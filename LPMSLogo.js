// LPMSLogo.js
import { useAssets } from 'expo-asset';
import { Image } from 'react-native';
import React from 'react';

const LPMSLogo = () => {
  const [assets] = useAssets([require('./assets/lpms-logo.png')]);

  return assets ? <Image source={assets[0]} style={{ width: 80, height: 60 }} resizeMode='contain' /> : null;
};

export default LPMSLogo;
