import React from 'react';
import { View, StyleSheet } from 'react-native';

import { AppText } from '~/components';
import { Theme } from '~/styles';

export const PastOrder = ({ orderDetail, product }) => {
  return (
    <View style={styles.container}>
      <View style={styles.name}>
        <AppText style={[styles.item, styles.productName]}>
          {product.product_name}
        </AppText>
        <AppText style={[styles.item, styles.optionName]}>
          {product.option_name}
        </AppText>
      </View>
      <AppText style={[styles.item, styles.picker]}>{product.quantity}</AppText>
      <AppText numberOfLines={1} style={[styles.item, styles.price]}>
        {orderDetail.currency_icon}{(+product.amount).toFixed(2)}
      </AppText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,

    borderTopWidth: 1,
    borderTopColor: Theme.color.borderColor,
  },

  item: {
    margin: 5,
  },

  picker: {
    width: 30,
    justifyContent: 'center',
  },

  name: {
    flex: 1,
  },

  productName: {
    flex: 1,
    fontSize: 16,
    marginBottom: 0,
  },

  optionName: {
    flex: 1,
    fontSize: 14,
    color: Theme.color.accentColor,
  },

  price: {
    fontSize: 14,
    fontWeight: 'bold',
    width: 85,
    textAlign: 'right',
  },

  arrows: {
    position: 'absolute',
    right: 3,
  },
});
