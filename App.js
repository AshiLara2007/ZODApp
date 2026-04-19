import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, TouchableOpacity, FlatList, Image,
  StyleSheet, ScrollView, Switch, ActivityIndicator,
  Alert, Linking, RefreshControl, TextInput, Share,
  Animated, Dimensions, Modal, SafeAreaView, Platform
} from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');
const API_URL = 'https://zodmanpower.info/api/talents';
const LOGO_URL = 'https://raw.githubusercontent.com/AshiLara2007/ZOD-Photos/main/ZOD%20LOGO%20(1).png';
const APP_VERSION = '1.0.5';

// ------------------- TRANSLATIONS -------------------
const translations = {
  en: {
    app_name: 'ZOD MANPOWER',
    tagline: 'Your Trusted Recruitment Partner',
    select: 'Choose Language',
    settings: 'Settings',
    dark_mode: 'Dark Mode',
    language: 'Language',
    version: 'Version',
    maids: 'House Maids',
    drivers: 'Drivers',
    returned: 'Returned',
    nurses: 'Nurses',
    teachers: 'Teachers',
    cooks: 'Cooks',
    all: 'All',
    no: 'No candidates found',
    loading: 'Loading...',
    details: 'Details',
    back: 'Back',
    name: 'Name',
    cat: 'Category',
    nat: 'Nationality',
    salary: 'Salary',
    age: 'Age',
    gender: 'Gender',
    status: 'Status',
    view_cv: 'View CV',
    hire: 'Hire',
    error: 'Failed to load',
    last_update: 'Updated',
    total_cvs: 'Total Candidates',
    experience: 'Experience',
    filter_by_country: 'Country',
    call: 'Call Us',
    email: 'Email Us',
    website: 'Website',
    share: 'Share App',
    rate: 'Rate App',
    search: 'Search by name or country...',
    recruit: 'Recruitment',
    returned_label: 'Returned',
    all_countries: 'All',
    featured: 'Categories',
    ready: 'Ready',
    hire_via_whatsapp: 'Hire via WhatsApp',
    view_full_profile: 'View Profile',
    home: 'Home',
    categories: 'Categories',
    profile: 'Profile',
    favorites: 'Favorites',
    notifications: 'Notifications',
    push_notifications: 'Push Notifications',
    clear_cache: 'Clear Cache',
    cache_cleared: 'Cache Cleared Successfully',
    about_dev: 'About Developers',
    developers: 'Developers',
    developer_name: 'ZOD Tech Team',
    developer_email: 'info@zodmanpower.info',
    social_media: 'Social Media',
    facebook: 'Facebook',
    instagram: 'Instagram',
    twitter: 'Twitter',
    privacy_security: 'Privacy & Security',
    privacy_policy: 'Privacy Policy',
    terms_conditions: 'Terms & Conditions',
    help_support: 'Help & Support',
    faq: 'FAQ',
    contact_support: 'Contact Support',
    app_theme: 'App Theme',
    light: 'Light',
    dark: 'Dark',
    system: 'System',
    language_selection: 'Language Selection',
    english: 'English',
    arabic: 'Arabic',
  },
  ar: {
    app_name: 'زود مان باور',
    tagline: 'شريك التوظيف الموثوق',
    select: 'اختر اللغة',
    settings: 'الإعدادات',
    dark_mode: 'الوضع الداكن',
    language: 'اللغة',
    version: 'الإصدار',
    maids: 'خادمات',
    drivers: 'سائقين',
    returned: 'عائدات',
    nurses: 'ممرضين',
    teachers: 'معلمين',
    cooks: 'طهاة',
    all: 'الكل',
    no: 'لا يوجد مرشحين',
    loading: 'جاري التحميل...',
    details: 'تفاصيل',
    back: 'رجوع',
    name: 'الاسم',
    cat: 'التصنيف',
    nat: 'الجنسية',
    salary: 'الراتب',
    age: 'العمر',
    gender: 'الجنس',
    status: 'الحالة',
    view_cv: 'عرض السيرة',
    hire: 'وظف',
    error: 'فشل التحميل',
    last_update: 'آخر تحديث',
    total_cvs: 'إجمالي المرشحين',
    experience: 'الخبرة',
    filter_by_country: 'البلد',
    call: 'اتصل بنا',
    email: 'راسلنا',
    website: 'الموقع',
    share: 'مشاركة التطبيق',
    rate: 'تقييم التطبيق',
    search: 'ابحث بالاسم أو البلد...',
    recruit: 'توظيف',
    returned_label: 'عائدات',
    all_countries: 'الكل',
    featured: 'التصنيفات',
    ready: 'جاهز',
    hire_via_whatsapp: 'وظف عبر واتساب',
    view_full_profile: 'عرض الملف',
    home: 'الرئيسية',
    categories: 'التصنيفات',
    profile: 'الملف',
    favorites: 'المفضلة',
    notifications: 'الإشعارات',
    push_notifications: 'الإشعارات الفورية',
    clear_cache: 'مسح الذاكرة المؤقتة',
    cache_cleared: 'تم مسح الذاكرة بنجاح',
    about_dev: 'عن المطورين',
    developers: 'المطورين',
    developer_name: 'فريق زود تك',
    developer_email: 'info@zodmanpower.info',
    social_media: 'وسائل التواصل',
    facebook: 'فيسبوك',
    instagram: 'انستغرام',
    twitter: 'تويتر',
    privacy_security: 'الخصوصية والأمان',
    privacy_policy: 'سياسة الخصوصية',
    terms_conditions: 'الشروط والأحكام',
    help_support: 'المساعدة والدعم',
    faq: 'الأسئلة الشائعة',
    contact_support: 'اتصل بالدعم',
    app_theme: 'ثيم التطبيق',
    light: 'فاتح',
    dark: 'داكن',
    system: 'النظام',
    language_selection: 'اختيار اللغة',
    english: 'الإنجليزية',
    arabic: 'العربية',
  }
};

