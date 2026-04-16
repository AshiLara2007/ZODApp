import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
  TextInput,
  SafeAreaView,
  StatusBar,
  Linking,
  Animated,
  Dimensions,
  ScrollView,
  Alert,
  Platform,
  Modal,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Ionicons';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { WebView } from 'react-native-webview';

const { width, height } = Dimensions.get('window');
const Stack = createStackNavigator();

// ============ API Configuration ============
const API_URL = 'https://zodmanpower.info/api/talents';
const SAVE_TOKEN_URL = 'https://zod-api.vercel.app/api/save-token';

// Logo URL
const LOGO_URL = 'https://raw.githubusercontent.com/AshiLara2007/ZOD-Photos/main/ZOD%20LOGO%20(1).png';

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// Language Translations
const translations = {
  en: {
    selectLanguage: 'Choose Your Language',
    english: 'English',
    arabic: 'Arabic',
    continue: 'Continue',
    houseMaids: 'House Maids',
    recruitmentWorkers: 'Recruitment Workers',
    returnedHouseMaids: 'Returned Housemaids',
    drivers: 'Drivers',
    cooks: 'Cooks',
    search: 'Search candidates...',
    viewCV: 'View CV',
    hire: 'Hire Now',
    salary: 'Salary',
    experience: 'Experience',
    age: 'Age',
    country: 'Country',
    ready: 'Ready to Hire',
    noCandidates: 'No candidates found',
    connectionError: 'Connection Error',
    retry: 'Try Again',
    years: 'Years',
    totalCandidates: 'Total Candidates',
    welcome: 'Welcome to ZOD Manpower',
    selectCategory: 'Select a category to browse candidates',
    featured: 'Categories',
    findPerfect: 'Find Your Perfect Candidate',
    browseProfessionals: 'Browse through our verified professionals',
    enableNotifications: 'Enable Notifications',
    notificationMessage: 'Get instant alerts when new candidates are added!',
    allow: 'Allow',
    maybeLater: 'Maybe Later',
    cvViewer: 'CV Viewer',
    close: 'Close',
  },
  ar: {
    selectLanguage: 'اختر لغتك',
    english: 'الإنجليزية',
    arabic: 'العربية',
    continue: 'استمر',
    houseMaids: 'خادمات منازل',
    recruitmentWorkers: 'عمال التوظيف',
    returnedHouseMaids: 'خادمات عائدات',
    drivers: 'سائقين',
    cooks: 'طهاة',
    search: 'ابحث عن مرشحين...',
    viewCV: 'عرض السيرة',
    hire: 'وظف الآن',
    salary: 'الراتب',
    experience: 'الخبرة',
    age: 'العمر',
    country: 'البلد',
    ready: 'جاهز للتوظيف',
    noCandidates: 'لا يوجد مرشحين',
    connectionError: 'خطأ في الاتصال',
    retry: 'حاول مرة أخرى',
    years: 'سنوات',
    totalCandidates: 'إجمالي المرشحين',
    welcome: 'مرحباً بكم في زود مان باور',
    selectCategory: 'اختر فئة لتصفح المرشحين',
    featured: 'الفئات',
    findPerfect: 'ابحث عن المرشح المثالي',
    browseProfessionals: 'تصفح المحترفين المعتمدين لدينا',
    enableNotifications: 'تفعيل الإشعارات',
    notificationMessage: 'احصل على تنبيهات فورية عند إضافة مرشحين جدد!',
    allow: 'سماح',
    maybeLater: 'ربما لاحقاً',
    cvViewer: 'عارض السيرة الذاتية',
    close: 'إغلاق',
  },
};

// Save push token to server
const savePushToken = async (token, language) => {
  try {
    await fetch(SAVE_TOKEN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, language }),
    });
  } catch (error) {
    console.log('Error saving token:', error);
  }
};

