import React, {Component} from 'react';
import {View, StyleSheet, ImageBackground} from 'react-native';
import Gradient_BG from '../../assets/images/Gradient_BG.png';

class GradientBackground extends Component {
  render() {
    const {children, style} = this.props;

    return (
      <ImageBackground
        source={Gradient_BG}
        style={[styles.background, style]}
        imageStyle={styles.image}>
        {children}
      </ImageBackground>
    );
  }
}

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