const COUNTRIES = ['ALL', 'INDONESIA', 'SRI LANKA', 'PHILIPPINES', 'BANGLADESH', 'INDIA', 'ETHIOPIA', 'KENYA', 'UGANDA'];

const mapJobToCategory = (talent) => {
  if (talent.workerType === 'Returned Housemaids') return 'Returned';
  const job = (talent.job || '').toLowerCase();
  if (job.includes('maid') || job.includes('housemaid')) return 'House Maids';
  if (job.includes('cook')) return 'Cooks';
  if (job.includes('driver')) return 'Drivers';
  if (job.includes('nurse')) return 'Nurses';
  if (job.includes('teacher')) return 'Teachers';
  return 'Recruitment';
};

const fetchTalents = async () => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error();
    const data = await response.json();
    let talents = Array.isArray(data) ? data : (data.data || []);
    return talents.map(t => ({
      id: t.id || t._id,
      name: t.name || 'N/A',
      category: mapJobToCategory(t),
      subCategory: t.job || 'General',
      nationality: (t.country || 'N/A').toUpperCase(),
      gender: t.gender || 'N/A',
      age: t.age ? `${t.age}y` : 'N/A',
      salary: t.salary ? `${t.salary} QAR` : 'N/A',
      experience: t.experience || 'N/A',
      status: 'Ready',
      imageUrl: t.pic || '',
      cvUrl: t.cv || '',
      workerType: t.workerType || 'Recruitment',
    }));
  } catch (error) {
    return [];
  }
};

// ------------------- COMPONENTS -------------------
const CategoryIcon = ({ icon, label, color, onPress, isActive }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const handlePressIn = () => Animated.spring(scaleAnim, { toValue: 0.92, useNativeDriver: true }).start();
  const handlePressOut = () => Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }).start();
  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity onPress={onPress} onPressIn={handlePressIn} onPressOut={handlePressOut} activeOpacity={0.9}>
        <LinearGradient colors={isActive ? [color, color] : ['#f0f0f0', '#f0f0f0']} style={[styles.categoryIconBtn, isActive && styles.categoryIconBtnActive]}>
          <Text style={styles.categoryIconEmoji}>{icon}</Text>
          <Text style={[styles.categoryIconLabel, isActive && styles.categoryIconLabelActive]}>{label}</Text>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

