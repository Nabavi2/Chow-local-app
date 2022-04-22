import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';

import { Loading } from '..';
import { AppText } from '~/components';

export const CardItem = ({ card }) => {
  var array_card_full = card.full.split(" ");
  array_card_full.splice(0,1);
  var parse_card_full = array_card_full.join(" ");
  return (
    <View style={styles.pastAddress}>
      <AppText style={styles.addressString} numberOfLines={1}>
        {parse_card_full}
      </AppText>
      <AppText style={styles.zipCodeString} numberOfLines={1}>
        {card.brand}
      </AppText>
    </View>
  )
};

const styles = StyleSheet.create({
  addressString: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  zipCodeString: {
    flex: 1,
    fontSize: 16,
  },

  pastAddress: {
    flex: 1,
    flexDirection: 'column',
  },
});
