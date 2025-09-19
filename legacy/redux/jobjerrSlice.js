import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  composerText: '',
  maxLength: 2000,
  posts: [
    {
      id: 1,
      author: {
        name: 'Marie Dubois',
        title: 'Directrice Marketing Digital',
        avatar: '👩‍💼'
      },
      content: 'Excellente conférence sur l\'IA dans le marketing aujourd\'hui ! Les nouvelles stratégies d\'automatisation vont révolutionner notre approche client. #MarketingDigital #IA #Innovation',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2h ago
      counts: {
        like: 12,
        celebrate: 0,
        support: 0,
        insightful: 8,
        curious: 0,
        comments: 3,
        shares: 1
      },
      userReaction: null
    },
    {
      id: 2,
      author: {
        name: 'Thomas Martin',
        title: 'Développeur Full Stack',
        avatar: '👨‍💻'
      },
      content: 'Qui d\'autre est passionné par les nouvelles fonctionnalités de React Native ? J\'aimerais échanger sur les meilleures pratiques pour l\'optimisation des performances. #ReactNative #Développement',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4h ago
      counts: {
        like: 0,
        celebrate: 0,
        support: 0,
        insightful: 0,
        curious: 6,
        comments: 12,
        shares: 2
      },
      userReaction: null
    },
    {
      id: 3,
      author: {
        name: 'Sophie Laurent',
        title: 'Chef de Projet Agile',
        avatar: '👩‍🎓'
      },
      content: 'Retour d\'expérience sur notre transition vers une méthodologie 100% agile. Les résultats sont impressionnants : +40% de productivité et une meilleure satisfaction client ! 🚀',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6h ago
      counts: {
        like: 15,
        celebrate: 0,
        support: 0,
        insightful: 12,
        curious: 0,
        comments: 7,
        shares: 4
      },
      userReaction: null
    },
    {
      id: 4,
      author: {
        name: 'Alexandre Dupont',
        title: 'CEO & Fondateur',
        avatar: '👨‍💼'
      },
      content: 'Fier d\'annoncer que notre startup vient de lever 2M€ ! Merci à tous nos investisseurs et à l\'équipe formidable qui rend tout cela possible. L\'aventure ne fait que commencer ! 🎉 #Startup #Levée',
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), // 8h ago
      counts: {
        like: 45,
        celebrate: 23,
        support: 0,
        insightful: 0,
        curious: 0,
        comments: 18,
        shares: 12
      },
      userReaction: null
    },
    {
      id: 5,
      author: {
        name: 'Camille Rodriguez',
        title: 'UX/UI Designer Senior',
        avatar: '👩‍🎨'
      },
      content: 'Quelques réflexions sur l\'importance de l\'accessibilité dans le design. Créer des expériences inclusives n\'est pas une option, c\'est une responsabilité ! Voici mes 5 règles d\'or... 🎨♿',
      timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12h ago
      counts: {
        like: 18,
        celebrate: 0,
        support: 0,
        insightful: 0,
        curious: 0,
        comments: 22,
        shares: 8
      },
      userReaction: null
    },
    {
      id: 6,
      author: {
        name: 'Pierre Moreau',
        title: 'Consultant en Transformation Digitale',
        avatar: '👨‍🔬'
      },
      content: 'La transformation digitale ne se résume pas à adopter de nouveaux outils. C\'est avant tout un changement de mindset et de culture d\'entreprise. Retour sur 3 ans d\'accompagnement... 💡',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
      counts: {
        like: 25,
        celebrate: 0,
        support: 0,
        insightful: 0,
        curious: 0,
        comments: 15,
        shares: 20
      },
      userReaction: null
    }
  ]
};

const jobjerrSlice = createSlice({
  name: 'jobjerr',
  initialState,
  reducers: {
    setComposerText: (state, action) => {
      state.composerText = action.payload;
    },
    publishPost: (state, action) => {
      const newPost = {
        id: Date.now(),
        author: action.payload.author,
        content: action.payload.content,
        timestamp: new Date().toISOString(),
        counts: {
          like: 0,
          celebrate: 0,
          support: 0,
          insightful: 0,
          curious: 0,
          comments: 0,
          shares: 0
        },
        userReaction: null
      };
      state.posts.unshift(newPost);
      state.composerText = '';
    },
    toggleReaction: (state, action) => {
      const { postId, reactionType } = action.payload;
      const post = state.posts.find(p => p.id === postId);
      
      if (post) {
        // Si l'utilisateur avait déjà une réaction, la retirer
        if (post.userReaction) {
          post.counts[post.userReaction] = Math.max(0, post.counts[post.userReaction] - 1);
        }
        
        // Si c'est une nouvelle réaction différente, l'ajouter
        if (post.userReaction !== reactionType) {
          post.counts[reactionType] = (post.counts[reactionType] || 0) + 1;
          post.userReaction = reactionType;
        } else {
          // Si c'est la même réaction, la retirer
          post.userReaction = null;
        }
      }
    },
    addCommentCount: (state, action) => {
      const post = state.posts.find(p => p.id === action.payload);
      if (post) {
        post.counts.comments = (post.counts.comments || 0) + 1;
      }
    },
    addShareCount: (state, action) => {
      const post = state.posts.find(p => p.id === action.payload);
      if (post) {
        post.counts.shares = (post.counts.shares || 0) + 1;
      }
    }
  }
});

export const {
  setComposerText,
  publishPost,
  toggleReaction,
  addCommentCount,
  addShareCount
} = jobjerrSlice.actions;

export default jobjerrSlice.reducer;