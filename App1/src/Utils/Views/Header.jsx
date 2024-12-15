import React, {Component} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import BackBtn from '../../assets/images/back_btn';
import {ScaledSheet} from 'react-native-size-matters';
import {light} from '../../styles/colors';
import {fonts} from '../../styles/fonts';

class Header extends Component {
  handleBackPress = () => {
    const {navigation, onBackPress} = this.props;

    if (onBackPress) {
      onBackPress();
    } else if (navigation) {
      navigation.goBack();
    }
  };

  render() {
    const {headerName, showBackIcon = true} = this.props;

    return (
      <View style={styles.header}>
        {showBackIcon ? (
          <View style={styles.flexContainer}>
            <TouchableOpacity
              style={styles.userAvatarBackground}
              onPress={this.handleBackPress}>
              <BackBtn style={styles.avatarStyle} />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.flexContainer} />
        )}
        <View style={styles.titleContainer}>
          <Text style={styles.headerText}>{headerName}</Text>
        </View>
        <View style={styles.flexContainer} />
      </View>
    );
  }
}

const styles = ScaledSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: '5@s',
    padding: '5@s',
    marginTop: '50@vs',
  },
  flexContainer: {
    flex: 1,
  },
  userAvatarBackground: {
    height: '50@s',
    width: '50@s',
    borderRadius: '10@s',
    justifyContent: 'center',
  },
  avatarStyle: {
    alignSelf: 'center',
    marginBottom: '5@vs',
  },
  titleContainer: {
    flex: 4,
  },
  headerText: {
    alignSelf: 'center',
    color: light.primary,
    ...fonts.subTitleSemiBold20,
  },
});

export default Header;
