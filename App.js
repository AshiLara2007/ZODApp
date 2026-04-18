import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, FlatList, Image,
  StyleSheet, ScrollView, Switch, ActivityIndicator,
  Alert, Linking, RefreshControl, Modal, TextInput
} from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { StatusBar } from 'expo-status-bar';

// ------------------- API URL -------------------
const API_URL = 'https://zodmanpower.info/api/talents';

// ------------------- VERSION -------------------
const APP_VERSION = '1.0.3';

// ------------------- TRANSLATIONS -------------------
const translations = {
  en: {
    select: 'Select Language',
    settings: 'Settings',
    dark_mode: 'Dark Mode',
    language: 'Language',
    version: 'Version',
    maids: 'House Maids',
    drivers: 'Drivers',
    returned: 'Returned Housemaids',
    nurses: 'Nurses',
    teachers: 'Teachers',
    cooks: 'Cooks',
    all: 'All CVs',
    no: 'No CVs found',
    loading: 'Loading CVs from database...',
    details: 'CV Details',
    back: 'Back',
    name: 'Name',
    cat: 'Category',
    nat: 'Nationality',
    salary: 'Salary',
    age: 'Age',
    gender: 'Gender',
    status: 'Status',
    view_cv: 'View CV',
    hire: 'Hire via WhatsApp',
    error: 'Failed to load CVs. Pull down to refresh.',
    last_update: 'Last updated',
    total_cvs: 'Total CVs',
    experience: 'Experience',
    marital: 'Marital Status',
    worker_type: 'Worker Type',
    filter_by_country: 'Filter By Country',
    about: 'About',
    contact: 'Contact Us',
    privacy: 'Privacy Policy',
    terms: 'Terms of Service',
    call: 'Call Us',
    email: 'Email Us',
    website: 'Visit Website',
    share: 'Share App',
    rate: 'Rate App',
    search: 'Search by name...',
    clear: 'Clear',
    recruit: 'Recruitment Workers',
    returned_label: 'Returned Housemaids',
    all_countries: 'All Countries',
    featured: 'Featured',
    more_info: 'More Info',
    call_now: 'Call Now',
    ready: 'Ready',
  },
  ar: {
    select: 'اختر اللغة',
    settings: 'الإعدادات',
    dark_mode: 'الوضع الداكن',
    language: 'اللغة',
    version: 'الإصدار',
    maids: 'خادمات',
    drivers: 'سائقين',
    returned: 'خادمات عائدات',
    nurses: 'ممرضين',
    teachers: 'معلمين',
    cooks: 'طهاة',
    all: 'جميع السير الذاتية',
    no: 'لا توجد سير ذاتية',
    loading: 'جاري التحميل...',
    details: 'تفاصيل السيرة الذاتية',
    back: 'رجوع',
    name: 'الاسم',
    cat: 'الفئة',
    nat: 'الجنسية',
    salary: 'الراتب',
    age: 'العمر',
    gender: 'الجنس',
    status: 'الحالة',
    view_cv: 'عرض السيرة الذاتية',
    hire: 'توظيف عبر واتساب',
    error: 'فشل التحميل. اسحب للتحديث',
    last_update: 'آخر تحديث',
    total_cvs: 'إجمالي السير الذاتية',
    experience: 'الخبرة',
    marital: 'الحالة الاجتماعية',
    worker_type: 'نوع العامل',
    filter_by_country: 'تصفية حسب البلد',
    about: 'من نحن',
    contact: 'اتصل بنا',
    privacy: 'سياسة الخصوصية',
    terms: 'شروط الخدمة',
    call: 'اتصل بنا',
    email: 'راسلنا',
    website: 'زيارة الموقع',
    share: 'مشاركة التطبيق',
    rate: 'تقييم التطبيق',
    search: 'ابحث بالاسم...',
    clear: 'مسح',
    recruit: 'عمال التوظيف',
    returned_label: 'خادمات عائدات',
    all_countries: 'جميع الدول',
    featured: 'مميز',
    more_info: 'مزيد من المعلومات',
    call_now: 'اتصل الآن',
    ready: 'جاهز',
  }
};

