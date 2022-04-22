import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { AppText } from '~/components';
import { NavigationService } from '~/core/services/NavigationService';
import { Theme } from '~/styles';
import { clearNotification } from '~/store/actions';
import { useDispatch } from 'react-redux';

export const Price = (style = null) => {
  const dispatch = useDispatch();

  const price = useSelector(
    (state) => state.order.order && state.order.order.cart_amount,
  );
  const order = useSelector((state) => state.order.order);

  return (+price || 0) > 0 ? (
    <TouchableOpacity
      style={styles.headerRight}
      onPress={() => {
        dispatch(clearNotification());
        NavigationService.navigate('MyOrder');
      }}>
      <Icon size={20} color="white" name="cart-outline" style={styles.icon} />
    </TouchableOpacity>
  ) : (
    <></>
  );
};

const styles = StyleSheet.create({
  headerRight: {
    height: 40,
    width: 40,
    borderRadius: 20,
    backgroundColor: Theme.color.accentColor,
    alignItems: 'center',
    justifyContent: 'center',
  },

  priceText: {
    color: Theme.registerHeader.actionColor,
    marginRight: 6,
  },

  icon: {
    marginTop: 3,
  },
});
