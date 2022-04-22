import React, { useMemo } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { ThemeColors } from 'react-navigation';
import { Theme, Controls } from '~/styles';
import { AppText } from '~/components';

import { NavigationService } from '~/core/services';


export const Selector = ({
  nameSelector,
  labelSelector,
  typeSelector,
  header,
  title,
  value,
  onChange,
  options,
  style,
  placeholder,
  noOptionsText,
  hideSelector = false,
}) => {
  const label = useMemo(() => {
    const match = options.find(
      (option) => option.value.toString() === value.toString(),
    );
    return match ? match.label : '';
  }, [options, value]);
  return (
    <View style={styles.container}>
      {labelSelector ? (
        <AppText style={[styles.labelStyle, styles.labelSelector]}  
        onPress={() => {
          NavigationService.navigate('SelectorPage', {
            title,
            header,
            options,
            action: onChange,
            noOptionsText: noOptionsText
              ? noOptionsText
              : 'No Options Available',
          });}}>
          {label.toString()}
        </AppText>
      ) : null}
      {nameSelector ? (<AppText style={[styles.textStyle, styles.nameSelector]}>{nameSelector} </AppText>) : null}
      {!hideSelector && !typeSelector && (
        <TouchableOpacity
          style={[styles.item, styles.picker, style]}
          activeOpacity={0.8}
          onPress={() => {
            NavigationService.navigate('SelectorPage', {
              title,
              header,
              options,
              action: onChange,
              noOptionsText: noOptionsText
                ? noOptionsText
                : 'No Options Available',
            });
          }}>
          <AppText style={styles.textStyle}>
            {label ? label.toString() : placeholder && placeholder}
          </AppText>

          <Icon size={20} name="menu-swap" />
        </TouchableOpacity>
      )}

      {!hideSelector && typeSelector  && (
        <TouchableOpacity
          style={[styles.item, styles.picker, style]}
          activeOpacity={0.8}
          onPress={() => {
            NavigationService.navigate('SelectorPage', {
              title,
              header,
              options,
              action: onChange,
              noOptionsText: noOptionsText
                ? noOptionsText
                : 'No Options Available',
            });
          }}>
          <AppText style={styles.typeHeading}>
            {title}
          </AppText>
          <AppText style={label ? styles.textStyle : styles.placeholder}>
            {label ? label.toString() : placeholder && placeholder}
          </AppText>

          <Icon size={20} name="menu-down" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    flex: 1,
  },
  modal: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },

  listItem: {},

  listItemText: {
    textAlign: 'center',
    fontSize: 18,
    paddingVertical: 8,
  },

  modalContent: {
    backgroundColor: 'white',
    borderRadius: 4,
    maxHeight: 200,
    width: '80%',
    padding: 20,
  },

  item: {
    padding: 0,
    minWidth: 60,
  },

  picker: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 0,
    borderWidth: 1,
    borderColor: '#ddd',

    paddingLeft: 10,
    paddingRight: 5,

    height: 50,
  },

  labelStyle: {
    flex: 1,
    fontSize: 16,
    width: 35,
    height: 35,
    position: 'absolute'
  },

  textStyle: {    
    flex: 1,
    fontSize: 14,
    marginBottom: 10,
    paddingLeft: 5,
    paddingTop:8,
    color:'black',
  },

  labelSelector: {
    marginBottom: 5,
    marginTop: -15,
    textAlign: 'center',
    borderRadius:  100,
    backgroundColor:  Theme.color.backgroundColor,
    borderColor:Theme.color.borderColor,
    paddingTop: 5
  },

  itemStyle: {
    borderWidth: 1,
    borderColor: 'white',
    height: 40,
    fontSize: 18,
    textAlign: 'left',
  },

  arrows: {},

  placeholder: {
    color: '#c8c8c8',
    fontSize: 14,
    flex: 1
  },

  typeHeading: {
    fontWeight: 'bold',
    fontSize: 14,
    width: Controls.input.labelTextWidth - 10,
    paddingRight: 10
  }
});
