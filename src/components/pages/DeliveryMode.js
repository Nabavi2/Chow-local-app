import React from 'react';
import { View, StyleSheet } from 'react-native';
import { CheckBox } from 'react-native-elements';

import { Theme } from '~/styles';

import { AppText } from '~/components';

export const DeliveryMode = ({
  name,
  price,
  disabled = false,
  checked,
  onPress,
  ...props
}) => (
  <View style={[styles.wrapper,(checked && styles.checkedWrapper)]}>
    <CheckBox
      title={
        <View style={[styles.deliveryMode, disabled && styles.disabled]}>
          <AppText
            style={[
              styles.deliveryModeText,
              checked && styles.deliveryModeActive,
            ]}>
            {name}
          </AppText>
          <AppText style={[styles.deliveryPrice,(checked && styles.deliveryPriceChecked)]}>{price}</AppText>
        </View>
      }
      containerStyle={styles.container}
      checkedColor={Theme.color.accentColor}
      size={props.size}
      checked={checked}
      onPress={() => !disabled && onPress()}
    />

    {disabled && <View style={styles.overlay} />}
  </View>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    borderWidth: 0,
  },

  wrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    position: 'relative',
  },

  checkedWrapper : {
    backgroundColor: '#000'
  },

  overlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    backgroundColor: 'transparent',
  },

  disabled: {
    opacity: 0.6,
  },

  deliveryMode: {
    marginLeft: 5,
  },

  deliveryModeText: {
    fontWeight: 'bold',
    fontSize: 14,
  },

  deliveryModeActive: {
    color: Theme.color.accentColor,
  },

  deliveryPriceChecked : {
    color : '#FFF'
  },

  deliveryPrice: {
    fontSize: 12,
  },
});
