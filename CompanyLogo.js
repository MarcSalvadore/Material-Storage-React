// CompanyLogo.js
import { useAssets } from 'expo-asset';
import { Image } from 'react-native';
import React from 'react';

const CompanyLogo = () => {
  const [assets] = useAssets([require('./assets/tripatra-logo-9b9b1032.jpeg')]);

  return assets ? <Image source={assets[0]} style={{ width: 60, height: 50 }} /> : null;
};

export default CompanyLogo;
