import { useState, useEffect, useCallback } from 'react';
import apiService from '../services/api';

const useStories = (type = 'feed', autoRefresh = true) => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStories = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) {
        setLoading(true);
      }
      setError(null);

      const response = await apiService.getStatuses(type, 1, 50);
      
      if (response.success) {
        // Transformer les données pour correspondre au format attendu par l'UI
        const transformedStories = response.data.map(status => ({
          id: status._id,
          user: {
            id: status.author._id,
            name: `${status.author.firstName} ${status.author.lastName}`,
            avatar: status.author.avatar || null
          },
          image: status.media?.url || null,
          hasStory: true, // Toujours true car c'est un status actif
          timestamp: status.createdAt,
          content: status.content,
          media: status.media,
          privacy: status.privacy,
          reactions: status.reactions || [],
          comments: status.comments || [],
          viewers: status.viewers || []
        }));
        
        setStories(transformedStories);
      } else {
        setError('Erreur lors de la récupération des stories');
      }
    } catch (err) {
      console.error('Erreur useStories:', err);
      setError(err.message || 'Erreur lors de la récupération des stories');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [type]);

  const refreshStories = useCallback(async () => {
    setRefreshing(true);
    await fetchStories(false);
  }, [fetchStories]);

  const markStoryAsViewed = useCallback(async (storyId) => {
    try {
      await apiService.markStatusAsViewed(storyId);
      // Optionnel: mettre à jour l'état local pour refléter que l'histoire a été vue
      setStories(prevStories => 
        prevStories.map(story => 
          story.id === storyId 
            ? { ...story, viewed: true }
            : story
        )
      );
    } catch (err) {
      console.error('Erreur lors du marquage comme vu:', err);
    }
  }, []);

  useEffect(() => {
    if (autoRefresh) {
      fetchStories();
    }
  }, [fetchStories, autoRefresh]);

  return {
    stories,
    loading,
    error,
    refreshing,
    fetchStories,
    refreshStories,
    markStoryAsViewed
  };
};

export { useStories };
export default useStories;