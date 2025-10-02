import React from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useDispatch, useSelector } from "react-redux";
import { setSearchQuery, setSearchActive } from "../redux/searchSlice";

const SearchBar = () => {
  const dispatch = useDispatch();
  const { searchQuery, isSearchActive } = useSelector((state) => state.search);

  const handleSearchChange = (text) => {
    dispatch(setSearchQuery(text));
  };

  const handleSearchFocus = () => {
    dispatch(setSearchActive(true));
  };

  const handleSearchBlur = () => {
    if (!searchQuery) {
      dispatch(setSearchActive(false));
    }
  };

  const clearSearch = () => {
    dispatch(setSearchQuery(""));
    dispatch(setSearchActive(false));
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <MaterialCommunityIcons
          name="magnify"
          size={20}
          color="rgba(255, 255, 255, 0.7)"
          style={styles.searchIcon}
        />

        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher dans CydJerr Nation..."
          placeholderTextColor="rgba(255, 255, 255, 0.6)"
          value={searchQuery}
          onChangeText={handleSearchChange}
          onFocus={handleSearchFocus}
          onBlur={handleSearchBlur}
          returnKeyType="search"
        />

        {searchQuery ? (
          <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
            <MaterialCommunityIcons
              name="close-circle"
              size={18}
              color="rgba(255, 255, 255, 0.7)"
            />
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: Platform.OS === "android" ? 8 : 15, // Réduit le padding sur Android
    alignItems: "center",
    marginVertical: Platform.OS === "android" ? 64 : 11, // Réduit le padding sur Android
  },
  searchContainer: {
    width: 231,
    height: 45,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 15,
    shadowColor: "rgba(0, 0, 0, 0.1)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    // Effet glassmorphism simulé
    backdropFilter: "blur(10px)",
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.9)",
    fontWeight: "400",
  },
  clearButton: {
    padding: 2,
    marginLeft: 8,
  },
});

export default SearchBar;