// CV Viewer Modal Component
function CVViewerModal({ visible, cvUrl, onClose, language }) {
  const t = language;
  
  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={visible}
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>{t.cvViewer}</Text>
          <TouchableOpacity onPress={onClose} style={styles.modalCloseButton}>
            <Icon name="close-outline" size={28} color="#002F66" />
          </TouchableOpacity>
        </View>
        {cvUrl ? (
          <WebView
            source={{ uri: cvUrl }}
            style={styles.webview}
            startInLoadingState={true}
            renderLoading={() => (
              <View style={styles.webviewLoading}>
                <ActivityIndicator size="large" color="#002F66" />
              </View>
            )}
          />
        ) : (
          <View style={styles.noCVContainer}>
            <Icon name="document-text-outline" size={80} color="#ccc" />
            <Text style={styles.noCVText}>No CV available</Text>
          </View>
        )}
      </SafeAreaView>
    </Modal>
  );
}

// Notification Permission Screen
function NotificationScreen({ navigation, route }) {
  const { language, selectedLang } = route.params;
  const t = language;
  const [scaleAnim] = useState(new Animated.Value(1));
  const [loading, setLoading] = useState(false);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, { toValue: 0.95, useNativeDriver: true }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }).start();
  };

  const requestPermission = async () => {
    setLoading(true);
    try {
      if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        
        if (existingStatus !== 'granted') {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }
        
        if (finalStatus !== 'granted') {
          Alert.alert('Permission not granted', 'You can enable notifications from settings later.');
          navigation.replace('Home', { language: selectedLang === 'en' ? translations.en : translations.ar, selectedLang });
          return;
        }
        
        const token = await Notifications.getExpoPushTokenAsync();
        console.log('Push token:', token.data);
        await savePushToken(token.data, selectedLang);
        navigation.replace('Home', { language: selectedLang === 'en' ? translations.en : translations.ar, selectedLang });
      } else {
        Alert.alert('Must use physical device for Push Notifications');
        navigation.replace('Home', { language: selectedLang === 'en' ? translations.en : translations.ar, selectedLang });
      }
    } catch (error) {
      console.log('Error requesting permission:', error);
      navigation.replace('Home', { language: selectedLang === 'en' ? translations.en : translations.ar, selectedLang });
    } finally {
      setLoading(false);
    }
  };

  const skipPermission = () => {
    navigation.replace('Home', { language: selectedLang === 'en' ? translations.en : translations.ar, selectedLang });
  };

  return (
    <View style={styles.whiteContainer}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <View style={styles.notificationContainer}>
        <View style={styles.notificationIconCircle}>
          <Icon name="notifications-outline" size={60} color="#002F66" />
        </View>
        <Text style={styles.notificationTitle}>{t.enableNotifications}</Text>
        <Text style={styles.notificationMessage}>{t.notificationMessage}</Text>
        
        <Animated.View style={{ transform: [{ scale: scaleAnim }], width: '100%' }}>
          <TouchableOpacity
            style={styles.allowButton}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onPress={requestPermission}
            activeOpacity={0.9}
            disabled={loading}
          >
            {loading ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.allowButtonText}>{t.allow}</Text>}
          </TouchableOpacity>
        </Animated.View>
        
        <TouchableOpacity onPress={skipPermission} disabled={loading}>
          <Text style={styles.maybeLaterText}>{t.maybeLater}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Language Selection Screen
