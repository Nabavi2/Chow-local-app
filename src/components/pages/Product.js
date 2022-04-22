import React from 'react';
import { View, Image, ActivityIndicator, StyleSheet } from 'react-native';
import { AppText, DashedLine } from '~/components';
import { renderHTML } from '~/core/utility';
export const Product = ({
  territory,
  product,
  style = 'default',
  first,
  last,
  length,
}) => {
  const productPrice = product.options && product.options.length > 0
    ? product.options
        .map((option) => ({
          price: option.price,
          weight: +option.weight,
        }))
        .reduce(
          (value, cur) => {
            if (+cur.weight === 0) {
              value[2] = true;
            }
            if (value[0] === 0 || value[0] > +cur.price / (+cur.weight || 1)) {
              value[0] = +cur.price / (+cur.weight || 1);
            }
            if (value[1] === 0 || value[1] < +cur.price / (+cur.weight || 1)) {
              value[1] = +cur.price / (+cur.weight || 1);
            }
            return value;
          },
          [0, 0, false],
        )
        .map(
          (v, i, arr) =>
            i < 2 &&
            (arr[2]
              ? `${territory.currency.icon}${(+v).toFixed(2)}`
              : `${territory.currency.icon}${(+v).toFixed(2)}`),
        )
        .filter((v, i, s) => s.indexOf(v) === i && i < 2)
        .join(' ~ ')
    : `${territory.currency.icon}${(+product.price).toFixed(2)}`;

  if (style === 'category-item') {
    return (
      <>
        <View style={[styles.containerCategoryItem]}>
          <View style={styles.productInfoCategoryItem}>
            <AppText
              style={[styles.productName, styles.productNameCategoryItem]}
              numberOfLines={1}>
              {product.name}
            </AppText>
            {product.long_description ? (
              <AppText
                style={[styles.price, styles.priceCategoryItem]}
                numberOfLines={1}>
                {renderHTML(product.long_description)}
              </AppText>
            ) : <></>}
            <AppText
              style={[
                styles.price,
                styles.priceCategoryItem,
                { color: '#000' },
              ]}
              numberOfLines={1}>
              {productPrice}
            </AppText>
          </View>
          {product.image != "" ? (
            <View style={[styles.imageWrapperCategoryItem]}>
              <Image
                source={{ uri: product.image }}
                style={styles.image}
                resizeMode="cover"
                PlaceholderContent={<ActivityIndicator />}
              />
            </View>
          ) : <></>}
        </View>
        <DashedLine />
      </>
    );
  } else {
    return (
      <View style={styles.container}>
        <View style={styles.imageWrapper}>
          <Image
            source={{ uri: product.image }}
            style={styles.image}
            resizeMode="cover"
            PlaceholderContent={<ActivityIndicator />}
          />
          {product.on_sale == '1' ?
            <Image
            source={require('~/assets/images/sale.png')}
            style={styles.image_sale}
            resizeMode="cover"
            PlaceholderContent={<ActivityIndicator />}
          />:<></>}            
        </View>
        <AppText style={styles.productName} numberOfLines={1}>
          {product.name}
        </AppText>
        <AppText style={[styles.price, { color: '#000' }]} numberOfLines={1}>
          {productPrice}
        </AppText>
      </View>
    );
  }
};
const styles = StyleSheet.create({
  container: {
    width: '100%',
  },

  imageWrapper: {
    width: '100%',
    aspectRatio: 1,
  },

  image: {
    flex: 1,
    aspectRatio: 1,
  },

  productName: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
    paddingHorizontal: -5,
  },

  price: {
    color: '#6f6f6e',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 5,
  },

  image_sale: {   
    position: 'absolute',
    top: 0,
    right: 0,
    width: 50,
    height: 50
  },

  containerCategoryItem: {
    flexDirection: 'row',

    paddingHorizontal: 11,
    paddingVertical: 11,
  },

  productInfoCategoryItem: {
    flex: 4,
  },

  imageWrapperCategoryItem: {
    aspectRatio: 1,
    flex: 1,
  },

  productNameCategoryItem: {
    textAlign: 'left',
    paddingRight: 20,
  },

  priceCategoryItem: {
    textAlign: 'left',
    paddingRight: 20,
  },
});
