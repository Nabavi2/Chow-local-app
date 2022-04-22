import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import parseAddress from 'parse-address-string';

import { Loading } from '..';
import { AppText } from '~/components';
process.nextTick = setImmediate;
export const StoredAddress = ({ address }) => {
  const [parsedAddress, setParsedAddress] = useState();

  useEffect(() => {
    address.warehouse_address ?
      parseAddress(address.warehouse_address, (err, addressObj) => {
        err = err;
        setParsedAddress(addressObj);
      }): parseAddress(address.warehouse_address, (err, addressObj) => {
        err = err;
        setParsedAddress(addressObj);
      });
  }, [address]);

  return parsedAddress ? (
    <View style={styles.pastAddress}>
      <AppText style={styles.addressString} numberOfLines={1}>
        {`${parsedAddress.street_address1 ? parsedAddress.street_address1+',' :''} `}
      </AppText>
      <AppText style={styles.zipCodeString} numberOfLines={1}>
        {parsedAddress.city}, {parsedAddress.state}
      </AppText>
    </View>
  ) : (
    <Loading />
  );
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
    flexDirection: 'row',
    alignItems: 'center',
  },
});