// Country list for filter
const COUNTRIES = [
  'ALL', 'INDONESIA', 'SRI LANKA', 'PHILIPPINES', 'BANGLADESH',
  'INDIA', 'ETHIOPIA', 'KENYA', 'UGANDA'
];

// Map job to category
const mapJobToCategory = (talent) => {
  if (talent.workerType === 'Returned Housemaids') {
    return 'Returned Housemaids';
  }

  const job = talent.job || '';
  const lowerJob = job.toLowerCase();

  if (lowerJob.includes('maid') || lowerJob.includes('housemaid') || lowerJob.includes('domestic')) {
    return 'House Maids';
  } else if (lowerJob.includes('cook')) {
    return 'Cooks';
  } else if (lowerJob.includes('driver')) {
    return 'Drivers';
  } else if (lowerJob.includes('nurse')) {
    return 'Nurses';
  } else if (lowerJob.includes('teacher')) {
    return 'Teachers';
  }
  return 'Recruitment Workers';
};

// Fetch talents from API
const fetchTalents = async () => {
  try {
    const response = await fetch(API_URL, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const data = await response.json();
    let talents = Array.isArray(data) ? data : (data.data || []);

    return talents.map(t => ({
      id: t.id || t._id,
      name: t.name || 'N/A',
      category: mapJobToCategory(t),
      subCategory: t.job || 'General',
      nationality: (t.country || 'N/A').toUpperCase(),
      gender: t.gender || 'N/A',
      age: t.age ? `${t.age} Years` : 'N/A',
      salary: t.salary ? `${t.salary} QAR` : 'N/A',
      experience: t.experience || 'N/A',
      status: 'Ready',
      imageUrl: t.pic || '',
      cvUrl: t.cv || '',
      maritalStatus: t.maritalStatus || 'N/A',
      workerType: t.workerType || 'Recruitment Workers',
      phone: '+97455355206'
    }));
  } catch (error) {
    console.error('API error:', error);
    return [];
  }
};

// ------------------- LANGUAGE SCREEN -------------------
function LanguageScreen({ onSelect }) {
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.languageContainer}>
        <Image
          source={{ uri: 'https://raw.githubusercontent.com/AshiLara2007/ZOD-Photos/main/ZOD%20LOGO%20(1).png' }}
          style={styles.logo}
        />
        <Text style={styles.title}>ZOD MANPOWER</Text>
        <Text style={styles.subtitle}>Recruitment Agency</Text>
        <Text style={styles.selectText}>{translations.en.select}</Text>

        <TouchableOpacity style={styles.langBtn} onPress={() => onSelect('en')}>
          <Text style={styles.langBtnText}>English</Text>
          <Text style={styles.langBtnSub}>🇬🇧</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.langBtn} onPress={() => onSelect('ar')}>
          <Text style={styles.langBtnText}>العربية</Text>
          <Text style={styles.langBtnSub}>🇸🇦</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ------------------- SETTINGS SCREEN -------------------
