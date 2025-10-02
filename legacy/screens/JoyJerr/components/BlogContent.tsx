
import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Modal,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface BlogPost {
  id: number;
  title: string;
  date: string;
  excerpt: string;
  image: string;
  author: string;
  comments: number;
  link: string;
  likes: number;
}

const BlogCard = ({ post }: { post: BlogPost }) => {
  const [liked, setLiked] = useState(false);

  return (
    <View style={styles.card}>
      {/* Image */}
      <TouchableOpacity onPress={() => console.log('Open post', post.link)}>
        <Image source={{ uri: post.image }} style={styles.image} />
      </TouchableOpacity>

      {/* Content */}
      <View style={styles.cardContent}>
        {/* Title */}
        <Text style={styles.title}>{post.title}</Text>

        {/* Date */}
        <Text style={styles.date}>{post.date}</Text>

        {/* Excerpt */}
        <Text style={styles.excerpt} numberOfLines={3}>
          {post.excerpt}
        </Text>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.author}>By {post.author}</Text>
          <View style={styles.stats}>
            <TouchableOpacity 
              style={styles.statButton}
              onPress={() => setLiked(!liked)}
            >
              <Ionicons 
                name={liked ? "heart" : "heart-outline"} 
                size={16} 
                color={liked ? "#ff6b6b" : "#666"} 
              />
              <Text style={styles.statText}>{post.likes + (liked ? 1 : 0)}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.statButton}>
              <Ionicons name="chatbubble-outline" size={16} color="#666" />
              <Text style={styles.statText}>{post.comments}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const BlogContent: React.FC = () => {
  const [sortOrder, setSortOrder] = useState("desc");
  const [loading, setLoading] = useState(false);
  const [showSortModal, setShowSortModal] = useState(false);

  const allPosts: BlogPost[] = [
    {
      id: 1,
      title: 'Focusing on the Photography Community',
      date: 'June 16, 2021',
      excerpt: 'Whether you develop your own film or use your iPhone, photography is for everyone. This community brings together photographers of all skill levels...',
      image: 'https://demo.peepso.com/wp-content/uploads/2021/06/photography.png',
      author: 'Sylvia Isley',
      comments: 12,
      likes: 24,
      link: 'https://demo.peepso.com/2021/06/16/focusing-on-the-photography-community/',
    },
    {
      id: 2,
      title: 'Empowering Brand Ambassadors in Fashion',
      date: 'June 11, 2021',
      excerpt: 'Brand ambassadors are a great way to approach fashion marketing. Learn how to build meaningful connections with your audience...',
      image: 'https://demo.peepso.com/wp-content/uploads/2021/06/fashion.png',
      author: 'Alexia Torman',
      comments: 8,
      likes: 42,
      link: 'https://demo.peepso.com/2021/06/11/empowering-brand-ambassadors-in-an-online-community-for-fashion/',
    },
    {
      id: 3,
      title: 'Building Community Through Technology',
      date: 'June 8, 2021',
      excerpt: 'Technology has revolutionized how we connect and share experiences. Discover the latest trends in community building...',
      image: 'https://demo.peepso.com/wp-content/uploads/2021/06/technology.png',
      author: 'Ashley Smith',
      comments: 15,
      likes: 31,
      link: 'https://demo.peepso.com/2021/06/08/building-community-through-technology/',
    },
    {
      id: 4,
      title: 'The Future of Digital Content Creation',
      date: 'June 5, 2021',
      excerpt: 'Content creation is evolving rapidly. From video to interactive media, explore what the future holds for creators...',
      image: 'https://demo.peepso.com/wp-content/uploads/2021/06/content.png',
      author: 'John Doe',
      comments: 6,
      likes: 18,
      link: 'https://demo.peepso.com/2021/06/05/the-future-of-digital-content-creation/',
    },
  ];

  // Sort posts based on selected order
  const posts = [...allPosts].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    if (sortOrder === "desc") {
      return dateB.getTime() - dateA.getTime(); // Newest first
    } else {
      return dateA.getTime() - dateB.getTime(); // Oldest first
    }
  });

  return (
    <ScrollView style={styles.container}>
      {/* Sort Filter */}
      <View style={styles.filterContainer}>
        <Text style={styles.filterLabel}>Sort by:</Text>
        <TouchableOpacity
          style={styles.pickerButton}
          onPress={() => setShowSortModal(true)}
        >
          <Text style={styles.pickerButtonText}>
            {sortOrder === "desc" ? "Newest first" : "Oldest first"}
          </Text>
          <Ionicons name="chevron-down" size={20} color="#666" />
        </TouchableOpacity>
      </View>

      {/* No Posts Message */}
      {posts.length === 0 && !loading && (
        <View style={styles.noPosts}>
          <Text style={styles.noPostsText}>No blog posts yet</Text>
        </View>
      )}

      {/* Loading Indicator */}
      {loading && (
        <ActivityIndicator size="large" color="#007AFF" style={styles.loadingIndicator} />
      )}

      {/* Create Post Button */}
      <View style={styles.createPost}>
        <TouchableOpacity style={styles.createPostButton}>
          <Ionicons name="add" size={20} color="#007AFF" />
          <Text style={styles.createPostText}>Write a new blog post</Text>
        </TouchableOpacity>
      </View>

      {/* Blog Posts List */}
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <BlogCard post={item} />}
        contentContainerStyle={styles.listContent}
        scrollEnabled={false}
      />

      {/* Sort Modal */}
      <Modal
        visible={showSortModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowSortModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Sort by</Text>
              <TouchableOpacity
                style={styles.modalCloseIcon}
                onPress={() => setShowSortModal(false)}
              >
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity
              style={[
                styles.optionItem,
                sortOrder === "desc" && styles.selectedOption,
              ]}
              onPress={() => {
                setSortOrder("desc");
                setShowSortModal(false);
              }}
            >
              <Text
                style={[
                  styles.optionText,
                  sortOrder === "desc" && styles.selectedOptionText,
                ]}
              >
                Newest first
              </Text>
              {sortOrder === "desc" && (
                <Ionicons name="checkmark" size={20} color="#007AFF" />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.optionItem,
                sortOrder === "asc" && styles.selectedOption,
              ]}
              onPress={() => {
                setSortOrder("asc");
                setShowSortModal(false);
              }}
            >
              <Text
                style={[
                  styles.optionText,
                  sortOrder === "asc" && styles.selectedOptionText,
                ]}
              >
                Oldest first
              </Text>
              {sortOrder === "asc" && (
                <Ionicons name="checkmark" size={20} color="#007AFF" />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  pickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  pickerButtonText: {
    fontSize: 14,
    color: '#495057',
    marginRight: 8,
  },
  noPosts: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  noPostsText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  loadingIndicator: {
    marginVertical: 40,
  },
  createPost: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  createPostButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  createPostText: {
    fontSize: 16,
    color: '#007AFF',
    marginLeft: 8,
    fontWeight: '500',
  },
  listContent: {
    paddingBottom: 20,
  },
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  cardContent: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    color: '#777',
    marginBottom: 8,
  },
  excerpt: {
    fontSize: 15,
    color: '#444',
    lineHeight: 22,
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  author: {
    fontSize: 14,
    fontWeight: '500',
    color: '#555',
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 16,
  },
  statText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    width: '80%',
    maxWidth: 300,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    textAlign: 'center',
  },
  modalCloseIcon: {
    padding: 4,
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 4,
  },
  selectedOption: {
    backgroundColor: '#f0f8ff',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  selectedOptionText: {
    color: '#007AFF',
    fontWeight: '500',
  },
});

export default BlogContent;
