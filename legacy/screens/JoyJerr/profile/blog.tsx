import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import NavigationMenu from "../components/NavigationMenu";
import BlogContent from "../components/BlogContent";

const BlogScreen: React.FC = () => {
  const [showNavigationMenu, setShowNavigationMenu] = useState<boolean>(false);

  return (
    <View style={styles.container}>
      <BlogContent />

      <NavigationMenu
        visible={showNavigationMenu}
        onClose={() => setShowNavigationMenu(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
});

export default BlogScreen;