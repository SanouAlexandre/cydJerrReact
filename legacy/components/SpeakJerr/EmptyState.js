import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const EmptyState = ({ 
  icon = 'information-circle-outline',
  title = 'Aucun élément',
  message = 'Il n\'y a rien à afficher pour le moment.',
  actionText,
  onAction,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.content}>
        {/* Icône */}
        <View style={styles.iconContainer}>
          <Ionicons name={icon} size={64} color="#C7C7CC" />
        </View>
        
        {/* Titre */}
        <Text style={styles.title}>{title}</Text>
        
        {/* Message */}
        <Text style={styles.message}>{message}</Text>
        
        {/* Bouton d'action */}
        {actionText && onAction && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={onAction}
            activeOpacity={0.7}
          >
            <Text style={styles.actionButtonText}>{actionText}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 64,
  },
  content: {
    alignItems: 'center',
    maxWidth: 300,
  },
  iconContainer: {
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1C1C1E',
    textAlign: 'center',
    marginBottom: 12,
  },
  message: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  actionButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 120,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
  },
});

export default EmptyState;