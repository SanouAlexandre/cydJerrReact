import React from "react";
import {
  View,
  Text,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { selectUser } from "../redux/userSlice";

const ChabJerrScreenTest = () => {
  const navigation = useNavigation();
  const user = useSelector(selectUser);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Test Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  text: {
    color: '#FFFFFF',
    fontSize: 18,
  },
});

export default ChabJerrScreenTest;