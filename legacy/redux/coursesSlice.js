import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Mock data for courses
const mockCourses = [
  {
    id: 1,
    title: 'React Native Masterclass : De Zéro à Expert',
    teacher: 'Sarah Johnson',
    rating: 4.8,
    reviewsCount: 2847,
    duration: '12h 30min',
    level: 'Intermédiaire',
    image: 'https://picsum.photos/320/180?random=1',
    isBestSeller: true,
    isNew: false,
    basePriceJerr: 15900,
    promoPriceJerr: 9900,
    studentsCount: 12847,
    category: 'Développement Mobile',
  },
  {
    id: 2,
    title: 'Design UI/UX avec Figma : Guide Complet',
    teacher: 'Marc Dubois',
    rating: 4.9,
    reviewsCount: 1923,
    duration: '8h 45min',
    level: 'Débutant',
    image: 'https://picsum.photos/320/180?random=2',
    isBestSeller: true,
    isNew: false,
    basePriceJerr: 12500,
    promoPriceJerr: 7900,
    studentsCount: 8934,
    category: 'Design',
  },
  {
    id: 3,
    title: 'JavaScript ES6+ : Techniques Avancées',
    teacher: 'Alex Martin',
    rating: 4.7,
    reviewsCount: 3421,
    duration: '15h 20min',
    level: 'Avancé',
    image: 'https://picsum.photos/320/180?random=3',
    isBestSeller: true,
    isNew: false,
    basePriceJerr: 18900,
    studentsCount: 15672,
    category: 'Programmation',
  },
  {
    id: 4,
    title: 'Intelligence Artificielle avec Python',
    teacher: 'Dr. Emma Wilson',
    rating: 4.6,
    reviewsCount: 1567,
    duration: '20h 15min',
    level: 'Avancé',
    image: 'https://picsum.photos/320/180?random=4',
    isBestSeller: false,
    isNew: true,
    basePriceJerr: 24900,
    promoPriceJerr: 16900,
    studentsCount: 3421,
    category: 'Intelligence Artificielle',
  },
  {
    id: 5,
    title: 'Marketing Digital : Stratégies 2024',
    teacher: 'Julie Moreau',
    rating: 4.5,
    reviewsCount: 892,
    duration: '6h 30min',
    level: 'Débutant',
    image: 'https://picsum.photos/320/180?random=5',
    isBestSeller: false,
    isNew: true,
    basePriceJerr: 9900,
    studentsCount: 2156,
    category: 'Marketing',
  },
  {
    id: 6,
    title: 'Photographie Professionnelle',
    teacher: 'Thomas Leroy',
    rating: 4.8,
    reviewsCount: 2134,
    duration: '10h 45min',
    level: 'Intermédiaire',
    image: 'https://picsum.photos/320/180?random=6',
    isBestSeller: false,
    isNew: true,
    basePriceJerr: 14500,
    promoPriceJerr: 9900,
    studentsCount: 6789,
    category: 'Arts Créatifs',
  },
  {
    id: 7,
    title: 'Blockchain et Cryptomonnaies',
    teacher: 'Kevin Zhang',
    rating: 4.4,
    reviewsCount: 756,
    duration: '9h 20min',
    level: 'Intermédiaire',
    image: 'https://picsum.photos/320/180?random=7',
    isBestSeller: false,
    isNew: false,
    basePriceJerr: 16900,
    studentsCount: 4321,
    category: 'Finance',
  },
  {
    id: 8,
    title: 'Cuisine Française Traditionnelle',
    teacher: 'Chef Antoine Rousseau',
    rating: 4.9,
    reviewsCount: 1876,
    duration: '7h 15min',
    level: 'Débutant',
    image: 'https://picsum.photos/320/180?random=8',
    isBestSeller: true,
    isNew: false,
    basePriceJerr: 11900,
    promoPriceJerr: 7900,
    studentsCount: 9876,
    category: 'Cuisine',
  },
  {
    id: 9,
    title: 'Yoga et Méditation : Bien-être Total',
    teacher: 'Amélie Petit',
    rating: 4.7,
    reviewsCount: 1234,
    duration: '5h 30min',
    level: 'Débutant',
    image: 'https://picsum.photos/320/180?random=9',
    isBestSeller: false,
    isNew: true,
    basePriceJerr: 8900,
    studentsCount: 5432,
    category: 'Bien-être',
  },
  {
    id: 10,
    title: 'Entrepreneuriat : Créer sa Startup',
    teacher: 'Pierre Durand',
    rating: 4.6,
    reviewsCount: 987,
    duration: '11h 45min',
    level: 'Intermédiaire',
    image: 'https://picsum.photos/320/180?random=10',
    isBestSeller: false,
    isNew: false,
    basePriceJerr: 19900,
    promoPriceJerr: 12900,
    studentsCount: 3654,
    category: 'Business',
  },
];

// Async thunks for loading courses (mock)
export const loadBestSellers = createAsyncThunk(
  'courses/loadBestSellers',
  async () => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockCourses.filter(course => course.isBestSeller);
  }
);

export const loadNewCourses = createAsyncThunk(
  'courses/loadNewCourses',
  async () => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockCourses.filter(course => course.isNew);
  }
);

export const loadRecommended = createAsyncThunk(
  'courses/loadRecommended',
  async (_, { getState }) => {
    // Simulate API call with personalization
    await new Promise(resolve => setTimeout(resolve, 400));
    
    // Mock personalization based on user interests
    const state = getState();
    const userInterests = state.user?.interests || [];
    
    // If no interests, return a mix of courses
    if (userInterests.length === 0) {
      return mockCourses.slice(0, 6);
    }
    
    // Filter by interests (simplified)
    const recommended = mockCourses.filter(course => 
      userInterests.some(interest => 
        course.category.toLowerCase().includes(interest.toLowerCase()) ||
        course.title.toLowerCase().includes(interest.toLowerCase())
      )
    );
    
    // If not enough matches, add popular courses
    if (recommended.length < 4) {
      const popular = mockCourses
        .filter(course => !recommended.find(r => r.id === course.id))
        .sort((a, b) => b.studentsCount - a.studentsCount)
        .slice(0, 6 - recommended.length);
      
      return [...recommended, ...popular];
    }
    
    return recommended.slice(0, 6);
  }
);

const coursesSlice = createSlice({
  name: 'courses',
  initialState: {
    bestSellers: [],
    newCourses: [],
    recommended: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {
    clearCourses: (state) => {
      state.bestSellers = [];
      state.newCourses = [];
      state.recommended = [];
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Best Sellers
      .addCase(loadBestSellers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(loadBestSellers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.bestSellers = action.payload;
      })
      .addCase(loadBestSellers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      // New Courses
      .addCase(loadNewCourses.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(loadNewCourses.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.newCourses = action.payload;
      })
      .addCase(loadNewCourses.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      // Recommended
      .addCase(loadRecommended.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(loadRecommended.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.recommended = action.payload;
      })
      .addCase(loadRecommended.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

// Selectors
export const selectBestSellers = (state) => state.courses.bestSellers;
export const selectNewCourses = (state) => state.courses.newCourses;
export const selectRecommended = (state) => state.courses.recommended;
export const selectCoursesStatus = (state) => state.courses.status;
export const selectCoursesError = (state) => state.courses.error;

export const { clearCourses } = coursesSlice.actions;
export default coursesSlice.reducer;