function LanguageScreen({ navigation }) {
  const [selectedLang, setSelectedLang] = useState('en');
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, { toValue: 0.95, useNativeDriver: true }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }).start();
  };

  const handleContinue = () => {
    navigation.replace('Notification', { 
      language: selectedLang === 'en' ? translations.en : translations.ar,
      selectedLang: selectedLang 
    });
  };

  return (
    <View style={styles.whiteContainer}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <View style={styles.logoContainer}>
        <View style={styles.logoCircle}>
          <Image source={{ uri: LOGO_URL }} style={styles.logoImageLarge} />
        </View>
        <Text style={styles.logoText}>ZOD MANPOWER</Text>
        <Text style={styles.logoSubtext}>Recruitment Agency</Text>
      </View>

      <View style={styles.languageCard}>
        <Text style={styles.title}>{translations.en.selectLanguage}</Text>
        
        <TouchableOpacity
          style={[styles.langOption, selectedLang === 'en' && styles.langOptionSelected]}
          onPress={() => setSelectedLang('en')}
        >
          <View style={[styles.langRadio, selectedLang === 'en' && styles.langRadioSelectedBorder]}>
            {selectedLang === 'en' && <View style={styles.langRadioSelected} />}
          </View>
          <Text style={styles.langText}>English</Text>
          {selectedLang === 'en' && <Icon name="checkmark-circle" size={24} color="#002F66" />}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.langOption, selectedLang === 'ar' && styles.langOptionSelected]}
          onPress={() => setSelectedLang('ar')}
        >
          <View style={[styles.langRadio, selectedLang === 'ar' && styles.langRadioSelectedBorder]}>
            {selectedLang === 'ar' && <View style={styles.langRadioSelected} />}
          </View>
          <Text style={styles.langText}>العربية</Text>
          {selectedLang === 'ar' && <Icon name="checkmark-circle" size={24} color="#002F66" />}
        </TouchableOpacity>

        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <TouchableOpacity
            style={styles.continueButton}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onPress={handleContinue}
            activeOpacity={0.9}
          >
            <Text style={styles.continueButtonText}>{translations.en.continue}</Text>
            <Icon name="arrow-forward" size={20} color="#fff" />
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
}

