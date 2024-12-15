import React from 'react';
import { View, Text, TouchableOpacity, ViewStyle, TextStyle } from 'react-native';
import BackBtn from '../../assets/images/back_btn';
import { ScaledSheet } from 'react-native-size-matters';
import { light } from '../../styles/colors';
import { fonts } from '../../styles/fonts';

interface HeaderProps {
  navigation: {
    goBack: () => void;
  };
  headerName: string;
  onBackPress?: () => void;
  showBackIcon?: boolean;
}

const Header: React.FC<HeaderProps> = ({ navigation, headerName, onBackPress, showBackIcon = true }) => {
  return (
    <View style={styles.header}>
      {showBackIcon ? (
        <View style={styles.flexContainer}>
          <TouchableOpacity
            style={styles.userAvatarBackground}
            onPress={() => {
              if (onBackPress) {
                onBackPress();
              } else {
                navigation.goBack();
              }
            }}>
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
};

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