const CandidateCard = ({ item, onPress, isDarkMode, t, index }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    Animated.delay(index * 50).start(() => {
      Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }).start();
    });
  }, []);

  const handlePressIn = () => Animated.spring(scaleAnim, { toValue: 0.96, useNativeDriver: true }).start();
  const handlePressOut = () => Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }).start();

  return (
    <Animated.View style={{ opacity: fadeAnim, transform: [{ scale: scaleAnim }], width: '48%', marginBottom: 16 }}>
      <TouchableOpacity onPress={onPress} onPressIn={handlePressIn} onPressOut={handlePressOut} activeOpacity={0.9}>
        <LinearGradient colors={isDarkMode ? ['#1e1e2e', '#2a2a3e'] : ['#ffffff', '#f8f9fa']} style={styles.card}>
          <View style={styles.cardImageWrapper}>
            {item.imageUrl ? (
              <Image source={{ uri: item.imageUrl }} style={styles.cardImage} />
            ) : (
              <LinearGradient colors={['#e0e0e0', '#d0d0d0']} style={styles.cardImagePlaceholder}>
                <Text style={styles.cardImagePlaceholderText}>👤</Text>
              </LinearGradient>
            )}
            {item.workerType === 'Returned' && (
              <View style={styles.cardBadgeReturned}>
                <Text style={styles.cardBadgeReturnedText}>🔄</Text>
              </View>
            )}
            <View style={styles.cardBadgeStatus}>
              <Text style={styles.cardBadgeStatusText}>{t.ready}</Text>
            </View>
          </View>
          <View style={styles.cardContent}>
            <Text style={[styles.cardName, isDarkMode && styles.darkTitle]} numberOfLines={1}>{item.name}</Text>
            <Text style={[styles.cardCategory, isDarkMode && styles.darkText]} numberOfLines={1}>{item.subCategory}</Text>
            <View style={styles.cardFooter}>
              <View style={styles.cardCountry}>
                <Text style={styles.cardCountryText}>{item.nationality}</Text>
              </View>
              <Text style={[styles.cardSalary, isDarkMode && styles.darkText]}>{item.salary}</Text>
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

// ------------------- SPLASH SCREEN -------------------
function SplashScreen({ onFinish }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.7)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, tension: 10, useNativeDriver: true }),
    ]).start();
    setTimeout(onFinish, 2000);
  }, []);

  return (
    <LinearGradient colors={['#002F66', '#004A99', '#0066CC']} style={styles.splashContainer}>
      <Animated.View style={{ opacity: fadeAnim, transform: [{ scale: scaleAnim }], alignItems: 'center' }}>
        <View style={styles.splashLogoWrapper}>
          <Image source={{ uri: LOGO_URL }} style={styles.splashLogo} />
        </View>
        <Text style={styles.splashTitle}>ZOD MANPOWER</Text>
        <Text style={styles.splashSubtitle}>Recruitment Agency</Text>
      </Animated.View>
    </LinearGradient>
  );
}

// ------------------- LANGUAGE SCREEN -------------------
function LanguageScreen({ onSelect }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }).start();
  }, []);

  return (
    <LinearGradient colors={['#f5f7fa', '#ffffff']} style={styles.container}>
      <StatusBar style="dark" />
      <Animated.View style={[styles.languageContainer, { opacity: fadeAnim }]}>
        <View style={styles.logoWrapper}>
          <LinearGradient colors={['#002F66', '#004A99']} style={styles.logoGradient}>
            <Image source={{ uri: LOGO_URL }} style={styles.logo} />
          </LinearGradient>
        </View>
        <Text style={styles.title}>ZOD MANPOWER</Text>
        <Text style={styles.tagline}>{translations.en.tagline}</Text>
        <Text style={styles.selectText}>{translations.en.select}</Text>

        <TouchableOpacity style={styles.langBtn} onPress={() => onSelect('en')} activeOpacity={0.9}>
          <LinearGradient colors={['#002F66', '#004A99']} style={styles.langBtnGradient}>
            <Text style={styles.langBtnText}>English</Text>
            <Text style={styles.langFlag}>🇬🇧</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity style={styles.langBtn} onPress={() => onSelect('ar')} activeOpacity={0.9}>
          <LinearGradient colors={['#002F66', '#004A99']} style={styles.langBtnGradient}>
            <Text style={styles.langBtnText}>العربية</Text>
            <Text style={styles.langFlag}>🇸🇦</Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    </LinearGradient>
  );
}

