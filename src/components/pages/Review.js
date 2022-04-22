import React from 'react';
import { Image, View, StyleSheet, ActivityIndicator } from 'react-native';
import { Rating, AirbnbRating } from 'react-native-ratings';
import { AppText } from '~/components';


export const Review = ({ review }) => (
  <View style={styles.wrapper}>
    <AppText style={styles.reviewText} numberOfLines={3}>
      {review.review_text}
    </AppText>
    <View style={styles.imageWrapper}>
      <Image
        source={{
          uri:
            review.profile_pic ||
            'https://via.placeholder.com/450?text=Image%20is%20not%20available',
        }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.ratingContainer}>
        <AppText style={styles.username} numberOfLines={1}>
        {review.full_name}
        </AppText>
        <View style={styles.rating}>
          <Rating
              type='star'
              ratingCount={5}
              imageSize={17}
              readonly={true}
              style={styles.ratingStyle}
              startingValue={review.rating}
              fractions = {1}
            />
          <AppText style={styles.timeAgo} numberOfLines={1}>
            {review.time_ago}
          </AppText>
        </View>
      </View>
    </View>   
  </View>
);

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#fff',
    borderRadius: 10,
    width: '100%',
    marginTop: 7,
  },

  imageWrapper: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 10,
    flexDirection:'row'
  },

  image: {
    aspectRatio: 1,
    borderRadius: 100,
    width: 50,    
    borderWidth: 1,
    borderColor: '#CCC',
  },

  ratingContainer: {
    flexDirection:'column'
  },

  rating: {
    flexDirection: 'row',
    marginTop: 3,
    marginLeft: 10 
  },

  reviewText: {
    textAlign: 'left',
    fontSize: 16,
    color: 'grey',    
    marginTop: 0,
    paddingHorizontal: 20,
  },

  username: {
    textAlign: 'left',
    fontSize: 16,
    color: 'black',
    fontWeight:'bold',
    marginTop: 2,
    paddingHorizontal: 10,
  },

  timeAgo: {
    textAlign: 'center',
    fontSize: 11,
    color: 'grey',
    marginTop: 1,
    paddingLeft: 7,
    
  },  
});
