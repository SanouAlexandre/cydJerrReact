import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Dimensions,
  TextInput,
  ScrollView,
  Modal,
} from "react-native";
import { usePosts } from "../../../legacy/hooks/usePosts";
import { Ionicons, MaterialIcons, AntDesign } from "react-native-vector-icons";

const { width } = Dimensions.get("window");
const imgSize = width / 3 - 8;

interface PostHeaderProps {
  avatar: string;
  author: string;
  time: string;
  privacy: "Public" | "Friends Only" | "Site Members" | "Only Me";
  subtitle?: string;
  onShowDatePicker: () => void;
}

interface MediaItem {
  url: string;
  type: "photo" | "video" | "image";
  thumbnail?: string;
  duration?: number;
}

interface PostBodyProps {
  text: string;
  hashtags: string[];
  photos: string[];
  media?: MediaItem[];
}

interface Comment {
  id: string;
  author: {
    name: string;
    avatar: string;
  };
  content: string;
  time: string;
  likes: number;
  isLiked: boolean;
}

interface PostFooterProps {
  avatar: string;
  reactions: {
    love: number;
    like: number;
    haha: number;
    wow: number;
    sad: number;
    angry: number;
  };
  totalReactions: number;
  commentsCount: number;
  sharesCount: number;
  userReaction?: string;
  comments: Comment[];
  onReaction: (type: string) => void;
  onComment: (comment: string) => void;
  onCommentLike: (commentId: string) => void;
}

const PostHeader: React.FC<PostHeaderProps> = ({
  avatar,
  author,
  time,
  privacy,
  subtitle,
  onShowDatePicker,
}) => {
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);

  return (
    <View style={styles.header}>
      <Image source={{ uri: avatar }} style={styles.avatar} />
      <View style={{ flex: 1 }}>
        <Text style={styles.author}>
          {author}{" "}
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </Text>
        <View style={styles.metaRow}>
          <Text style={styles.time}>{time}</Text>
          <Ionicons
            name={
              privacy === "Public"
                ? "earth"
                : privacy === "Friends Only"
                  ? "people"
                  : privacy === "Site Members"
                    ? "person"
                    : "lock-closed"
            }
            size={14}
            color="#777"
            style={{ marginLeft: 6 }}
          />
          <Text style={styles.privacy}>{privacy}</Text>
        </View>
      </View>
      <TouchableOpacity onPress={() => setShowOptionsMenu(!showOptionsMenu)}>
        <MaterialIcons name="more-horiz" size={22} color="#555" />
      </TouchableOpacity>
    </View>
  );
};

