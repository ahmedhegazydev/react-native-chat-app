import React, {Component} from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
} from 'react-native';
import {ms} from 'react-native-size-matters';
import Zoomable from './Zoomable';

class CustomButton extends Component {
  render() {
    const {
      passedIcon,
      onPress,
      title,
      style,
      disabled,
      textStyle = {},
      loading,
    } = this.props;

    return (
      <Zoomable
        style={[styles.button, style, disabled && styles.buttonDisabled]}
        onPress={!disabled && !loading ? onPress : null}
        activeOpacity={disabled || loading ? 1 : 0.7}
        disabled={disabled || loading}>
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
            {passedIcon && (
              <View style={styles.iconContainer}>{passedIcon}</View>
            )}
          </View>
        )}
      </Zoomable>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#EFF0F3',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
  },
  buttonDisabled: {
    backgroundColor: '#EFF0F3',
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
