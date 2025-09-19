
import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from 'react-native-vector-icons';

const PagesHeader = ({ onSearch, onFilterToggle, onCreatePage }) => {
  const [query, setQuery] = useState('');

  const handleSearch = (text) => {
    setQuery(text);
    if (onSearch) onSearch(text);
  };

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#999" style={styles.iconLeft} />
        <TextInput
          style={styles.input}
          placeholder="Search..."
          value={query}
          onChangeText={handleSearch}
          placeholderTextColor="#aaa"
        />
        <TouchableOpacity onPress={onFilterToggle}>
          <Ionicons name="settings-outline" size={20} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Create Button */}
      <TouchableOpacity style={styles.createButton} onPress={onCreatePage}>
        <Ionicons name="add" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 10,
    flex: 1,
    marginRight: 10,
  },
  iconLeft: {
    marginRight: 5,
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: '#333',
  },
  createButton: {
    backgroundColor: '#007AFF',
    padding: 8,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default PagesHeader;
