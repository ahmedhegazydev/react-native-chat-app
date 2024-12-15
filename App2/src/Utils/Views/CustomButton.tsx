import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
  ViewStyle,
  TextStyle,
  ReactNode,
} from 'react-native';
import { ms } from 'react-native-size-matters';
import Zoomable from './Zoomable';

interface CustomButtonProps {
  passedIcon?: ReactNode;
  onPress: () => void;
  title: string;
  style?: ViewStyle;
  disabled?: boolean;
  textStyle?: TextStyle;
  loading?: boolean;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  passedIcon,
  onPress,
  title,
  style,
  disabled = false,
  textStyle = {},
  loading = false,
}) => (
  <Zoomable
    style={[styles.button, style, disabled && styles.buttonDisabled]}
    onPress={!disabled && !loading ? onPress : undefined}
    activeOpacity={disabled || loading ? 1 : 0.7}
    disabled={disabled || loading}
  >
    {loading ? (
      <View style={styles.loadingContainer}>
        <Text style={[styles.buttonText, textStyle, styles.loadingText]}>
          {title}
        </Text>
        <ActivityIndicator color="#FFFFFF" size="small" />
      </View>
    ) : (
      <View style={styles.contentContainer}>
        <Text style={[styles.buttonText, textStyle, styles.textAlign]}>
          {title}
        </Text>
        {passedIcon && <View style={styles.iconContainer}>{passedIcon}</View>}
      </View>
    )}
  </Zoomable>
);

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#EFF0F3',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
  },
  buttonDisabled: {
    backgroundColor: '#D0D0D0', // Changed to a more noticeable disabled color
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingText: {
    textAlign: 'center',
    marginEnd: ms(5),
  },
  contentContainer: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textAlign: {
    textAlign: 'center',
  },
  iconContainer: {
    marginHorizontal: ms(8),
  },
});

export default CustomButton;