// ------------------- SETTINGS SCREEN -------------------
function SettingsScreen({ lang, onBack, onLangChange, isDarkMode, onToggleDarkMode }) {
  const t = translations[lang];
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleShare = async () => {
    await Share.share({ message: 'Check out ZOD Manpower App! https://zodmanpower.info' });
  };

  const handleRate = () => {
    Linking.openURL('https://play.google.com/store/apps/details?id=com.zod.manpower');
  };

  const handleClearCache = () => {
    Alert.alert('Success', t.cache_cleared);
  };

  const SettingSection = ({ title, children }) => (
    <View style={[styles.settingsCard, isDarkMode && styles.darkCard]}>
      <Text style={[styles.settingsSectionTitle, isDarkMode && styles.darkText]}>{title}</Text>
      {children}
    </View>
  );

  const SettingItem = ({ icon, label, onPress, isLink = true }) => (
    <TouchableOpacity style={styles.settingItem} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.settingItemLeft}>
        <Text style={styles.settingItemIcon}>{icon}</Text>
        <Text style={[styles.settingItemLabel, isDarkMode && styles.darkText]}>{label}</Text>
      </View>
      {isLink && <Text style={styles.settingItemArrow}>→</Text>}
    </TouchableOpacity>
  );

  const SwitchItem = ({ icon, label, value, onValueChange }) => (
    <View style={styles.settingItem}>
      <View style={styles.settingItemLeft}>
        <Text style={styles.settingItemIcon}>{icon}</Text>
        <Text style={[styles.settingItemLabel, isDarkMode && styles.darkText]}>{label}</Text>
      </View>
      <Switch value={value} onValueChange={onValueChange} trackColor={{ false: '#ddd', true: '#004A99' }} thumbColor={value ? '#fff' : '#002F66'} />
    </View>
  );

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      <LinearGradient colors={['#002F66', '#004A99']} style={styles.settingsHeader}>
        <TouchableOpacity onPress={onBack} style={styles.settingsBackBtn}>
          <Text style={styles.settingsBackText}>← {t.back}</Text>
        </TouchableOpacity>
        <Image source={{ uri: LOGO_URL }} style={styles.settingsHeaderLogo} />
        <Text style={styles.settingsHeaderTitle}>ZOD MANPOWER</Text>
        <Text style={styles.settingsHeaderVersion}>{t.version} {APP_VERSION}</Text>
      </LinearGradient>

      <ScrollView style={styles.settingsContent} showsVerticalScrollIndicator={false}>
        <SettingSection title="🎨 Appearance">
          <SwitchItem icon="🌙" label={t.dark_mode} value={isDarkMode} onValueChange={onToggleDarkMode} />
        </SettingSection>

        <SettingSection title="🌐 Language">
          <View style={styles.languageSelector}>
            <TouchableOpacity style={[styles.langSelectorBtn, lang === 'en' && styles.activeLangSelector]} onPress={() => onLangChange('en')}>
              <Text style={[styles.langSelectorText, lang === 'en' && styles.activeLangSelectorText]}>🇬🇧 {t.english}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.langSelectorBtn, lang === 'ar' && styles.activeLangSelector]} onPress={() => onLangChange('ar')}>
              <Text style={[styles.langSelectorText, lang === 'ar' && styles.activeLangSelectorText]}>🇸🇦 {t.arabic}</Text>
            </TouchableOpacity>
          </View>
        </SettingSection>

        <SettingSection title="🔔 Notifications">
          <SwitchItem icon="🔔" label={t.push_notifications} value={notificationsEnabled} onValueChange={setNotificationsEnabled} />
        </SettingSection>

        <SettingSection title="🔒 Privacy & Security">
          <SettingItem icon="📄" label={t.privacy_policy} onPress={() => Linking.openURL('https://zodmanpower.info/privacy')} />
          <SettingItem icon="⚖️" label={t.terms_conditions} onPress={() => Linking.openURL('https://zodmanpower.info/terms')} />
        </SettingSection>

        <SettingSection title="💙 Support">
          <SettingItem icon="📤" label={t.share} onPress={handleShare} />
          <SettingItem icon="⭐" label={t.rate} onPress={handleRate} />
          <SettingItem icon="🗑️" label={t.clear_cache} onPress={handleClearCache} />
        </SettingSection>

        <SettingSection title="📞 Contact Us">
          <SettingItem icon="🌐" label={t.website} onPress={() => Linking.openURL('https://zodmanpower.info')} />
          <SettingItem icon="📞" label={t.call} onPress={() => Linking.openURL('tel:+97455355206')} />
          <SettingItem icon="✉️" label={t.email} onPress={() => Linking.openURL('mailto:info@zodmanpower.info')} />
        </SettingSection>

        <SettingSection title="📱 Social Media">
          <SettingItem icon="📘" label={t.facebook} onPress={() => Linking.openURL('https://facebook.com/zodmanpower')} />
          <SettingItem icon="📷" label={t.instagram} onPress={() => Linking.openURL('https://instagram.com/zodmanpower')} />
          <SettingItem icon="🐦" label={t.twitter} onPress={() => Linking.openURL('https://twitter.com/zodmanpower')} />
        </SettingSection>

        <SettingSection title="❓ Help & Support">
          <SettingItem icon="❓" label={t.faq} onPress={() => Alert.alert('FAQ', 'Coming soon!')} />
          <SettingItem icon="💬" label={t.contact_support} onPress={() => Linking.openURL('mailto:support@zodmanpower.info')} />
        </SettingSection>

        <SettingSection title="ℹ️ About">
          <SettingItem icon="👨‍💻" label={t.developers} onPress={() => Alert.alert(t.developers, `${t.developer_name}\n${t.developer_email}`)} isLink={false} />
          <SettingItem icon="📅" label={`${t.version} ${APP_VERSION}`} onPress={() => {}} isLink={false} />
        </SettingSection>
      </ScrollView>
    </View>
  );
}

