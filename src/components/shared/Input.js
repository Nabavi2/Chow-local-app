import React, { useMemo } from 'react';
import {
  TextInput,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { Theme, Controls } from '~/styles';
import { AppText } from '~/components';

export const Input = ({
  type = 'text', // text | textarea | password
  placeholder = '',
  value,
  onChange,
  onEndEditing,
  titleType = 'text', // text | icon | image | money
  title,
  actionIcon = null,
  actionHandler = null,
  whitebg = false,
  editable = true,
  style,
  ...props
}) => {
  const titleStyle = useMemo(() => {
    switch (titleType) {
      case 'text':
        return styles.titleTextWrapper;

      case 'icon':
      case 'image':
        return styles.titleIconWrapper;
      case 'money':
        return styles.titleMoneyWrapper;
      default:
        return null;
    }
  }, [titleType]);

  return (
    <View
      style={[
        styles.wrapper,
        whitebg && styles.whitebg,
        type === 'textarea' ? styles.textarea : styles.text,
        style,
      ]}>
      {title && (
        <View
          style={[
            type !== 'textarea' && ( type==='creditCard' ? styles.textWidth : titleStyle), 
            type === 'textarea' ? styles.textareaTitle : styles.title,
          ]}>
          {titleType === 'text' ||  titleType === 'money' ? (
            <AppText style={styles.titleText}>{title}</AppText>
          ) : titleType === 'icon' ? (
            <Icon size={Controls.input.iconSize} name={title} />
          ) : (
            <Image
              style={styles.titleImage}
              source={title}
              resizeMode="contain"
            />
          )}
        </View>
      )}
      {type =='address_country' ?
      <AppText style={[
          styles.input,{marginLeft:0,paddingVertical:15,
            color: '#c8c8c8'}]}>
            {placeholder}
      </AppText> :
       <TextInput
        allowFontScaling={false}
        style={[
          styles.input,
          (!title || type === 'textarea') && styles.padding,
        ]}
        secureTextEntry={type === 'password'}
        placeholder={placeholder}
        placeholderTextColor="#A8A8A8"
        value={value}
        autoCapitalize="none"
        onChangeText={onChange}
        onEndEditing={onEndEditing}
        editable={editable}
        multiline={type === 'textarea'}
        {...props}
      />}
      {actionIcon && actionHandler && (
        <TouchableOpacity style={styles.actionWrapper} onPress={actionHandler}>
          <Icon
            size={Controls.input.iconSize}
            color="black"
            name={actionIcon}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: Controls.input.backgroundColor,
    // width: '100%',
  },

  whitebg: {
    backgroundColor: 'white',
  },

  input: {
    flex: 1,
    fontSize: Controls.input.fontSize,
    color: '#000',
  },

  text: {
    height: Controls.input.height,
    color: Controls.input.color,
  },

  textarea: {
     height: Controls.input.textareaHeight,
     flexDirection: 'column',
  },

  textareaTitle: {
    padding: 10,
  },

  title: {
    display: 'flex',
    justifyContent: 'center',
  },

  titleTextWrapper: {
    width: Controls.input.labelTextWidth,
    paddingHorizontal: 10,
  },

  textWidth: {
    width: 137,
    paddingHorizontal: 10,
  },

  titleIconWrapper: {
    alignItems: 'center',
    width: Controls.input.labelIconWidth,
  },
  
  titleMoneyWrapper: {
    alignItems: 'center',
    width: 50,
  },  

  titleText: {
    fontWeight: 'bold',
    fontSize: Controls.input.fontSize,
  },

  titleImage: {
    width: Controls.input.imageWidth,
    height: Controls.input.imageHeight,
  },

  padding: {
    paddingHorizontal: 10,
    marginTop: 0,
  },

  actionWrapper: {
    width: Controls.input.height,
    height: '100%',
    // backgroundColor: Theme.color.accentColor,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
