
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { JoyJerrStackParamList } from "../../../../src/navigation/types";

interface NavigationMenuProps {
  visible: boolean;
  onClose: () => void;
}

const NavigationMenu: React.FC<NavigationMenuProps> = ({ visible, onClose }) => {
  const navigation = useNavigation<NativeStackNavigationProp<JoyJerrStackParamList>>();

  const menuItems = [
    {
      id: 'community',
      title: 'Community',
      icon: 'people' as const,
      route: 'JoyJerrCommunity'
    },
    {
      id: 'profile',
      title: 'Profile',
      icon: 'person' as const,
      route: 'JoyJerrProfile'
    },
    {
      id: 'members',
      title: 'Members',
      icon: 'people-circle' as const,
      route: 'JoyJerrMembers'
    },
    {
      id: 'pages',
      title: 'Pages',
      icon: 'document' as const,
      route: 'JoyJerrPages'
    },
    {
      id: 'groups',
      title: 'Groups',
      icon: 'people-outline' as const,
      route: 'JoyJerrGroups'
    },
    {
      id: 'blog',
      title: 'Blog',
      icon: 'book' as const,
      route: 'JoyJerrBlog'
    },
  ];

  const handleNavigate = (route: string) => {
    onClose();
    navigation.navigate(route as keyof JoyJerrStackParamList);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.menuContainer}>
          {/* Menu Header */}
          <View style={styles.menuHeader}>
            <Text style={styles.menuTitle}>Navigation</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
            >
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          {/* Menu Items */}
          <View style={styles.menuContent}>
            {menuItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.menuItem}
                onPress={() => handleNavigate(item.route)}
              >
                <View style={styles.menuItemContent}>
                  <Ionicons 
                    name={item.icon} 
                    size={24} 
                    color="#007bff" 
                    style={styles.menuItemIcon}
                  />
                  <Text style={styles.menuItemText}>{item.title}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#666" />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  menuContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 40,
    minHeight: '50%',
  },
  menuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  menuTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 4,
  },
  menuContent: {
    padding: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 12,
    marginBottom: 8,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuItemIcon: {
    marginRight: 16,
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
});

export default NavigationMenu;