// ------------------- MAIN SCREEN WITH FIXED HEADER -------------------
function MainScreen({ lang, onOpenSettings, isDarkMode }) {
  const t = translations[lang];
  const [cvs, setCvs] = useState([]);
  const [filteredCvs, setFilteredCvs] = useState([]);
  const [filter, setFilter] = useState('all');
  const [countryFilter, setCountryFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState('');
  
  const scrollY = useRef(new Animated.Value(0)).current;
  const headerFadeAnim = useRef(new Animated.Value(1)).current;

  // Header animation values
  const headerHeight = scrollY.interpolate({
    inputRange: [0, 80],
    outputRange: [110, 70],
    extrapolate: 'clamp',
  });

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 50, 100],
    outputRange: [1, 0.95, 0.9],
    extrapolate: 'clamp',
  });

  const logoScale = scrollY.interpolate({
    inputRange: [0, 80],
    outputRange: [1, 0.8],
    extrapolate: 'clamp',
  });

  const titleOpacity = scrollY.interpolate({
    inputRange: [0, 60, 80],
    outputRange: [1, 0.5, 0],
    extrapolate: 'clamp',
  });

  const categories = [
    { key: 'all', label: t.all, icon: '🌟', color: '#6366f1' },
    { key: 'Returned', label: t.returned, icon: '🔄', color: '#ec489a' },
    { key: 'House Maids', label: t.maids, icon: '🏠', color: '#10b981' },
    { key: 'Cooks', label: t.cooks, icon: '🍳', color: '#f59e0b' },
    { key: 'Drivers', label: t.drivers, icon: '🚗', color: '#3b82f6' },
    { key: 'Nurses', label: t.nurses, icon: '🏥', color: '#ef4444' },
    { key: 'Teachers', label: t.teachers, icon: '📚', color: '#8b5cf6' },
  ];

  const countries = [
    { key: 'ALL', label: t.all_countries, flag: '🌍' },
    { key: 'INDONESIA', label: 'Indonesia', flag: '🇮🇩' },
    { key: 'SRI LANKA', label: 'Sri Lanka', flag: '🇱🇰' },
    { key: 'PHILIPPINES', label: 'Philippines', flag: '🇵🇭' },
    { key: 'BANGLADESH', label: 'Bangladesh', flag: '🇧🇩' },
    { key: 'INDIA', label: 'India', flag: '🇮🇳' },
    { key: 'ETHIOPIA', label: 'Ethiopia', flag: '🇪🇹' },
    { key: 'KENYA', label: 'Kenya', flag: '🇰🇪' },
    { key: 'UGANDA', label: 'Uganda', flag: '🇺🇬' },
  ];

  const loadCVs = async () => {
    try {
      const talents = await fetchTalents();
      if (talents.length > 0) {
        setCvs(talents);
        setFilteredCvs(talents);
        const now = new Date();
        setLastUpdate(`${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}`);
      }
    } catch (error) {
      Alert.alert('Error', t.error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { loadCVs(); }, []);

  useEffect(() => {
    let filtered = [...cvs];
    if (searchQuery.trim()) {
      filtered = filtered.filter(cv => 
        cv.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        cv.nationality.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (filter !== 'all') filtered = filtered.filter(cv => cv.category === filter);
    if (countryFilter !== 'ALL') filtered = filtered.filter(cv => cv.nationality === countryFilter);
    setFilteredCvs(filtered);
  }, [filter, countryFilter, cvs, searchQuery]);

  const stats = {
    total: cvs.length,
  };

  const openCV = async (url) => {
    if (url && url !== 'N/A' && url !== '#') {
      await WebBrowser.openBrowserAsync(url);
    } else {
      Alert.alert('Info', 'CV link not available');
    }
  };

  const openWhatsApp = (candidateName) => {
    const message = encodeURIComponent(`Hi! I'm interested in hiring ${candidateName} from ZOD Manpower.`);
    Linking.openURL(`https://wa.me/97455355206?text=${message}`);
  };

  if (loading) {
    return (
      <LinearGradient colors={isDarkMode ? ['#121212', '#1a1a2e'] : ['#f5f7fa', '#ffffff']} style={styles.container}>
        <StatusBar style={isDarkMode ? 'light' : 'dark'} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#002F66" />
          <Text style={[styles.loadingText, isDarkMode && styles.darkText]}>{t.loading}</Text>
        </View>
      </LinearGradient>
    );
  }

  if (selected) {
    return (
      <ScrollView style={[styles.container, isDarkMode && styles.darkContainer]} showsVerticalScrollIndicator={false}>
        <StatusBar style="light" />
        <LinearGradient colors={['#002F66', '#004A99']} style={styles.detailHeader}>
          <TouchableOpacity onPress={() => setSelected(null)} style={styles.detailBackBtn}>
            <Text style={styles.detailBackText}>← {t.back}</Text>
          </TouchableOpacity>
        </LinearGradient>

        <View style={[styles.detailCard, isDarkMode && styles.darkCard]}>
          <View style={styles.detailImageWrapper}>
            {selected.imageUrl ? (
              <Image source={{ uri: selected.imageUrl }} style={styles.detailImage} />
            ) : (
              <LinearGradient colors={['#e0e0e0', '#d0d0d0']} style={styles.detailImagePlaceholder}>
                <Text style={styles.detailImagePlaceholderText}>👤</Text>
              </LinearGradient>
            )}
          </View>

          <Text style={[styles.detailName, isDarkMode && styles.darkTitle]}>{selected.name}</Text>
          <Text style={[styles.detailCategory, isDarkMode && styles.darkText]}>{selected.subCategory}</Text>

          <View style={styles.detailInfoGrid}>
            <View style={styles.detailInfoItem}><Text style={styles.detailIcon}>📍</Text><Text style={[styles.detailValue, isDarkMode && styles.darkText]}>{selected.nationality}</Text></View>
            <View style={styles.detailInfoItem}><Text style={styles.detailIcon}>👤</Text><Text style={[styles.detailValue, isDarkMode && styles.darkText]}>{selected.gender}</Text></View>
            <View style={styles.detailInfoItem}><Text style={styles.detailIcon}>🎂</Text><Text style={[styles.detailValue, isDarkMode && styles.darkText]}>{selected.age}</Text></View>
            <View style={styles.detailInfoItem}><Text style={styles.detailIcon}>💰</Text><Text style={[styles.detailValue, isDarkMode && styles.darkText]}>{selected.salary}</Text></View>
            <View style={styles.detailInfoItem}><Text style={styles.detailIcon}>💼</Text><Text style={[styles.detailValue, isDarkMode && styles.darkText]}>{selected.experience}</Text></View>
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.viewCVBtn} onPress={() => openCV(selected.cvUrl)}>
              <Text style={styles.viewCVText}>📄 {t.view_cv}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.hireBtn} onPress={() => openWhatsApp(selected.name)}>
              <LinearGradient colors={['#25D366', '#128C7E']} style={styles.hireBtnGradient}>
                <Text style={styles.hireText}>💬 {t.hire}</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    );
  }

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      
      {/* Animated Header */}
      <Animated.View style={[styles.headerContainer, { height: headerHeight, opacity: headerOpacity }]}>
        <LinearGradient colors={['#002F66', '#004A99']} style={styles.headerGradient}>
          <View style={styles.headerContent}>
            <Animated.Image 
              source={{ uri: LOGO_URL }} 
              style={[styles.headerLogo, { transform: [{ scale: logoScale }] }]} 
            />
            <Animated.View style={[styles.headerTextContainer, { opacity: titleOpacity }]}>
              <Text style={styles.headerTitle}>ZOD MANPOWER</Text>
              <Text style={styles.headerSubtitle}>{t.tagline}</Text>
            </Animated.View>
            <TouchableOpacity onPress={onOpenSettings} style={styles.headerSettingsBtn}>
              <Text style={styles.headerSettingsIcon}>⚙️</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </Animated.View>

      {/* Scrollable Content */}
      <Animated.ScrollView 
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: false })}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
      >
        {/* Stats Card - Total Candidates Only */}
        <View style={styles.statsGrid}>
          <LinearGradient colors={['#002F66', '#004A99']} style={styles.statCard}>
            <Text style={styles.statCardIcon}>👥</Text>
            <Text style={styles.statCardNumber}>{stats.total}</Text>
            <Text style={styles.statCardLabel}>{t.total_cvs}</Text>
          </LinearGradient>
        </View>

        {/* Search */}
        <View style={styles.searchWrapper}>
          <LinearGradient colors={isDarkMode ? ['#1e1e2e', '#2a2a3e'] : ['#ffffff', '#f8f9fa']} style={styles.searchContainer}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput 
              style={[styles.searchInput, isDarkMode && styles.darkText]} 
              placeholder={t.search} 
              placeholderTextColor="#999" 
              value={searchQuery} 
              onChangeText={setSearchQuery} 
            />
            {searchQuery !== '' && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Text style={styles.searchClear}>✖</Text>
              </TouchableOpacity>
            )}
          </LinearGradient>
        </View>

        {/* Categories */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll} contentContainerStyle={styles.categoriesScrollContent}>
          {categories.map(cat => (
            <CategoryIcon 
              key={cat.key} 
              icon={cat.icon} 
              label={cat.label} 
              color={cat.color} 
              isActive={filter === cat.key} 
              onPress={() => setFilter(cat.key)} 
            />
          ))}
        </ScrollView>

        {/* Countries */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.countriesScroll} contentContainerStyle={styles.countriesScrollContent}>
          {countries.map(c => (
            <TouchableOpacity key={c.key} onPress={() => setCountryFilter(c.key)} style={[styles.countryChip, countryFilter === c.key && styles.activeCountryChip]}>
              <Text style={styles.countryFlag}>{c.flag}</Text>
              <Text style={[styles.countryName, countryFilter === c.key && styles.activeCountryName]}>{c.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Last Update */}
        <Text style={[styles.lastUpdate, isDarkMode && styles.darkText]}>🕐 {t.last_update}: {lastUpdate}</Text>

        {/* Candidates Grid */}
        <View style={styles.gridContainer}>
          {filteredCvs.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>📭</Text>
              <Text style={[styles.emptyText, isDarkMode && styles.darkText]}>{t.no}</Text>
            </View>
          ) : (
            <View style={styles.gridRow}>
              {filteredCvs.map((item, index) => (
                <CandidateCard key={item.id} item={item} index={index} onPress={() => setSelected(item)} isDarkMode={isDarkMode} t={t} />
              ))}
            </View>
          )}
        </View>
        
        <View style={{ height: 30 }} />
      </Animated.ScrollView>

      <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); loadCVs(); }} colors={['#002F66']} />
    </View>
  );
}