function SettingsScreen({ lang, onBack, onLangChange, isDarkMode, onToggleDarkMode }) {
  const t = translations[lang];

  const handleShare = async () => {
    try {
      await Share.share({
        message: 'Check out ZOD Manpower Recruitment App! Find the best candidates for your needs. https://zodmanpower.info',
        title: 'ZOD Manpower App'
      });
    } catch (error) {
      console.log('Share error:', error);
    }
  };

  const handleRate = () => {
    Linking.openURL('https://play.google.com/store/apps/details?id=com.zod.manpower');
  };

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      <View style={[styles.settingsCard, isDarkMode && styles.darkCard]}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={[styles.backText, isDarkMode && styles.darkText]}>← {t.back}</Text>
        </TouchableOpacity>

        <View style={styles.settingsHeader}>
          <Image
            source={{ uri: 'https://raw.githubusercontent.com/AshiLara2007/ZOD-Photos/main/ZOD%20LOGO%20(1).png' }}
            style={styles.settingsLogo}
          />
          <Text style={[styles.settingsTitle, isDarkMode && styles.darkTitle]}>ZOD MANPOWER</Text>
          <Text style={[styles.settingsVersion, isDarkMode && styles.darkText]}>{t.version} {APP_VERSION}</Text>
        </View>

        <View style={styles.settingsSection}>
          <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>Preferences</Text>

          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingIcon}>🌙</Text>
              <Text style={[styles.settingLabel, isDarkMode && styles.darkText]}>{t.dark_mode}</Text>
            </View>
            <Switch value={isDarkMode} onValueChange={onToggleDarkMode} trackColor={{ false: '#767577', true: '#002F66' }} thumbColor={isDarkMode ? '#fff' : '#f4f3f4'} />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingIcon}>🌐</Text>
              <Text style={[styles.settingLabel, isDarkMode && styles.darkText]}>{t.language}</Text>
            </View>
            <View style={styles.languageButtons}>
              <TouchableOpacity style={[styles.langOption, lang === 'en' && styles.activeLangOption]} onPress={() => onLangChange('en')}>
                <Text style={[styles.langOptionText, lang === 'en' && styles.activeLangText]}>EN</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.langOption, lang === 'ar' && styles.activeLangOption]} onPress={() => onLangChange('ar')}>
                <Text style={[styles.langOptionText, lang === 'ar' && styles.activeLangText]}>AR</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.settingsSection}>
          <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>About</Text>

          <TouchableOpacity style={styles.settingRow} onPress={() => Linking.openURL('https://zodmanpower.info')}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingIcon}>🌐</Text>
              <Text style={[styles.settingLabel, isDarkMode && styles.darkText]}>{t.website}</Text>
            </View>
            <Text style={styles.settingArrow}>→</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingRow} onPress={() => Linking.openURL('tel:+97455355206')}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingIcon}>📞</Text>
              <Text style={[styles.settingLabel, isDarkMode && styles.darkText]}>{t.call}</Text>
            </View>
            <Text style={styles.settingArrow}>→</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingRow} onPress={() => Linking.openURL('mailto:info@zodmanpower.info')}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingIcon}>✉️</Text>
              <Text style={[styles.settingLabel, isDarkMode && styles.darkText]}>{t.email}</Text>
            </View>
            <Text style={styles.settingArrow}>→</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.settingsSection}>
          <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>Support</Text>

          <TouchableOpacity style={styles.settingRow} onPress={handleShare}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingIcon}>📤</Text>
              <Text style={[styles.settingLabel, isDarkMode && styles.darkText]}>{t.share}</Text>
            </View>
            <Text style={styles.settingArrow}>→</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingRow} onPress={handleRate}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingIcon}>⭐</Text>
              <Text style={[styles.settingLabel, isDarkMode && styles.darkText]}>{t.rate}</Text>
            </View>
            <Text style={styles.settingArrow}>→</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

