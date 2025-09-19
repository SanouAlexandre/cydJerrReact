import React from 'react';
import { View, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { setCurrentPage } from '../redux/navigationSlice';

const PaginationDots = () => {
  const dispatch = useDispatch();
  const { currentPage, totalPages } = useSelector((state) => state.navigation);

  const handleDotPress = (index) => {
    dispatch(setCurrentPage(index));
  };

  return (
    <View style={styles.container}>
      {Array.from({ length: totalPages }, (_, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.dot,
            currentPage === index && styles.activeDot,
          ]}
          onPress={() => handleDotPress(index)}
        >
          <View style={[
            styles.dotInner,
            currentPage === index && styles.activeDotInner,
          ]} />
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Platform.OS === 'android' ? 8 : 12, // Réduit sur Android pour optimiser l'espacement
    gap: 12,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  activeDot: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderColor: 'rgba(255, 255, 255, 0.6)',
    shadowColor: '#4ECDC4',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 8,
  },
  dotInner: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  activeDotInner: {
    backgroundColor: '#4ECDC4',
    shadowColor: '#4ECDC4',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 4,
  },
});

export default PaginationDots;