// ------------------- MAIN APP -------------------
export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [screen, setScreen] = useState('language');
  const [lang, setLang] = useState('en');
  const [isDarkMode, setIsDarkMode] = useState(false);

  if (showSplash) return <SplashScreen onFinish={() => setShowSplash(false)} />;
  if (screen === 'language') return <LanguageScreen onSelect={(l) => { setLang(l); setScreen('main'); }} />;
  if (screen === 'settings') return <SettingsScreen lang={lang} onBack={() => setScreen('main')} onLangChange={(l) => { setLang(l); setScreen('main'); }} isDarkMode={isDarkMode} onToggleDarkMode={() => setIsDarkMode(!isDarkMode)} />;
  return <MainScreen lang={lang} onOpenSettings={() => setScreen('settings')} isDarkMode={isDarkMode} />;
}

// ------------------- STYLES -------------------
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f7fa' },
  darkContainer: { backgroundColor: '#121212' },

  // Splash
  splashContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  splashLogoWrapper: { width: 140, height: 140, borderRadius: 70, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 8 },
  splashLogo: { width: 110, height: 110, borderRadius: 55 },
  splashTitle: { fontSize: 28, fontWeight: 'bold', color: '#fff', marginBottom: 5 },
  splashSubtitle: { fontSize: 14, color: '#fff', opacity: 0.8 },

  // Language
  languageContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  logoWrapper: { marginBottom: 20 },
  logoGradient: { width: 130, height: 130, borderRadius: 65, alignItems: 'center', justifyContent: 'center' },
  logo: { width: 110, height: 110, borderRadius: 55 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#002F66', marginBottom: 5 },
  tagline: { fontSize: 12, color: '#666', marginBottom: 40 },
  selectText: { fontSize: 16, color: '#333', marginBottom: 20 },
  langBtn: { width: '80%', marginVertical: 10, borderRadius: 30, overflow: 'hidden' },
  langBtnGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 15, gap: 10 },
  langBtnText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  langFlag: { fontSize: 20 },

  // Header (Fixed + Animated)
  headerContainer: { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 100, overflow: 'hidden' },
  headerGradient: { flex: 1, borderBottomLeftRadius: 25, borderBottomRightRadius: 25 },
  headerContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, flex: 1 },
  headerLogo: { width: 45, height: 45, borderRadius: 22, borderWidth: 2, borderColor: '#fff' },
  headerTextContainer: { alignItems: 'center' },
  headerTitle: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  headerSubtitle: { color: '#fff', fontSize: 10, opacity: 0.8 },
  headerSettingsBtn: { padding: 8 },
  headerSettingsIcon: { fontSize: 22, color: '#fff' },

  scrollView: { flex: 1, marginTop: 110 },

  // Stats - Single card full width
  statsGrid: { flexDirection: 'row', paddingHorizontal: 15, marginTop: 15 },
  statCard: { flex: 1, borderRadius: 16, padding: 12, alignItems: 'center', elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  statCardIcon: { fontSize: 24, color: '#fff', marginBottom: 4 },
  statCardNumber: { fontSize: 28, fontWeight: 'bold', color: '#fff' },
  statCardLabel: { fontSize: 10, color: '#fff', opacity: 0.8, marginTop: 2 },

  // Search
  searchWrapper: { paddingHorizontal: 15, marginTop: 15 },
  searchContainer: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, paddingVertical: 12, borderRadius: 30, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4 },
  searchIcon: { fontSize: 16, marginRight: 10, color: '#999' },
  searchInput: { flex: 1, fontSize: 14 },
  searchClear: { fontSize: 16, color: '#999', padding: 5 },

  // Categories
  categoriesScroll: { marginTop: 15 },
  categoriesScrollContent: { paddingHorizontal: 15, gap: 12 },
  categoryIconBtn: { alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 25, borderWidth: 1, borderColor: '#e0e0e0' },
  categoryIconBtnActive: { borderWidth: 0 },
  categoryIconEmoji: { fontSize: 18, marginBottom: 4 },
  categoryIconLabel: { fontSize: 11, color: '#666', fontWeight: '500' },
  categoryIconLabelActive: { color: '#fff' },

  // Countries
  countriesScroll: { marginTop: 12 },
  countriesScrollContent: { paddingHorizontal: 15, gap: 8 },
  countryChip: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f0f0f0', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, gap: 5 },
  activeCountryChip: { backgroundColor: '#002F66' },
  countryFlag: { fontSize: 12 },
  countryName: { fontSize: 11, color: '#666' },
  activeCountryName: { color: '#fff' },

  lastUpdate: { textAlign: 'center', fontSize: 9, color: '#999', marginVertical: 12 },

  // Grid
  gridContainer: { paddingHorizontal: 10 },
  gridRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },

  // Card
  card: { borderRadius: 20, overflow: 'hidden', elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 4 },
  cardImageWrapper: { position: 'relative' },
  cardImage: { width: '100%', height: 140 },
  cardImagePlaceholder: { width: '100%', height: 140, alignItems: 'center', justifyContent: 'center' },
  cardImagePlaceholderText: { fontSize: 50 },
  cardBadgeReturned: { position: 'absolute', top: 8, left: 8, backgroundColor: '#ec489a', paddingHorizontal: 6, paddingVertical: 3, borderRadius: 12 },
  cardBadgeReturnedText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  cardBadgeStatus: { position: 'absolute', top: 8, right: 8, backgroundColor: '#10b981', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 12 },
  cardBadgeStatusText: { color: '#fff', fontSize: 9, fontWeight: 'bold' },
  cardContent: { padding: 12 },
  cardName: { fontSize: 14, fontWeight: 'bold', marginBottom: 4 },
  cardCategory: { fontSize: 11, color: '#002F66', fontWeight: '500', marginBottom: 6 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardCountry: { backgroundColor: '#eef2ff', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 12 },
  cardCountryText: { fontSize: 9, color: '#002F66', fontWeight: '500' },
  cardSalary: { fontSize: 11, color: '#002F66', fontWeight: 'bold' },

  // Settings
  settingsHeader: { paddingTop: 50, paddingBottom: 30, alignItems: 'center', borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
  settingsBackBtn: { position: 'absolute', top: 50, left: 20, zIndex: 1 },
  settingsBackText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  settingsHeaderLogo: { width: 60, height: 60, borderRadius: 30, marginBottom: 10 },
  settingsHeaderTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  settingsHeaderVersion: { color: '#fff', fontSize: 12, opacity: 0.8, marginTop: 4 },
  settingsContent: { flex: 1, marginTop: -20 },
  settingsCard: { backgroundColor: '#fff', margin: 15, borderRadius: 20, padding: 20, elevation: 2 },
  darkCard: { backgroundColor: '#1e1e2e' },
  settingsSectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#666', marginBottom: 15 },
  settingItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  settingItemLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  settingItemIcon: { fontSize: 18 },
  settingItemLabel: { fontSize: 15, color: '#333' },
  settingItemArrow: { fontSize: 16, color: '#ccc' },
  
  // Language Selector
  languageSelector: { flexDirection: 'row', gap: 12, marginTop: 5 },
  langSelectorBtn: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 12, backgroundColor: '#f0f0f0' },
  activeLangSelector: { backgroundColor: '#002F66' },
  langSelectorText: { fontSize: 14, color: '#666' },
  activeLangSelectorText: { color: '#fff' },

  // Detail
  detailHeader: { paddingTop: 50, paddingBottom: 20, paddingHorizontal: 20, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
  detailBackBtn: { alignSelf: 'flex-start' },
  detailBackText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  detailCard: { backgroundColor: '#fff', margin: 15, borderRadius: 24, padding: 20, marginTop: -20, elevation: 4 },
  detailImageWrapper: { alignItems: 'center', marginBottom: 15 },
  detailImage: { width: '100%', height: 220, borderRadius: 20 },
  detailImagePlaceholder: { width: '100%', height: 220, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  detailImagePlaceholderText: { fontSize: 70 },
  detailName: { fontSize: 24, fontWeight: 'bold', color: '#333', textAlign: 'center', marginBottom: 5 },
  detailCategory: { fontSize: 14, color: '#002F66', fontWeight: 'bold', textAlign: 'center', marginBottom: 15 },
  detailInfoGrid: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 10 },
  detailInfoItem: { width: '50%', flexDirection: 'row', alignItems: 'center', paddingVertical: 8, gap: 8 },
  detailIcon: { fontSize: 16 },
  detailValue: { flex: 1, fontSize: 13, color: '#333', fontWeight: '500' },
  buttonRow: { flexDirection: 'row', gap: 12, marginTop: 20 },
  viewCVBtn: { flex: 1, backgroundColor: '#e0e0e0', paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  viewCVText: { fontWeight: 'bold', color: '#333' },
  hireBtn: { flex: 1, borderRadius: 12, overflow: 'hidden' },
  hireBtnGradient: { paddingVertical: 14, alignItems: 'center' },
  hireText: { fontWeight: 'bold', color: '#fff' },

  // Loading & Empty
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 10, color: '#666' },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60 },
  emptyIcon: { fontSize: 50, marginBottom: 10 },
  emptyText: { fontSize: 16, color: '#999' },

  darkTitle: { color: '#fff' },
  darkText: { color: '#ccc' },
});
