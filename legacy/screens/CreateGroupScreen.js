import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from 'react-native-vector-icons';
import { useGroups, useMyGroups } from '../hooks/useGroups';

const CreateGroupScreen = ({ navigation }) => {
  const [groupName, setGroupName] = useState('');
  const [description, setDescription] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { createGroup } = useGroups();
  const { refresh: refreshMyGroups } = useMyGroups();

  const handleCreateGroup = async () => {
    if (!groupName.trim()) {
      Alert.alert('Erreur', 'Le nom du groupe est requis');
      return;
    }

    try {
      setLoading(true);
      const groupData = {
        name: groupName.trim(),
        description: description.trim(),
        isPrivate,
      };
      
      await createGroup(groupData);
      // Rafraîchir la liste des groupes de l'utilisateur
      await refreshMyGroups();
      Alert.alert('Succès', 'Groupe créé avec succès!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      Alert.alert('Erreur', error.message || 'Erreur lors de la création du groupe');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.flex} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Créer un groupe</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Nom du groupe */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Nom du groupe *</Text>
            <TextInput
              style={styles.input}
              value={groupName}
              onChangeText={setGroupName}
              placeholder="Entrez le nom du groupe"
              placeholderTextColor="#999"
              maxLength={50}
            />
            <Text style={styles.charCount}>{groupName.length}/50</Text>
          </View>

          {/* Description */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Décrivez votre groupe (optionnel)"
              placeholderTextColor="#999"
              multiline
              numberOfLines={4}
              maxLength={200}
            />
            <Text style={styles.charCount}>{description.length}/200</Text>
          </View>

          {/* Type de groupe */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Type de groupe</Text>
            
            <TouchableOpacity 
              style={[styles.optionButton, !isPrivate && styles.optionButtonActive]}
              onPress={() => setIsPrivate(false)}
            >
              <View style={styles.optionContent}>
                <Ionicons 
                  name={!isPrivate ? "radio-button-on" : "radio-button-off"} 
                  size={20} 
                  color={!isPrivate ? "#007AFF" : "#999"} 
                />
                <View style={styles.optionText}>
                  <Text style={[styles.optionTitle, !isPrivate && styles.optionTitleActive]}>
                    Public
                  </Text>
                  <Text style={styles.optionDescription}>
                    Tout le monde peut voir et rejoindre ce groupe
                  </Text>
                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.optionButton, isPrivate && styles.optionButtonActive]}
              onPress={() => setIsPrivate(true)}
            >
              <View style={styles.optionContent}>
                <Ionicons 
                  name={isPrivate ? "radio-button-on" : "radio-button-off"} 
                  size={20} 
                  color={isPrivate ? "#007AFF" : "#999"} 
                />
                <View style={styles.optionText}>
                  <Text style={[styles.optionTitle, isPrivate && styles.optionTitleActive]}>
                    Privé
                  </Text>
                  <Text style={styles.optionDescription}>
                    Seuls les membres invités peuvent rejoindre
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Bouton de création */}
        <View style={styles.footer}>
          <TouchableOpacity 
            style={[styles.createButton, (!groupName.trim() || loading) && styles.createButtonDisabled]}
            onPress={handleCreateGroup}
            disabled={!groupName.trim() || loading}
          >
            {loading ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <Text style={styles.createButtonText}>Créer le groupe</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  flex: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  inputContainer: {
    marginTop: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#F8F9FA',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  charCount: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
    marginTop: 4,
  },
  optionButton: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    backgroundColor: '#F8F9FA',
  },
  optionButtonActive: {
    borderColor: '#007AFF',
    backgroundColor: '#F0F8FF',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  optionText: {
    flex: 1,
    marginLeft: 12,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  optionTitleActive: {
    color: '#007AFF',
  },
  optionDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  createButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  createButtonDisabled: {
    backgroundColor: '#CCC',
  },
  createButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CreateGroupScreen;