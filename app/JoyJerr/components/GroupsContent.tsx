
import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView
} from 'react-native';

const groupsData = [
  {
    id: '360',
    name: 'Sports Today',
    description: 'Come to discuss all sports topics',
    members: 18,
    coverImage:
      'https://demo.peepso.com/wp-content/peepso/groups/360/1cd6086321-cover.jpg',
    avatar:
      'https://demo.peepso.com/wp-content/peepso/groups/360/f375622cda-avatar-full.jpg',
    privacy: 'Open',
  },
  {
    id: '303',
    name: 'Everyone loves Andrea',
    description: 'Our Lovely Andrea',
    members: 15,
    coverImage:
      'https://demo.peepso.com/wp-content/peepso/groups/303/be1ba8c7ed-cover.jpg',
    avatar:
      'https://demo.peepso.com/wp-content/peepso/groups/303/c7d1a0bb74-avatar-full.jpg',
    privacy: 'Open',
  },
  {
    id: '259',
    name: 'Classic Cars',
    description: 'Classic and Exotic cars',
    members: 19,
    coverImage:
      'https://demo.peepso.com/wp-content/peepso/groups/259/f2f3c2f019-cover.jpg',
    avatar:
      'https://demo.peepso.com/wp-content/peepso/groups/259/4384c99a8d-avatar-full.jpg',
    privacy: 'Open',
  },
  {
    id: '208',
    name: 'Exit Festival',
    description:
      'Exit is a summer music festival held at the Petrovaradin Fortress in Novi Sad, Serbia.',
    members: 23,
    coverImage:
      'https://demo.peepso.com/wp-content/peepso/groups/208/0023718d5c-cover.jpg',
    avatar:
      'https://demo.peepso.com/wp-content/peepso/groups/208/39d80494eb-avatar-full.jpg',
    privacy: 'Open',
  },
];

const GroupCard = ({ group }) => (
  <TouchableOpacity style={styles.card}>
    <Image source={{ uri: group.coverImage }} style={styles.coverImage} />
    <View style={styles.avatarContainer}>
      <Image source={{ uri: group.avatar }} style={styles.avatar} />
    </View>
    <View style={styles.infoContainer}>
      <Text style={styles.name}>{group.name}</Text>
      <Text style={styles.description}>{group.description}</Text>
      <Text style={styles.members}>{group.members} members</Text>
      <Text style={styles.privacy}>{group.privacy}</Text>
    </View>
  </TouchableOpacity>
);

const GroupsContent = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Groups</Text>
      <FlatList
        data={groupsData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <GroupCard group={item} />}
        contentContainerStyle={styles.list}
        scrollEnabled={false}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: '700',
    marginVertical: 10,
  },
  list: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    marginBottom: 20,
    overflow: 'hidden',
    elevation: 3,
  },
  coverImage: {
    width: '100%',
    height: 150,
  },
  avatarContainer: {
    position: 'absolute',
    top: 120,
    left: 20,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#fff',
    overflow: 'hidden',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  infoContainer: {
    padding: 15,
    marginTop: 20,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
  },
  description: {
    fontSize: 14,
    color: '#555',
    marginVertical: 5,
  },
  members: {
    fontSize: 14,
    fontWeight: '500',
  },
  privacy: {
    fontSize: 12,
    color: '#888',
    marginTop: 3,
  },
});

export default GroupsContent;
