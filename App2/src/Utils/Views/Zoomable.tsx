import React, { useRef } from 'react';
import { Animated, TouchableWithoutFeedback, StyleSheet, View, ViewStyle } from 'react-native';

// Define types for the props
interface ZoomableProps {
  children: React.ReactNode;
  onPress?: () => void;  // onPress is optional
  zoomOutValue?: number;
  zoomInValue?: number;
  duration?: number;
  disableAnimation?: boolean;
  style?: ViewStyle; // style can be any valid ViewStyle object
}

const Zoomable: React.FC<ZoomableProps> = ({
  children,
  onPress,
  zoomOutValue = 0.9,
  zoomInValue = 1.1,
  duration = 150,
  disableAnimation = false,
  style,
}) => {
  const scaleValue = useRef(new Animated.Value(1)).current;

  const handleZoom = () => {
    if (disableAnimation) {
      if (onPress) onPress();
      return;
    }

    Animated.sequence([
      Animated.timing(scaleValue, {
        toValue: zoomOutValue,
        duration,
        useNativeDriver: true,
      }),
      Animated.timing(scaleValue, {
        toValue: zoomInValue,
        duration,
        useNativeDriver: true,
      }),
      Animated.timing(scaleValue, {
        toValue: 1,
        duration,
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (onPress) onPress();
    });
  };

  return (
    <TouchableWithoutFeedback onPress={handleZoom}>
      <Animated.View style={[style, { transform: [{ scale: scaleValue }] }]}>
        {children}
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

export default Zoomable;
