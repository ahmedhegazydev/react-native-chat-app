import React, {Component} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import PasswordInvisible from '../../assets/icons/password_invisible.svg';
import PasswordVisible from '../../assets/icons/password_visible.svg';

class LabeledTextInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hidePassword: props.secureTextEntry || false,
    };
  }

  togglePasswordVisibility = () => {
    this.setState(prevState => ({
      hidePassword: !prevState.hidePassword,
    }));
  };

  render() {
    const {
      label,
      value,
      isRequired = false,
      placeholder,
      onFocus = () => {},
      editable = true,
      placeholderTextColor = '#CDCED7',
      currencySymbol,
      containerStyle = {},
      inputStyle = {},
      labelStyle = {},
      onChangeText = () => {},
      secureTextEntry = false,
    } = this.props;
    const {hidePassword} = this.state;

    return (
      <View style={[styles.container, containerStyle]}>
        {label && (
          <Text style={[styles.label, labelStyle]}>
            {label}
            {isRequired && <Text style={styles.requiredSymbol}>*</Text>}
          </Text>
        )}
        <View style={styles.inputWrapper}>
          <TextInput
            onFocus={onFocus}
            contextMenuHidden
            style={[styles.input, inputStyle]}
            value={value}
            placeholderTextColor={placeholderTextColor}
            autoCorrect={false}
            placeholder={placeholder}
            editable={editable}
            onChangeText={onChangeText}
            secureTextEntry={hidePassword}
          />
          {secureTextEntry ? (
            <TouchableOpacity
              style={styles.iconContainer}
              onPress={this.togglePasswordVisibility}>
              {hidePassword ? (
                <PasswordInvisible width={20} height={20} />
              ) : (
                <PasswordVisible width={20} height={20} />
              )}
            </TouchableOpacity>
          ) : (
            currencySymbol && (
              <Text style={styles.currencySymbol}>{currencySymbol}</Text>
            )
          )}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'flex-start',
  },
  label: {
    color: '#4C3C8D',
    fontSize: 16,
    marginBottom: 3,
  },
  requiredSymbol: {
    color: 'red',
  },
  inputWrapper: {
    backgroundColor: '#F9F9FE',
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D8D9E0',
    borderRadius: 10,
    width: '100%',
    paddingHorizontal: 10,
    height: 50,
  },
  input: {
    flex: 1,
    height: '100%',
    textAlign: 'right',
    color: '#4C3C8D',
    fontSize: 16,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  currencySymbol: {
    color: '#4C3C8D',
    fontSize: 16,
    marginHorizontal: 8,
  },
});

export default LabeledTextInput;