// Home Screen
function HomeScreen({ route }) {
  const { language, selectedLang } = route.params;
  const t = language;
  const [candidates, setCandidates] = useState([]);
  const [filteredCandidates, setFilteredCandidates] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [cvModalVisible, setCvModalVisible] = useState(false);
  const [selectedCV, setSelectedCV] = useState(null);
  const scrollY = useRef(new Animated.Value(0)).current;

  const categories = [
    { id: 'House Maid', name: t.houseMaids, icon: 'home', color: '#002F66', bgColor: '#E8F0FE', type: 'job' },
    { id: 'Recruitment Workers', name: t.recruitmentWorkers, icon: 'people', color: '#002F66', bgColor: '#E8F0FE', type: 'workerType' },
    { id: 'Returned Housemaids', name: t.returnedHouseMaids, icon: 'return-up-back', color: '#002F66', bgColor: '#E8F0FE', type: 'workerType' },
    { id: 'Driver', name: t.drivers, icon: 'car', color: '#002F66', bgColor: '#E8F0FE', type: 'job' },
    { id: 'Cook', name: t.cooks, icon: 'restaurant', color: '#002F66', bgColor: '#E8F0FE', type: 'job' },
  ];

  // Fetch candidates from website API
  const fetchCandidates = async () => {
    setLoading(true);
    setError(false);
    try {
      console.log('Fetching from:', API_URL);
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Network error');
      const data = await response.json();
      console.log('Candidates fetched:', data.length);
      setCandidates(data);
    } catch (error) {
      console.log('Error fetching candidates:', error);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  // Poll for new candidates every 30 seconds
  useEffect(() => {
    fetchCandidates();
    
    const interval = setInterval(() => {
      fetchCandidates();
    }, 30000);
    
    // Listen for notifications
    const subscription = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification received:', notification);
      fetchCandidates(); // Refresh when notification comes
    });
    
    const responseSubscription = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification response:', response);
      fetchCandidates();
    });
    
    return () => {
      interval.clear();
      subscription.remove();
      responseSubscription.remove();
    };
  }, []);

  const filterByCategory = (category) => {
    setSelectedCategory(category.id);
    setSearchQuery('');
    
    let filtered;
    if (category.type === 'job') {
      filtered = candidates.filter(c => c.job === category.id);
    } else {
      filtered = candidates.filter(c => c.workerType === category.id);
    }
    setFilteredCandidates(filtered);
  };

  const handleSearch = (text) => {
    setSearchQuery(text);
    if (selectedCategory) {
      const category = categories.find(c => c.id === selectedCategory);
      let baseFiltered;
      if (category?.type === 'job') {
        baseFiltered = candidates.filter(c => c.job === selectedCategory);
      } else {
        baseFiltered = candidates.filter(c => c.workerType === selectedCategory);
      }
      const searched = baseFiltered.filter(c => 
        c.name.toLowerCase().includes(text.toLowerCase()) ||
        c.country.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredCandidates(searched);
    }
  };

  const handleHire = (candidate) => {
    const message = `Hi! I'm interested in hiring ${candidate.name} (${candidate.job} from ${candidate.country})`;
    Linking.openURL(`https://wa.me/97455355206?text=${encodeURIComponent(message)}`);
  };

  const handleViewCV = (cvUrl) => {
    if (cvUrl && cvUrl !== '#') {
      setSelectedCV(cvUrl);
      setCvModalVisible(true);
    } else {
      Alert.alert('CV not available', 'Please contact us directly for CV.');
    }
  };

  const headerHeight = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [90, 60],
    extrapolate: 'clamp',
  });

  const CandidateCard = ({ candidate }) => (
    <TouchableOpacity activeOpacity={0.9} style={styles.whiteCard}>
      <Image source={{ uri: candidate.pic || LOGO_URL }} style={styles.cardImage} />
      <View style={styles.readyBadge}>
        <Text style={styles.readyText}>{t.ready}</Text>
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.cardName}>{candidate.name}</Text>
        <Text style={styles.cardJob}>{candidate.job}</Text>
        
        <View style={styles.cardDetails}>
          <View style={styles.detailItem}>
            <View style={styles.detailIconBg}>
              <Icon name="location-outline" size={14} color="#002F66" />
            </View>
            <Text style={styles.detailText}>{candidate.country}</Text>
          </View>
          <View style={styles.detailItem}>
            <View style={styles.detailIconBg}>
              <Icon name="person-outline" size={14} color="#002F66" />
            </View>
            <Text style={styles.detailText}>{candidate.gender}, {candidate.age} {t.years}</Text>
          </View>
          <View style={styles.detailItem}>
            <View style={styles.detailIconBg}>
              <Icon name="cash-outline" size={14} color="#002F66" />
            </View>
            <Text style={styles.detailText}>{candidate.salary || 0} QAR</Text>
          </View>
          <View style={styles.detailItem}>
            <View style={styles.detailIconBg}>
              <Icon name="briefcase-outline" size={14} color="#002F66" />
            </View>
            <Text style={styles.detailText}>{candidate.experience} {t.experience}</Text>
          </View>
          <View style={styles.detailItem}>
            <View style={styles.detailIconBg}>
              <Icon name="heart-outline" size={14} color="#002F66" />
            </View>
            <Text style={styles.detailText}>{candidate.maritalStatus || 'Single'}</Text>
          </View>
        </View>
        
        <View style={styles.cardButtons}>
          <TouchableOpacity style={styles.cvButton} onPress={() => handleViewCV(candidate.cv)}>
            <Icon name="document-text-outline" size={16} color="#002F66" />
            <Text style={styles.cvButtonText}>{t.viewCV}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.hireButton} onPress={() => handleHire(candidate)}>
            <Icon name="logo-whatsapp" size={16} color="#fff" />
            <Text style={styles.hireButtonText}>{t.hire}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  const CategoryButton = ({ item }) => {
    const [scaleAnim] = useState(new Animated.Value(1));
    
    const handlePressIn = () => {
      Animated.spring(scaleAnim, { toValue: 0.95, useNativeDriver: true }).start();
    };
    
    const handlePressOut = () => {
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }).start();
    };

    return (
      <Animated.View style={{ transform: [{ scale: scaleAnim }], marginHorizontal: 6 }}>
        <TouchableOpacity
          style={[
            styles.categoryButton,
            selectedCategory === item.id && styles.categoryButtonActive,
          ]}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          onPress={() => filterByCategory(item)}
          activeOpacity={0.9}
        >
          <View style={[styles.categoryIcon, { backgroundColor: selectedCategory === item.id ? '#002F66' : item.bgColor }]}>
            <Icon name={item.icon} size={28} color={selectedCategory === item.id ? '#fff' : item.color} />
          </View>
          <Text style={[styles.categoryText, selectedCategory === item.id && styles.categoryTextActive]}>{item.name}</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  if (loading && candidates.length === 0) {
    return (
      <View style={styles.whiteContainer}>
        <View style={styles.loadingContainer}>
          <Image source={{ uri: LOGO_URL }} style={styles.loadingLogo} />
          <ActivityIndicator size="large" color="#002F66" />
          <Text style={styles.loadingText}>Loading candidates from server...</Text>
        </View>
      </View>
    );
  }

  if (error && candidates.length === 0) {
    return (
      <View style={styles.whiteContainer}>
        <View style={styles.errorContainer}>
          <Image source={{ uri: LOGO_URL }} style={styles.errorLogo} />
          <Icon name="cloud-offline-outline" size={60} color="#999" />
          <Text style={styles.errorText}>{t.connectionError}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchCandidates}>
            <Text style={styles.retryButtonText}>{t.retry}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const displayCandidates = selectedCategory ? filteredCandidates : [];

  return (
    <>
      <CVViewerModal
        visible={cvModalVisible}
        cvUrl={selectedCV}
        onClose={() => setCvModalVisible(false)}
        language={t}
      />
      
      <View style={styles.whiteContainer}>
        <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
        
        <Animated.View style={[styles.header, { height: headerHeight }]}>
          <View style={styles.logoSmall}>
            <Image source={{ uri: LOGO_URL }} style={styles.logoImageSmall} />
            <Text style={styles.logoSmallText}>ZOD MANPOWER</Text>
          </View>
          <TouchableOpacity onPress={fetchCandidates} style={styles.refreshButton}>
            <Icon name="refresh-outline" size={22} color="#002F66" />
          </TouchableOpacity>
        </Animated.View>

        <ScrollView 
          showsVerticalScrollIndicator={false}
          onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: false })}
          scrollEventThrottle={16}
        >
          <View style={styles.welcomeSection}>
            <Text style={styles.welcomeTitle}>{t.findPerfect}</Text>
            <Text style={styles.welcomeDesc}>{t.browseProfessionals}</Text>
          </View>

          <View style={styles.categorySection}>
            <Text style={styles.sectionTitle}>
              <Icon name="apps-outline" size={20} color="#002F66" /> {t.featured}
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
              {categories.map((item) => (
                <CategoryButton key={item.id} item={item} />
              ))}
            </ScrollView>
          </View>

          {selectedCategory && (
            <View style={styles.searchSection}>
              <View style={styles.searchContainer}>
                <Icon name="search-outline" size={20} color="#002F66" />
                <TextInput
                  style={styles.searchInput}
                  placeholder={t.search}
                  value={searchQuery}
                  onChangeText={handleSearch}
                  placeholderTextColor="#999"
                />
                {searchQuery !== '' && (
                  <TouchableOpacity onPress={() => handleSearch('')}>
                    <Icon name="close-circle" size={20} color="#002F66" />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}

          {!selectedCategory ? (
            <View style={styles.statsSection}>
              <View style={styles.statCard}>
                <View style={styles.statIconBg}>
                  <Icon name="people-outline" size={28} color="#002F66" />
                </View>
                <Text style={styles.statNumber}>{candidates.length}</Text>
                <Text style={styles.statLabel}>{t.totalCandidates}</Text>
              </View>
              <View style={styles.statCard}>
                <View style={styles.statIconBg}>
                  <Icon name="briefcase-outline" size={28} color="#002F66" />
                </View>
                <Text style={styles.statNumber}>5+</Text>
                <Text style={styles.statLabel}>Categories</Text>
              </View>
              <View style={styles.statCard}>
                <View style={styles.statIconBg}>
                  <Icon name="time-outline" size={28} color="#002F66" />
                </View>
                <Text style={styles.statNumber}>24/7</Text>
                <Text style={styles.statLabel}>Support</Text>
              </View>
            </View>
          ) : displayCandidates.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Icon name="people-outline" size={80} color="#ccc" />
              <Text style={styles.emptyText}>{t.noCandidates}</Text>
            </View>
          ) : (
            <View style={styles.candidatesSection}>
              <View style={styles.resultHeader}>
                <Text style={styles.resultTitle}>{selectedCategory}</Text>
                <Text style={styles.resultCount}>{displayCandidates.length} candidates</Text>
              </View>
              {displayCandidates.map((candidate) => (
                <CandidateCard key={candidate.id} candidate={candidate} />
              ))}
            </View>
          )}
        </ScrollView>
      </View>
    </>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Language" component={LanguageScreen} />
        <Stack.Screen name="Notification" component={NotificationScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  whiteContainer: { flex: 1, backgroundColor: '#ffffff' },
  logoContainer: { alignItems: 'center', marginTop: 60, marginBottom: 30 },
  logoCircle: { width: 110, height: 110, borderRadius: 55, backgroundColor: '#f5f5f5', alignItems: 'center', justifyContent: 'center', marginBottom: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5, elevation: 3 },
  logoImageLarge: { width: 100, height: 100, borderRadius: 50 },
  logoImageSmall: { width: 36, height: 36, borderRadius: 18 },
  logoText: { fontSize: 26, fontWeight: 'bold', color: '#002F66', letterSpacing: 1 },
  logoSubtext: { fontSize: 13, color: '#666', marginTop: 5 },
  languageCard: { backgroundColor: '#ffffff', borderRadius: 30, marginHorizontal: 20, padding: 25, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 3, borderWidth: 1, borderColor: '#f0f0f0' },
  title: { fontSize: 22, fontWeight: 'bold', color: '#002F66', textAlign: 'center', marginBottom: 25 },
  langOption: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15, paddingHorizontal: 10, borderRadius: 15, marginBottom: 8 },
  langOptionSelected: { backgroundColor: '#E8F0FE' },
  langRadio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: '#ddd', alignItems: 'center', justifyContent: 'center', marginRight: 15 },
  langRadioSelectedBorder: { borderColor: '#002F66' },
  langRadioSelected: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#002F66' },
  langText: { fontSize: 16, color: '#333', flex: 1 },
  continueButton: { backgroundColor: '#002F66', borderRadius: 30, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 14, gap: 8, marginTop: 20 },
  continueButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  notificationContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40, backgroundColor: '#ffffff' },
  notificationIconCircle: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#E8F0FE', alignItems: 'center', justifyContent: 'center', marginBottom: 30 },
  notificationTitle: { fontSize: 24, fontWeight: 'bold', color: '#002F66', marginBottom: 15, textAlign: 'center' },
  notificationMessage: { fontSize: 14, color: '#666', textAlign: 'center', marginBottom: 40, lineHeight: 20 },
  allowButton: { backgroundColor: '#002F66', borderRadius: 30, paddingVertical: 14, alignItems: 'center', width: '100%', marginBottom: 20 },
  allowButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  maybeLaterText: { color: '#002F66', fontSize: 14, fontWeight: '500' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, backgroundColor: '#ffffff', borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  logoSmall: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  logoSmallText: { fontSize: 16, fontWeight: 'bold', color: '#002F66' },
  refreshButton: { padding: 8 },
  welcomeSection: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 10 },
  welcomeTitle: { fontSize: 28, fontWeight: 'bold', color: '#002F66' },
  welcomeDesc: { fontSize: 14, color: '#666', marginTop: 5 },
  categorySection: { paddingVertical: 15 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#002F66', marginHorizontal: 20, marginBottom: 15 },
  categoryScroll: { paddingLeft: 15 },
  categoryButton: { alignItems: 'center', marginHorizontal: 8, width: 90 },
  categoryIcon: { width: 60, height: 60, borderRadius: 30, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  categoryText: { fontSize: 11, fontWeight: '600', color: '#666', textAlign: 'center' },
  categoryTextActive: { color: '#002F66' },
  categoryButtonActive: { opacity: 1 },
  searchSection: { paddingHorizontal: 20, paddingVertical: 15 },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f5f5f5', paddingHorizontal: 15, borderRadius: 30, gap: 10 },
  searchInput: { flex: 1, paddingVertical: 12, fontSize: 15 },
  statsSection: { flexDirection: 'row', justifyContent: 'space-around', paddingHorizontal: 20, paddingVertical: 30 },
  statCard: { alignItems: 'center', backgroundColor: '#ffffff', padding: 15, borderRadius: 20, width: width * 0.28, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5, elevation: 2, borderWidth: 1, borderColor: '#f0f0f0' },
  statIconBg: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#E8F0FE', alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  statNumber: { fontSize: 20, fontWeight: 'bold', color: '#002F66', marginTop: 5 },
  statLabel: { fontSize: 10, color: '#999', marginTop: 4 },
  candidatesSection: { paddingHorizontal: 20, paddingBottom: 30 },
  resultHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  resultTitle: { fontSize: 18, fontWeight: 'bold', color: '#002F66' },
  resultCount: { fontSize: 12, color: '#666' },
  whiteCard: { backgroundColor: '#ffffff', borderRadius: 20, marginBottom: 20, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 3, borderWidth: 1, borderColor: '#f0f0f0' },
  cardImage: { width: '100%', height: 160 },
  readyBadge: { position: 'absolute', top: 12, right: 12, backgroundColor: '#4CAF50', paddingHorizontal: 12, paddingVertical: 5, borderRadius: 15 },
  readyText: { fontSize: 10, fontWeight: 'bold', color: '#fff' },
  cardContent: { padding: 15 },
  cardName: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  cardJob: { fontSize: 12, color: '#002F66', fontWeight: '600', marginTop: 2 },
  cardDetails: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginVertical: 12 },
  detailItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  detailIconBg: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#E8F0FE', alignItems: 'center', justifyContent: 'center' },
  detailText: { fontSize: 11, color: '#666' },
  cardButtons: { flexDirection: 'row', gap: 10, marginTop: 5 },
  cvButton: { flex: 1, flexDirection: 'row', backgroundColor: '#E8F0FE', paddingVertical: 12, borderRadius: 25, alignItems: 'center', justifyContent: 'center', gap: 6 },
  cvButtonText: { fontSize: 12, fontWeight: '600', color: '#002F66' },
  hireButton: { flex: 1, flexDirection: 'row', backgroundColor: '#002F66', paddingVertical: 12, borderRadius: 25, alignItems: 'center', justifyContent: 'center', gap: 6 },
  hireButtonText: { fontSize: 12, fontWeight: '600', color: '#fff' },
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  loadingLogo: { width: 80, height: 80, borderRadius: 40, marginBottom: 20 },
  loadingText: { marginTop: 15, fontSize: 14, color: '#002F66' },
  errorContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40 },
  errorLogo: { width: 80, height: 80, borderRadius: 40, marginBottom: 20 },
  errorText: { fontSize: 16, color: '#999', marginTop: 15, textAlign: 'center' },
  retryButton: { backgroundColor: '#002F66', paddingHorizontal: 30, paddingVertical: 12, borderRadius: 30, marginTop: 20 },
  retryButtonText: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60 },
  emptyText: { fontSize: 16, color: '#999', marginTop: 15 },
  // Modal Styles
  modalContainer: { flex: 1, backgroundColor: '#ffffff' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 15, backgroundColor: '#ffffff', borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#002F66' },
  modalCloseButton: { padding: 5 },
  webview: { flex: 1 },
  webviewLoading: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' },
  noCVContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  noCVText: { fontSize: 16, color: '#999', marginTop: 15 },
});