const PostBody: React.FC<PostBodyProps> = ({
  text,
  hashtags,
  photos,
  media = [],
}) => {
  const [imageErrors, setImageErrors] = useState<{ [key: string]: boolean }>(
    {},
  );

  const handleImageError = (uri: string) => {
    setImageErrors((prev) => ({ ...prev, [uri]: true }));
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const allMedia = [
    ...photos.map((photo) => ({ url: photo, type: "photo" as const })),
    ...media.filter(
      (item) =>
        item.type === "photo" || item.type === "image" || item.type === "video",
    ),
  ];

  return (
    <View style={styles.bodyContainer}>
      <Text style={styles.bodyText}>{text}</Text>
      <View style={styles.hashtags}>
        {hashtags.map((tag, idx) => (
          <Text key={idx} style={styles.hashtag}>
            #{tag}
          </Text>
        ))}
      </View>
      {allMedia.length > 0 && (
        <FlatList
          data={allMedia.slice(0, 6)}
          numColumns={3}
          keyExtractor={(item, index) => `${item.url}-${index}`}
          renderItem={({ item, index }) => (
            <TouchableOpacity style={styles.imageWrapper}>
              {item.type === "video" ? (
                <View style={styles.videoContainer}>
                  <Image
                    source={{ uri: item.thumbnail || item.url }}
                    style={styles.image}
                    onError={() => handleImageError(item.url)}
                  />
                  {!imageErrors[item.url] && (
                    <>
                      <View style={styles.videoOverlay}>
                        <View style={styles.playButton}>
                          <Ionicons name="play" size={20} color="#fff" />
                        </View>
                      </View>
                      {item.duration && (
                        <View style={styles.durationBadge}>
                          <Text style={styles.durationText}>
                            {formatDuration(item.duration)}
                          </Text>
                        </View>
                      )}
                    </>
                  )}
                  {imageErrors[item.url] && (
                    <View style={[styles.image, styles.errorContainer]}>
                      <Ionicons
                        name="videocam-outline"
                        size={30}
                        color="#666"
                      />
                      <Text style={styles.errorText}>Vidéo non disponible</Text>
                    </View>
                  )}
                </View>
              ) : (
                <View>
                  <Image
                    source={{ uri: item.url }}
                    style={styles.image}
                    onError={() => handleImageError(item.url)}
                  />
                  {imageErrors[item.url] && (
                    <View style={[styles.image, styles.errorContainer]}>
                      <Ionicons name="image-outline" size={30} color="#666" />
                      <Text style={styles.errorText}>Image non disponible</Text>
                    </View>
                  )}
                </View>
              )}
              {index === 5 && allMedia.length > 6 && (
                <View style={styles.overlay}>
                  <Text style={styles.overlayText}>+{allMedia.length - 6}</Text>
                </View>
              )}
            </TouchableOpacity>
          )}
          scrollEnabled={false}
          style={styles.photosGrid}
        />
      )}
    </View>
  );
};

const PostFooter: React.FC<PostFooterProps> = ({
  avatar,
  reactions,
  totalReactions,
  commentsCount,
  sharesCount,
  userReaction,
  comments,
  onReaction,
  onComment,
  onCommentLike,
}) => {
  const [showReactions, setShowReactions] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");

  const reactionTypes = [
    { type: "love", emoji: "❤️", label: "Love" },
    { type: "like", emoji: "👍", label: "Like" },
    { type: "haha", emoji: "😂", label: "Haha" },
    { type: "wow", emoji: "😮", label: "Wow" },
    { type: "sad", emoji: "😢", label: "Sad" },
    { type: "angry", emoji: "😡", label: "Angry" },
  ];

  const handleSubmitComment = () => {
    if (commentText.trim()) {
      onComment(commentText.trim());
      setCommentText("");
    }
  };

  return (
    <View style={styles.footerContainer}>
      {totalReactions > 0 && (
        <View style={styles.reactionsSummary}>
          <View style={styles.reactionEmojis}>
            {Object.entries(reactions).map(([type, count]) =>
              count > 0 ? (
                <Text key={type} style={styles.reactionEmoji}>
                  {reactionTypes.find((r) => r.type === type)?.emoji}
                </Text>
              ) : null,
            )}
          </View>
          <TouchableOpacity>
            <Text style={styles.reactionCount}>
              {totalReactions} {totalReactions === 1 ? "person" : "people"}
            </Text>
          </TouchableOpacity>
        </View>
      )}
      <View style={styles.actionsContainer}>
        {/* Old Like Button */}
        <TouchableOpacity
          style={styles.actionButton}
          onLongPress={() => setShowReactions(true)}
          onPress={() => onReaction(userReaction ? "none" : "like")}
        >
          <AntDesign
            name={userReaction ? "heart" : "hearto"}
            size={20}
            color={userReaction ? "#e91e63" : "#666"}
          />
          <Text
            style={[styles.actionText, userReaction && styles.actionTextActive]}
          >
            {userReaction ? userReaction : "Like"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => setShowComments(!showComments)}
        >
          <Ionicons name="chatbubble-outline" size={20} color="#666" />
          <Text style={styles.actionText}>Comment ({commentsCount})</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="share-outline" size={20} color="#666" />
          <Text style={styles.actionText}>Share ({sharesCount})</Text>
        </TouchableOpacity>
      </View>
      {showReactions && (
        <View style={styles.reactionsPopup}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {reactionTypes.map((reaction) => (
              <TouchableOpacity
                key={reaction.type}
                style={styles.reactionOption}
                onPress={() => {
                  onReaction(reaction.type);
                  setShowReactions(false);
                }}
              >
                <Text style={styles.reactionOptionEmoji}>{reaction.emoji}</Text>
                <Text style={styles.reactionOptionLabel}>{reaction.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <TouchableOpacity
            style={styles.closeReactions}
            onPress={() => setShowReactions(false)}
          >
            <Ionicons name="close" size={20} color="#666" />
          </TouchableOpacity>
        </View>
      )}
      {showComments && (
        <View style={styles.commentsSection}>
          <View style={styles.commentInputContainer}>
            <Image source={{ uri: avatar }} style={styles.avatar} />
            <TextInput
              style={styles.commentInput}
              placeholder="Write a comment..."
              value={commentText}
              onChangeText={setCommentText}
              multiline
            />
            <TouchableOpacity
              style={[
                styles.commentSubmit,
                !commentText.trim() && styles.commentSubmitDisabled,
              ]}
              onPress={handleSubmitComment}
              disabled={!commentText.trim()}
            >
              <Ionicons name="send" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
          {comments.map((comment) => (
            <View key={comment.id} style={styles.commentItem}>
              <Image
                source={{ uri: comment.author.avatar }}
                style={styles.commentAvatar}
              />
              <View style={styles.commentBody}>
                <View style={styles.commentBubble}>
                  <Text style={styles.commentAuthor}>
                    {comment.author.name}
                  </Text>
                  <Text style={styles.commentText}>{comment.content}</Text>
                </View>
                <View style={styles.commentActions}>
                  <Text style={styles.commentTime}>{comment.time}</Text>
                  <TouchableOpacity onPress={() => onCommentLike(comment.id)}>
                    <Text
                      style={[
                        styles.commentAction,
                        comment.isLiked && styles.commentActionActive,
                      ]}
                    >
                      Like ({comment.likes})
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity>
                    <Text style={styles.commentAction}>Reply</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const CommunityPosts: React.FC = () => {
  const [showDatePicker, setShowDatePicker] = useState(false);

  const {
    posts,
    loading,
    refreshing,
    error,
    hasMore,
    fetchPosts,
    loadMore,
    refresh,
    createPost,
    likePost,
    sharePost,
    deletePost,
    addComment,
    getPostComments,
  } = usePosts();

  const handleReaction = async (postId: string, reaction: string) => {
    try {
      await likePost(postId);
    } catch (error) {
      console.error("Error handling reaction:", error);
    }
  };

  const handleComment = async (postId: string, comment: string) => {
    try {
      await addComment(postId, comment);
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleCommentLike = async (postId: string, commentId: string) => {
    try {
      console.log("Like comment:", commentId, "on post:", postId);
    } catch (error) {
      console.error("Error liking comment:", error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {posts && posts.length > 0 ? (
        posts.map((post: any) => (
          <View key={post._id || post.id} style={styles.postContainer}>
            <PostHeader
              avatar={
                post.author?.avatar?.url ||
                post.author?.avatar ||
                "https://demo.peepso.com/wp-content/peepso/users/2/ec758423ef-avatar-full.jpg"
              }
              author={
                post.author?.firstName && post.author?.lastName
                  ? `${post.author.firstName} ${post.author.lastName}`
                  : post.author?.name || "Utilisateur inconnu"
              }
              time={new Date(
                post.publishedAt || post.createdAt,
              ).toLocaleString()}
              privacy={
                post.settings?.visibility === "public"
                  ? "Public"
                  : post.settings?.visibility === "friends"
                    ? "Friends Only"
                    : post.settings?.visibility === "private"
                      ? "Only Me"
                      : "Site Members"
              }
              subtitle=""
              onShowDatePicker={() => setShowDatePicker(true)}
            />

            <PostBody
              text={post.content || post.text || ""}
              hashtags={post.tags || post.hashtags || []}
              photos={(() => {
                let imageUrls = [];

                if (post.photos && Array.isArray(post.photos)) {
                  const photoUrls = post.photos
                    .map((p: any) => {
                      if (typeof p === "string") return p;
                      return p.url || p.uri || p.src || p.path || null;
                    })
                    .filter(Boolean);

                  imageUrls = [...imageUrls, ...photoUrls];
                }

                if (
                  imageUrls.length === 0 &&
                  post.images &&
                  Array.isArray(post.images)
                ) {
                  const imgUrls = post.images
                    .map((img: any) => {
                      if (typeof img === "string") return img;
                      return img.url || img.uri || img.src || img.path || null;
                    })
                    .filter(Boolean);

                  imageUrls = [...imageUrls, ...imgUrls];
                }

                return [...new Set(imageUrls)];
              })()}
              media={(() => {
                if (!post.media || !Array.isArray(post.media)) return [];

                return post.media
                  .filter(
                    (m: any) =>
                      m &&
                      (m.type === "photo" ||
                        m.type === "image" ||
                        m.type === "video" ||
                        m.mediaType === "image" ||
                        m.mediaType === "video" ||
                        (typeof m === "string" &&
                          (m.includes(".jpg") ||
                            m.includes(".png") ||
                            m.includes(".jpeg") ||
                            m.includes(".webp") ||
                            m.includes(".mp4") ||
                            m.includes(".mov") ||
                            m.includes(".avi")))),
                  )
                  .map((m: any) => {
                    if (typeof m === "string") {
                      const isVideo =
                        m.includes(".mp4") ||
                        m.includes(".mov") ||
                        m.includes(".avi");
                      return {
                        url: m,
                        type: isVideo ? "video" : "photo",
                        thumbnail: isVideo ? m : undefined,
                        duration: undefined,
                      };
                    }

                    return {
                      url: m.url || m.uri || m.src || m.path,
                      type: m.type || m.mediaType || "photo",
                      thumbnail:
                        m.thumbnail ||
                        m.thumb ||
                        (m.type === "video" ? m.url : undefined),
                      duration: m.duration,
                    };
                  })
                  .filter((m: any) => m.url);
              })()}
            />

            <PostFooter
              reactions={{
                love: 0,
                like: post.stats?.likes || post.likes || 0,
                haha: 0,
                wow: 0,
                sad: 0,
                angry: 0,
              }}
              totalReactions={post.stats?.likes || post.likes || 0}
              commentsCount={post.stats?.comments || post.comments || 0}
              sharesCount={post.stats?.shares || post.shares || 0}
              userReaction={post.userReaction || null}
              comments={post.commentsData || []}
              onReaction={(reaction) =>
                handleReaction(post._id || post.id, reaction)
              }
              onComment={(comment) =>
                handleComment(post._id || post.id, comment)
              }
              onCommentLike={(commentId) =>
                handleCommentLike(post._id || post.id, commentId)
              }
            />
          </View>
        ))
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>Aucun post disponible</Text>
        </View>
      )}
    </ScrollView>
  );
};

export default CommunityPosts;
export { PostHeader };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  postContainer: {
    backgroundColor: "#fff",
    marginBottom: 16,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    paddingBottom: 8,
    position: "relative",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  author: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#333",
  },
  subtitle: {
    fontSize: 14,
    color: "#555",
    fontWeight: "normal",
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  time: {
    fontSize: 12,
    color: "#777",
  },
  privacy: {
    fontSize: 12,
    color: "#777",
    marginLeft: 4,
  },
  bodyContainer: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  bodyText: {
    fontSize: 14,
    marginBottom: 8,
    color: "#333",
    lineHeight: 20,
  },
  hashtags: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 10,
  },
  hashtag: {
    color: "#1976d2",
    marginRight: 8,
    fontWeight: "500",
    fontSize: 14,
  },
  photosGrid: {
    marginTop: 8,
  },
  imageWrapper: {
    width: imgSize,
    height: imgSize,
    margin: 2,
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  overlayText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  videoContainer: {
    width: "100%",
    height: "100%",
    position: "relative",
  },
  videoOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
    borderRadius: 8,
  },
  playButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.9)",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  durationBadge: {
    position: "absolute",
    bottom: 4,
    right: 4,
    backgroundColor: "rgba(0,0,0,0.8)",
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
  },
  durationText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
  errorContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
  },
  errorText: {
    fontSize: 10,
    color: "#666",
    marginTop: 4,
    textAlign: "center",
  },
  footerContainer: {
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    paddingTop: 8,
  },
  reactionsSummary: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  reactionEmojis: {
    flexDirection: "row",
    marginRight: 8,
  },
  reactionEmoji: {
    fontSize: 16,
    marginLeft: -4,
  },
  reactionCount: {
    fontSize: 12,
    color: "#777",
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  actionText: {
    marginLeft: 6,
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  actionTextActive: {
    color: "#e91e63",
  },
  reactionsPopup: {
    position: "absolute",
    bottom: 60,
    left: 16,
    right: 16,
    backgroundColor: "#fff",
    borderRadius: 25,
    padding: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    flexDirection: "row",
    alignItems: "center",
    zIndex: 10000,
  },
  reactionOption: {
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  reactionOptionEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  reactionOptionLabel: {
    fontSize: 10,
    color: "#666",
  },
  closeReactions: {
    padding: 8,
    marginLeft: 8,
  },
  commentsSection: {
    backgroundColor: "#f9f9f9",
    paddingTop: 8,
  },
  commentInputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    padding: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  commentAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  commentInput: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    maxHeight: 100,
  },
  commentSubmit: {
    backgroundColor: "#1976d2",
    borderRadius: 20,
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  commentSubmitDisabled: {
    backgroundColor: "#ccc",
  },
  commentItem: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  commentBody: {
    flex: 1,
  },
  commentBubble: {
    backgroundColor: "#f0f0f0",
    borderRadius: 16,
    padding: 10,
    marginBottom: 4,
  },
  commentAuthor: {
    fontWeight: "bold",
    fontSize: 13,
    color: "#333",
    marginBottom: 2,
  },
  commentText: {
    fontSize: 14,
    color: "#333",
    lineHeight: 18,
  },
  commentActions: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 12,
  },
  commentTime: {
    fontSize: 12,
    color: "#777",
    marginRight: 16,
  },
  commentAction: {
    fontSize: 12,
    color: "#777",
    fontWeight: "500",
    marginRight: 16,
  },
  commentActionActive: {
    color: "#1976d2",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
});