// ------------------- MAIN SCREEN -------------------
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
  const [showSearch, setShowSearch] = useState(false);

  const loadCVs = async () => {
    try {
      const talents = await fetchTalents();
      if (talents.length > 0) {
        setCvs(talents);
        setFilteredCvs(talents);
        const now = new Date();
        setLastUpdate(`${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}:${now.getSeconds().toString().padStart(2,'0')}`);
      }
    } catch (error) {
      Alert.alert('Error', t.error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadCVs();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadCVs();
  };

  // Category filters - All CVs, Returned Housemaids, House Maids, Cooks, Drivers, Nurses, Teachers
  const categoryFilters = [
    { key: 'all', label: t.all, icon: '📋', color: '#6366f1' },
    { key: 'Returned Housemaids', label: t.returned, icon: '🔄', color: '#ec489a' },
    { key: 'House Maids', label: t.maids, icon: '🏠', color: '#10b981' },
    { key: 'Cooks', label: t.cooks, icon: '🍳', color: '#f59e0b' },
    { key: 'Drivers', label: t.drivers, icon: '🚗', color: '#3b82f6' },
    { key: 'Nurses', label: t.nurses, icon: '🏥', color: '#ef4444' },
    { key: 'Teachers', label: t.teachers, icon: '📚', color: '#8b5cf6' },
  ];

  // Stats filters - Total CVs, Recruitment Workers, Returned Workers, Filter By Country
  const statsFilters = [
    { key: 'total', label: t.total_cvs, icon: '📊', color: '#002F66' },
    { key: 'recruitment', label: t.recruit, icon: '👥', color: '#10b981' },
    { key: 'returned', label: t.returned_label, icon: '🔄', color: '#ec489a' },
    { key: 'country', label: t.filter_by_country, icon: '🌍', color: '#f59e0b' },
  ];

  // Country filters
  const countryFilters = [
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

  // Apply filters
  useEffect(() => {
    let filtered = [...cvs];

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(cv =>
        cv.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply category filter
    if (filter !== 'all') {
      filtered = filtered.filter(cv => cv.category === filter);
    }

    // Apply country filter
    if (countryFilter !== 'ALL') {
      filtered = filtered.filter(cv => cv.nationality === countryFilter);
    }

    setFilteredCvs(filtered);
  }, [filter, countryFilter, cvs, searchQuery]);

  // Get stats
  const stats = {
    total: cvs.length,
    returned: cvs.filter(cv => cv.workerType === 'Returned Housemaids' || cv.category === 'Returned Housemaids').length,
    recruitment: cvs.filter(cv => cv.workerType === 'Recruitment Workers' && cv.category !== 'Returned Housemaids').length,
    countries: [...new Set(cvs.map(cv => cv.nationality))].length
  };

  // Open CV in-app browser
  const openCV = async (url) => {
    if (url && url !== 'N/A' && url !== '#') {
      try {
        await WebBrowser.openBrowserAsync(url, {
          presentationStyle: WebBrowser.WebBrowserPresentationStyle.FULL_SCREEN,
          toolbarColor: '#002F66',
          controlsColor: '#FFFFFF'
        });
      } catch (error) {
        Alert.alert('Error', 'Could not open CV');
      }
    } else {
      Alert.alert('Info', 'CV link not available');
    }
  };

  // Open WhatsApp chat directly
  const openWhatsApp = (candidateName) => {
    const phoneNumber = '97455355206';
    const message = encodeURIComponent(`Hi! I am interested in hiring ${candidateName} from ZOD Manpower. Can you please provide more details?`);
    const url = `whatsapp://send?phone=${phoneNumber}&text=${message}`;

    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        return Linking.openURL(url);
      } else {
        const webUrl = `https://wa.me/${phoneNumber}?text=${message}`;
        return Linking.openURL(webUrl);
      }
    }).catch(() => {
      Alert.alert('Error', 'WhatsApp is not installed on your device');
    });
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer, isDarkMode && styles.darkContainer]}>
        <StatusBar style={isDarkMode ? 'light' : 'dark'} />
        <ActivityIndicator size="large" color="#002F66" />
        <Text style={[styles.loadingText, isDarkMode && styles.darkText]}>{t.loading}</Text>
      </View>
    );
  }

  if (selected) {
    return (
      <ScrollView style={[styles.container, isDarkMode && styles.darkContainer]}>
        <StatusBar style={isDarkMode ? 'light' : 'dark'} />
        <View style={[styles.detailCard, isDarkMode && styles.darkCard]}>
          <TouchableOpacity onPress={() => setSelected(null)} style={styles.backBtn}>
            <Text style={[styles.backText, isDarkMode && styles.darkText]}>← {t.back}</Text>
          </TouchableOpacity>

          {selected.imageUrl ? (
            <Image source={{ uri: selected.imageUrl }} style={styles.detailImage} />
          ) : (
            <View style={styles.detailImagePlaceholder}>
              <Text style={styles.detailImagePlaceholderText}>👤</Text>
            </View>
          )}

          <Text style={[styles.detailName, isDarkMode && styles.darkTitle]}>{selected.name}</Text>
          <Text style={[styles.detailCategory, isDarkMode && styles.darkText]}>{selected.subCategory}</Text>

          {selected.workerType === 'Returned Housemaids' && (
            <View style={styles.returnedBadge}>
              <Text style={styles.returnedBadgeText}>🔄 {t.returned_label}</Text>
            </View>
          )}

          <View style={styles.detailInfoGrid}>
            <View style={styles.detailInfoItem}>
              <Text style={styles.detailIcon}>📍</Text>
              <Text style={[styles.detailLabel, isDarkMode && styles.darkText]}>{t.nat}</Text>
              <Text style={[styles.detailValue, isDarkMode && styles.darkText]}>{selected.nationality}</Text>
            </View>

            <View style={styles.detailInfoItem}>
              <Text style={styles.detailIcon}>👤</Text>
              <Text style={[styles.detailLabel, isDarkMode && styles.darkText]}>{t.gender}</Text>
              <Text style={[styles.detailValue, isDarkMode && styles.darkText]}>{selected.gender}</Text>
            </View>

            <View style={styles.detailInfoItem}>
              <Text style={styles.detailIcon}>🎂</Text>
              <Text style={[styles.detailLabel, isDarkMode && styles.darkText]}>{t.age}</Text>
              <Text style={[styles.detailValue, isDarkMode && styles.darkText]}>{selected.age}</Text>
            </View>

            <View style={styles.detailInfoItem}>
              <Text style={styles.detailIcon}>💰</Text>
              <Text style={[styles.detailLabel, isDarkMode && styles.darkText]}>{t.salary}</Text>
              <Text style={[styles.detailValue, isDarkMode && styles.darkText]}>{selected.salary}</Text>
            </View>

            <View style={styles.detailInfoItem}>
              <Text style={styles.detailIcon}>💼</Text>
              <Text style={[styles.detailLabel, isDarkMode && styles.darkText]}>{t.experience}</Text>
              <Text style={[styles.detailValue, isDarkMode && styles.darkText]}>{selected.experience}</Text>
            </View>

            <View style={styles.detailInfoItem}>
              <Text style={styles.detailIcon}>✅</Text>
              <Text style={[styles.detailLabel, isDarkMode && styles.darkText]}>{t.status}</Text>
              <Text style={[styles.detailValue, styles.statusBadge]}>{selected.status}</Text>
            </View>
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.viewCVBtn} onPress={() => openCV(selected.cvUrl)}>
              <Text style={styles.viewCVText}>📄 {t.view_cv}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.hireBtn} onPress={() => openWhatsApp(selected.name)}>
              <Text style={styles.hireText}>💬 {t.hire}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    );
  }

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />

      {/* Header */}
      <View style={[styles.header, isDarkMode && styles.darkHeader]}>
        <Image
          source={{ uri: 'https://raw.githubusercontent.com/AshiLara2007/ZOD-Photos/main/ZOD%20LOGO%20(1).png' }}
          style={styles.headerLogo}
        />
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>ZOD MANPOWER</Text>
          <Text style={styles.headerSubtitle}>Recruitment Agency</Text>
        </View>
        <View style={styles.headerIcons}>
          <TouchableOpacity onPress={() => setShowSearch(!showSearch)} style={styles.headerIcon}>
            <Text style={styles.headerIconText}>🔍</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onOpenSettings} style={styles.headerIcon}>
            <Text style={styles.headerIconText}>⚙️</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      {showSearch && (
        <View style={[styles.searchContainer, isDarkMode && styles.darkSearch]}>
          <TextInput
            style={[styles.searchInput, isDarkMode && styles.darkText]}
            placeholder={t.search}
            placeholderTextColor={isDarkMode ? '#888' : '#999'}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery !== '' && (
            <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.searchClear}>
              <Text style={styles.searchClearText}>✖</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Stats Buttons - Equal sized */}
      <View style={styles.statsContainer}>
        {statsFilters.map(stat => (
          <TouchableOpacity
            key={stat.key}
            style={[styles.statButton, { backgroundColor: stat.color }]}
            onPress={() => {
              if (stat.key === 'total') setFilter('all');
              else if (stat.key === 'recruitment') setFilter('Recruitment Workers');
              else if (stat.key === 'returned') setFilter('Returned Housemaids');
              else if (stat.key === 'country') {
                // Scroll to country filter
              }
            }}
            activeOpacity={0.8}
          >
            <Text style={styles.statButtonIcon}>{stat.icon}</Text>
            <Text style={styles.statButtonLabel}>{stat.label}</Text>
            <Text style={styles.statButtonNumber}>
              {stat.key === 'total' ? stats.total :
               stat.key === 'recruitment' ? stats.recruitment :
               stat.key === 'returned' ? stats.returned :
               stats.countries}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Category Filter Buttons - Equal sized */}
      <View style={styles.filterSection}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScrollContent}
        >
          {categoryFilters.map(f => (
            <TouchableOpacity
              key={f.key}
              style={[
                styles.categoryFilterBtn,
                filter === f.key && { backgroundColor: f.color, borderWidth: 0 }
              ]}
              onPress={() => setFilter(f.key)}
              activeOpacity={0.7}
            >
              <Text style={styles.categoryFilterIcon}>{f.icon}</Text>
              <Text style={[
                styles.categoryFilterText,
                filter === f.key && styles.activeFilterText
              ]}>
                {f.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Country Filter */}
      <View style={styles.countryFilterSection}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScrollContent}
        >
          {countryFilters.map(c => (
            <TouchableOpacity
              key={c.key}
              style={[
                styles.countryFilterBtn,
                countryFilter === c.key && styles.activeCountryFilter
              ]}
              onPress={() => setCountryFilter(c.key)}
              activeOpacity={0.7}
            >
              <Text style={styles.countryFlag}>{c.flag}</Text>
              <Text style={[
                styles.countryFilterText,
                countryFilter === c.key && styles.activeFilterText
              ]}>
                {c.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Last Update */}
      <View style={styles.updateRow}>
        <Text style={[styles.updateText, isDarkMode && styles.darkText]}>
          🕐 {t.last_update}: {lastUpdate}
        </Text>
      </View>

      {/* CV Grid */}
      <FlatList
        data={filteredCvs}
        renderItem={({ item, index }) => (
          <TouchableOpacity style={[styles.cvCard, isDarkMode && styles.darkCard]} onPress={() => setSelected(item)} activeOpacity={0.8}>
            <View style={styles.cvHeader}>
              {item.imageUrl ? (
                <Image source={{ uri: item.imageUrl }} style={styles.cvImage} />
              ) : (
                <View style={styles.cvImagePlaceholder}>
                  <Text style={styles.cvImagePlaceholderText}>👤</Text>
                </View>
              )}
              {item.workerType === 'Returned Housemaids' && (
                <View style={styles.cvReturnedBadge}>
                  <Text style={styles.cvReturnedBadgeText}>🔄</Text>
                </View>
              )}
              <View style={styles.cvStatus}>
                <Text style={styles.cvStatusText}>{t.ready}</Text>
              </View>
            </View>
            <Text style={[styles.cvName, isDarkMode && styles.darkTitle]} numberOfLines={1}>{item.name}</Text>
            <Text style={[styles.cvCategory, isDarkMode && styles.darkText]} numberOfLines={1}>{item.subCategory}</Text>
            <View style={styles.cvFooter}>
              <View style={styles.countryBadge}>
                <Text style={styles.countryBadgeText}>{item.nationality}</Text>
              </View>
              <Text style={[styles.cvSalary, isDarkMode && styles.darkText]}>{item.salary}</Text>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={item => item.id}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📭</Text>
            <Text style={[styles.emptyText, isDarkMode && styles.darkText]}>{t.no}</Text>
          </View>
        }
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#002F66']} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

// ------------------- MAIN APP -------------------
export default function App() {
  const [screen, setScreen] = useState('language');
  const [lang, setLang] = useState('en');
  const [isDarkMode, setIsDarkMode] = useState(false);

  if (screen === 'language') {
    return <LanguageScreen onSelect={(l) => { setLang(l); setScreen('main'); }} />;
  }

  if (screen === 'settings') {
    return (
      <SettingsScreen
        lang={lang}
        onBack={() => setScreen('main')}
        onLangChange={(l) => { setLang(l); setScreen('main'); }}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
      />
    );
  }

  return (
    <MainScreen
      lang={lang}
      onOpenSettings={() => setScreen('settings')}
      isDarkMode={isDarkMode}
    />
  );
}

// ------------------- STYLES -------------------
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  darkContainer: { backgroundColor: '#121212' },

  // Language Screen
  languageContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  logo: { width: 120, height: 120, borderRadius: 60, marginBottom: 20 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#002F66', marginBottom: 5 },
  subtitle: { fontSize: 14, color: '#666', marginBottom: 40 },
  selectText: { fontSize: 16, color: '#333', marginBottom: 20 },
  langBtn: { backgroundColor: '#002F66', paddingHorizontal: 40, paddingVertical: 15, borderRadius: 30, marginVertical: 10, width: '80%', alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 10 },
  langBtnText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  langBtnSub: { color: 'white', fontSize: 14 },

  // Loading
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 10, color: '#333' },

  // Header
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, backgroundColor: '#002F66' },
  darkHeader: { backgroundColor: '#1a1a2e' },
  headerLogo: { width: 45, height: 45, borderRadius: 22 },
  headerTitleContainer: { alignItems: 'center' },
  headerTitle: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  headerSubtitle: { color: 'white', fontSize: 10, opacity: 0.8 },
  headerIcons: { flexDirection: 'row', gap: 15 },
  headerIcon: { padding: 5 },
  headerIconText: { fontSize: 20 },

  // Search
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', margin: 12, paddingHorizontal: 15, borderRadius: 30, elevation: 2 },
  darkSearch: { backgroundColor: '#1e1e1e', borderWidth: 1, borderColor: '#333' },
  searchInput: { flex: 1, paddingVertical: 12, fontSize: 14, color: '#333' },
  searchClear: { padding: 5 },
  searchClearText: { fontSize: 16, color: '#999' },

  // Stats Container - Equal sized buttons
  statsContainer: { flexDirection: 'row', paddingHorizontal: 12, marginTop: 10, gap: 8 },
  statButton: { flex: 1, paddingVertical: 12, borderRadius: 12, alignItems: 'center', justifyContent: 'center', elevation: 2 },
  statButtonIcon: { fontSize: 20, color: 'white', marginBottom: 4 },
  statButtonLabel: { fontSize: 10, color: 'white', fontWeight: 'bold', textAlign: 'center' },
  statButtonNumber: { fontSize: 16, color: 'white', fontWeight: 'bold', marginTop: 2 },

  // Category Filters
  filterSection: { marginTop: 12 },
  countryFilterSection: { marginTop: 8, marginBottom: 4 },
  filterScrollContent: { paddingHorizontal: 12, paddingVertical: 6 },

  categoryFilterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 10,
    borderRadius: 30,
    gap: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  categoryFilterIcon: { fontSize: 14 },
  categoryFilterText: { color: '#333', fontWeight: '600', fontSize: 12 },
  activeFilterText: { color: '#fff' },

  countryFilterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e8e8e8',
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 25,
    gap: 6,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  countryFlag: { fontSize: 12 },
  countryFilterText: { color: '#444', fontWeight: '500', fontSize: 11 },
  activeCountryFilter: { backgroundColor: '#002F66' },

  updateRow: { alignItems: 'center', marginVertical: 5 },
  updateText: { fontSize: 9, color: '#999' },

  // CV Card
  columnWrapper: { justifyContent: 'space-between', paddingHorizontal: 10 },
  listContent: { paddingBottom: 20 },
  cvCard: { backgroundColor: '#fff', margin: 6, padding: 12, borderRadius: 16, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, width: '47%' },
  darkCard: { backgroundColor: '#1e1e1e' },
  cvHeader: { position: 'relative', marginBottom: 10 },
  cvImage: { width: '100%', height: 130, borderRadius: 12 },
  cvImagePlaceholder: { width: '100%', height: 130, borderRadius: 12, backgroundColor: '#e0e0e0', justifyContent: 'center', alignItems: 'center' },
  cvImagePlaceholderText: { fontSize: 40 },
  cvReturnedBadge: { position: 'absolute', top: 8, left: 8, backgroundColor: '#ec489a', paddingHorizontal: 6, paddingVertical: 3, borderRadius: 12 },
  cvReturnedBadgeText: { color: 'white', fontSize: 10, fontWeight: 'bold' },
  cvStatus: { position: 'absolute', top: 8, right: 8, backgroundColor: '#10b981', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 15 },
  cvStatusText: { color: 'white', fontSize: 9, fontWeight: 'bold' },
  cvName: { fontSize: 14, fontWeight: 'bold', marginBottom: 4, color: '#333' },
  cvCategory: { fontSize: 11, color: '#002F66', fontWeight: 'bold', marginBottom: 6 },
  cvFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 },
  countryBadge: { backgroundColor: '#eef2ff', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 12 },
  countryBadgeText: { fontSize: 9, color: '#002F66', fontWeight: '500' },
  cvSalary: { fontSize: 11, color: '#002F66', fontWeight: 'bold' },

  emptyContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60 },
  emptyIcon: { fontSize: 50, marginBottom: 10 },
  emptyText: { textAlign: 'center', fontSize: 16, color: '#666' },

  // Settings
  settingsCard: { flex: 1, backgroundColor: '#fff', margin: 15, borderRadius: 24, padding: 20 },
  backButton: { marginBottom: 15 },
  backText: { fontSize: 16, color: '#002F66', fontWeight: 'bold' },
  settingsHeader: { alignItems: 'center', marginBottom: 25 },
  settingsLogo: { width: 70, height: 70, borderRadius: 35, marginBottom: 10 },
  settingsTitle: { fontSize: 20, fontWeight: 'bold', color: '#002F66' },
  settingsVersion: { fontSize: 12, color: '#666', marginTop: 4 },
  settingsSection: { marginBottom: 25 },
  sectionTitle: { fontSize: 14, fontWeight: 'bold', color: '#666', marginBottom: 12, textTransform: 'uppercase' },
  settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  settingLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  settingIcon: { fontSize: 18 },
  settingLabel: { fontSize: 15, color: '#333' },
  settingArrow: { fontSize: 16, color: '#ccc' },
  languageButtons: { flexDirection: 'row', gap: 10 },
  langOption: { paddingHorizontal: 15, paddingVertical: 6, borderRadius: 20, backgroundColor: '#f0f0f0' },
  activeLangOption: { backgroundColor: '#002F66' },
  langOptionText: { fontSize: 12, fontWeight: 'bold', color: '#333' },
  activeLangText: { color: '#fff' },
  darkTitle: { color: '#fff' },
  darkText: { color: '#ccc' },

  // Detail Screen
  detailCard: { backgroundColor: '#fff', margin: 15, padding: 20, borderRadius: 24 },
  backBtn: { marginBottom: 15 },
  detailImage: { width: '100%', height: 220, borderRadius: 16, marginBottom: 15 },
  detailImagePlaceholder: { width: '100%', height: 220, borderRadius: 16, backgroundColor: '#e0e0e0', justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  detailImagePlaceholderText: { fontSize: 60 },
  detailName: { fontSize: 24, fontWeight: 'bold', color: '#333', marginBottom: 5 },
  detailCategory: { fontSize: 14, color: '#002F66', fontWeight: 'bold', marginBottom: 12 },
  returnedBadge: { backgroundColor: '#fef3c7', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, alignSelf: 'flex-start', marginBottom: 15 },
  returnedBadgeText: { fontSize: 12, color: '#d97706', fontWeight: 'bold' },
  detailInfoGrid: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 10 },
  detailInfoItem: { width: '50%', flexDirection: 'row', alignItems: 'center', paddingVertical: 10, gap: 8 },
  detailIcon: { fontSize: 16 },
  detailLabel: { fontSize: 13, color: '#666', width: 70 },
  detailValue: { flex: 1, fontSize: 13, color: '#333' },
  statusBadge: { color: '#10b981', fontWeight: 'bold' },
  buttonRow: { flexDirection: 'row', gap: 12, marginTop: 20 },
  viewCVBtn: { flex: 1, backgroundColor: '#e0e0e0', padding: 14, borderRadius: 12, alignItems: 'center' },
  viewCVText: { fontWeight: 'bold', color: '#333', fontSize: 13 },
  hireBtn: { flex: 1, backgroundColor: '#002F66', padding: 14, borderRadius: 12, alignItems: 'center' },
  hireText: { fontWeight: 'bold', color: 'white', fontSize: 13 },
});