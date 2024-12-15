import React, {Component} from 'react';
import {
  Animated,
  TouchableWithoutFeedback,
  StyleSheet,
  View,
} from 'react-native';

class Zoomable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scaleValue: new Animated.Value(1),
    };
  }

  handleZoom = () => {
    const {
      onPress,
      zoomOutValue = 0.9,
      zoomInValue = 1.1,
      duration = 150,
      disableAnimation = false,
    } = this.props;
    const {scaleValue} = this.state;

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

  render() {
    const {children, style} = this.props;
    const {scaleValue} = this.state;

    return (
      <TouchableWithoutFeedback onPress={this.handleZoom}>
        <Animated.View style={[style, {transform: [{scale: scaleValue}]}]}>
          {children}
        </Animated.View>
      </TouchableWithoutFeedback>
    );
  }
}

export default Zoomable;
