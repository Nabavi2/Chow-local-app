import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  Fragment,
  useMemo,
} from 'react';
import {
  View,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSelector, useDispatch } from 'react-redux';
import { Swipeable } from 'react-native-gesture-handler';
import { NavigationService } from '~/core/services/NavigationService';
import { Selector, AppText } from '~/components';
import { Theme } from '~/styles';
export const CartItem = ({
  orderDetail,
  product,  
}) => {
  const ref = useRef();
  const dispatch = useDispatch();
  const products_extra = useMemo(() => {
    let products_extra_array = [];

    if (product && product.extras) {
      for (var key in product.extras) {
        if (product.extras.hasOwnProperty(key)) {
          let product_extra = product.extras[key];
          products_extra_array.push(product_extra);
        }
      }
    }
    return products_extra_array;
  }, [product]); 

  const extrasOptions = useMemo(() => {
    var extraOptions = false;

    if (product && product.extras.length) {
      let i = 0;
      for (var key in product.extras) {
        if (i === 0) {
          extraOptions = '';
        }

        let addOn = product.extras[key];
        let addOnName = product.extras[key].name;

        let addOnValues = '';
        let optionIndex = 0;

        for (var optionKey in addOn.options) {
          let addOnValue = addOn.options[optionKey];

          addOnValues +=
            (optionIndex > 0 ? ' + ' : '') +
            (addOnValue.quantity > 1 ? addOnValue.quantity + ' x ' : '') +
            addOnValue.name;
          optionIndex++;
        }

        extraOptions += `${addOnName}: ${addOnValues}${'\n'}`;
        i++;
      }
      console.log(extraOptions,"here!!!!!!!!!");
      return <AppText style={[styles.item]}>{extraOptions}</AppText>;
    }

    return extraOptions;
  }, [product]);
  return (
    <Fragment>
     
        <View style={styles.container}>
          <View style={styles.name}>
            <View style={{flexDirection:'row'}}>
              <AppText
                style={[styles.item, styles.productName]}>
                {product.product_name}                
              </AppText>
              <AppText style={[styles.item, styles.picker]}>{product.quantity}</AppText>
              <AppText numberOfLines={1} style={[styles.item, styles.price]}>
                {orderDetail.currency_icon}
                {(+product.amount).toFixed(2)}
              </AppText>
            </View>
              {(
                product.option_name != 'Default' && <View>
                  <AppText style={[styles.item, styles.optionName]}>
                    {product.options_name }: <AppText style={[styles.item, styles.optionDetailName,]}>{product.option_name }
                    </AppText></AppText>
                  </View>
              )}
            {products_extra.length > 0 && (
              products_extra.map((extra_option) => {
                let products_choosen_options_array = [];

                if (extra_option.options) {
                  for (var key in extra_option.options) {
                    if (extra_option.options.hasOwnProperty(key)) {
                      let product_options = extra_option.options[key];
                      products_choosen_options_array.push(product_options);
                    }
                  }
                }
                return <AppText style={[styles.item]}>
                  <AppText style={[styles.item, styles.optionName,]}>{extra_option.name}:</AppText> {products_choosen_options_array.map((item,index)=>{
                    return <AppText style={styles.optionDetailName}>{index > 0 && ', '}{item.quantity > 1 ? item.quantity + ' x ' + item.name : item.name}</AppText>
                  })}
                </AppText>
              }
            )
             
            )}
             {product.instructions.length != 0 && (               
              <AppText style={[styles.item, styles.instructions]} numberOfLines={3}>
                 <Icon style={{marginRight: 10}} size={10} color={Theme.color.accentColor} name="chat-plus" />
                {product.instructions}
              </AppText>
            )}
            {extrasOptions ? extrasOptions : null}
          </View>
      
        </View>
    </Fragment>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,

    borderTopWidth: 1,
    borderTopColor: 'grey',
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
    fontSize: 13,
    color: "#000000", 
  },
  
  optionDetailName: {
    flex: 1,
    fontSize: 13,
    color: "#585858",
  },

  instructions: {
    flex: 1,
    fontSize: 14,
    marginTop: 0,
    color: Theme.color.accentColor,
  },

  selectorLabel : {
    width: 20,
    height: 20
  },

  price: {
    
    fontSize: 14,
    fontWeight: 'bold',
    width: 70,
    textAlign: 'right',
  },

  arrows: {
    position: 'absolute',
    right: 3,
  },
});
