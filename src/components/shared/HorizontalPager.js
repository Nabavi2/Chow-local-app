import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';

import ViewPager from '@react-native-community/viewpager';

export const HorizontalPager = ({
  data,
  renderItem,
  numOfColumns = 4,
  numOfRows = 1,
}) => {
  const dataInPages = useMemo(() => {
    const numOfPage = numOfColumns * numOfRows;

    return data.reduce((acc, curr, i) => {
      if (!(i % numOfPage)) {
        // if index is 0 or can be divided by the `size`...
        const itemsInPage = data.slice(i, i + numOfPage);
        acc.push(
          itemsInPage.reduce((acc1, curr1, j) => {
            if (!(j % numOfColumns)) {
              // if index is 0 or can be divided by the `size`...
              acc1.push(itemsInPage.slice(j, j + numOfColumns)); // ..push a chunk of the original array to the accumulator
            }
            return acc1;
          }, []),
        ); // ..push a chunk of the original array to the accumulator
      }
      return acc;
    }, []);
  }, [data, numOfColumns, numOfRows]);

  return (
    <ViewPager
      style={[styles.viewPager]}
      orientation="horizontal"
      transitionStyle="scroll">
      {dataInPages.map((page, pageIndex) => (
        <View style={styles.page} key={pageIndex}>
          {page.map((row, rowIndex) => (
            <View style={styles.row} key={rowIndex}>
              {row.map((item, index) => (
                <View
                  style={[styles.item, { width: `${100 / numOfColumns}%` }]}
                  key={index}>
                  {renderItem(item)}
                </View>
              ))}
            </View>
          ))}
        </View>
      ))}
    </ViewPager>
  );
};

const styles = StyleSheet.create({
  viewPager: {
    flex: 1,
  },

  page: {},

  row: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
  },

  item: {},
});
