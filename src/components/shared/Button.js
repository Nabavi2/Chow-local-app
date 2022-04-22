import React, { useMemo } from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { AppText } from '~/components';
import { Theme, Controls } from '~/styles';

// Available Types:
// accent
// bordered-light
// bordered-dark
// borderless
export const Button = ({
  type,
  children,
  onClick,
  unreadText = null,
  icon = null,
  iconColor = null,
  rightText = null,
  style = {},
  titleStyle = {},
  fullWidth = false,
  disabled,
  ...props
}) => {
  const wrapperStyle = useMemo(() => {
    switch (type) {
      case 'accent':
        return styles.accent;
      case 'splash-btn':
        return styles.splash;
      case 'accent-green':
        return styles.accent_green;
      case 'bordered-light':
      case 'bordered-dark':
        return styles.bordered;
      case 'borderless':
        return styles.borderless;
      case 'borderlessorder':
        return styles.borderlessorder;
      case 'white':
        return styles.white;
      case 'black':
        return styles.black;
      case 'bordered-black':
        return styles.borderedBlack;
      case 'bordered-grey':
        return styles.borderedGrey;
      default:
        return null;
    }
  }, [type]);

  const textStyle = useMemo(() => {
    switch (type) {
      case 'accent':
      case 'accent-green':
      case 'bordered-light':
        return styles.whiteText;
      case 'bordered-dark':
      case 'bordered-black':
        return styles.blackText;
      case 'borderless':
        return styles.greyText;
      case 'white':
        return styles.blackText;
      case 'black':
        return styles.whiteText;
      case 'bordered-grey':
        return styles.greyText;
      case 'borderlessorder':
        return styles.redText;
      default:
        return null;
    }
  }, [type]);

  const disabledStyle = useMemo(() => {
    switch (type) {
      case 'black':
        return styles.disabledGrey;
      default:
        return null;
    }
  }, [type]);

  return (
    <TouchableOpacity
      style={[
        styles.button,
        wrapperStyle,
        style,
        fullWidth ? styles.fullWidth : null,
        disabled ? disabledStyle : null,
      ]}
      disabled={disabled}
      onPress={onClick}>
      {icon && (
        <View style={styles.icon}>
          <Icon
            size={Controls.button.iconSize}
            name={icon}
            color={iconColor ? iconColor : 'white'}
          />
        </View>
      )}
      <AppText style={[styles.text, textStyle, titleStyle]}>{children} </AppText>
      {unreadText != null &&<AppText style={styles.unreadDot}>{unreadText}</AppText>}    
      {rightText ? (
        <View style={styles.right}>
          <AppText style={[styles.text, textStyle, titleStyle]}>
            {rightText}
          </AppText>
        </View>
      ) : null}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderWidth: 2,
    borderStyle: 'solid',
    height: Controls.button.height,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
  },

  alignCenter: {
    justifyContent: 'center',
  },

  unreadDot: {  
    justifyContent:'center',
    textAlign:"center", 
    fontSize: 11,
    color: "#fff",    
    fontWeight: "bold",
    backgroundColor: "#f00",
    borderRadius: 8, 
    minWidth:18,
    minHeight: 18,
    marginTop: -3,
    paddingHorizontal: 5
  },
  alignLeft: {
    justifyContent: 'flex-start',
  },

  alignSpaceBetween: {
    justifyContent: 'space-between',
  },

  icon: {
    position: 'absolute',
    left: 10,
    top: 12,
  },

  accent: {
    borderColor: Theme.color.accentColor,
    backgroundColor: Theme.color.accentColor,
  },

  accent_green: {
    borderColor: '#31D457',
    backgroundColor: '#31D457',
  },
 
  splash: {
    borderColor:'transparent',
    backgroundColor:"#ffffff66"
  },

  bordered: {
    borderColor: Theme.color.borderColor,
    backgroundColor: 'transparent',
  },

  borderless: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    opacity: 0.8,
  },

  borderlessorder: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
  },

  white: {
    backgroundColor: 'white',
  },

  black: {
    backgroundColor: 'black',
  },

  text: {
    fontWeight: 'bold',
    fontSize: Controls.button.fontSize,
  },

  whiteText: {
    color: 'white',
  },

  greyText: {
    color: '#ccc',
  },

  redText: {
    color: 'red',
  },

  blackText: {
    color: 'black',
  },

  borderedBlack: {
    borderColor: 'black',
  },

  borderedGrey: {
    borderColor: '#ccc',
  },

  fullWidth: {
    width: '100%',
  },

  disabledGrey: {
    backgroundColor: '#ccc',
    borderColor: '#ccc',
  },

  right: {
    position: 'absolute',
    right: 10,
    top: 12,
  },
});
