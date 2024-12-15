import React from 'react';
import { View, StyleSheet, ImageBackground, ViewStyle } from 'react-native';
import Gradient_BG from '../../assets/images/Gradient_BG.png';

interface GradientBackgroundProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

const GradientBackground: React.FC<GradientBackgroundProps> = ({ children, style }) => {
  return (
    <ImageBackground
      source={Gradient_BG}
      style={[styles.background, style]}
      imageStyle={styles.image}
    >
      {children}
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  image: {
    borderRadius: 16,
  },
});

export default GradientBackground;
