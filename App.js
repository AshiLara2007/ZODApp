import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, TouchableOpacity, FlatList, Image,
  StyleSheet, ScrollView, Switch, ActivityIndicator,
  Alert, Linking, RefreshControl, TextInput, Share,
  Animated, Dimensions, Platform, Modal
} from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as MailComposer from 'expo-mail-composer';
import * as MediaLibrary from 'expo-media-library';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');
const API_URL = 'https://zodmanpower.info/api/talents';
const LOGO_URL = 'https://raw.githubusercontent.com/AshiLara2007/ZOD-Photos/main/ZOD%20LOGO%20(1).png';
const APP_VERSION = '1.0.8';
const ADMIN_EMAIL = 'zodmanpower1978@gmail.com';
const WHATSAPP_NUMBER = '97455355206';

// Cache keys
const CACHE_KEYS = {
  CANDIDATES: '@zod_candidates_cache',
  LAST_UPDATE: '@zod_last_update',
  OFFLINE_MODE: '@zod_offline_mode',
  SAVED_PROFILES: '@zod_saved_profiles'
};

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
    hire: 'Hire Now',
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
    offline_mode: 'Offline Mode',
    enable_offline: 'Enable Offline Mode',
    download_cv: 'Download CV',
    download_profile: 'Download Profile',
    view_saved_profiles: 'Saved Profiles',
    no_saved_profiles: 'No saved profiles',
    permission_required: 'Storage Permission Required',
    permission_message: 'This app needs storage permission to save CVs to your device.',
    allow: 'Allow',
    deny: 'Deny',
    download_success: 'Download Successful',
    download_failed: 'Download Failed',
    report_sent: 'Download report sent to admin',
    file_saved: 'CV saved to Gallery → ZOD MANPOWER folder',
    offline_available: 'Offline data available',
    online_required: 'Internet connection required for updates',
    saved_profiles: 'Saved Profiles',
    profile_saved: 'Profile saved offline',
    share_cv: 'Share CV',
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
    hire: 'وظف الآن',
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
    offline_mode: 'الوضع دون اتصال',
    enable_offline: 'تفعيل الوضع دون اتصال',
    download_cv: 'تحميل السيرة',
    download_profile: 'تحميل الملف الشخصي',
    view_saved_profiles: 'الملفات المحفوظة',
    no_saved_profiles: 'لا توجد ملفات محفوظة',
    permission_required: 'صلاحية التخزين مطلوبة',
    permission_message: 'يحتاج هذا التطبيق إلى صلاحية التخزين لتحميل السير الذاتية',
    allow: 'سماح',
    deny: 'رفض',
    download_success: 'تم التحميل بنجاح',
    download_failed: 'فشل التحميل',
    report_sent: 'تم إرسال تقرير التحميل إلى المسؤول',
    file_saved: 'تم حفظ السيرة في المعرض → مجلد زود مان باور',
    offline_available: 'البيانات غير المتصلة متاحة',
    online_required: 'اتصال الإنترنت مطلوب للتحديثات',
    saved_profiles: 'الملفات المحفوظة',
    profile_saved: 'تم حفظ الملف الشخصي دون اتصال',
    share_cv: 'مشاركة السيرة الذاتية',
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

// ==================== FIXED: FETCH TALENTS WITH CORRECT CV URL ====================
const fetchTalents = async (useOffline = false) => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error();
    const data = await response.json();
    let talents = Array.isArray(data) ? data : (data.data || []);
    
    const mappedTalents = talents.map(t => {
      // Fix CV URL - මේකයි වැදගත්
      let cvUrl = '';
      if (t.cv && t.cv !== '#' && t.cv !== 'N/A' && t.cv !== '') {
        if (t.cv.startsWith('http')) {
          cvUrl = t.cv;
        } else {
          // Full URL එක හදනවා cvs folder එකට
          cvUrl = `https://ksyxmoqzcghszrhlpaxh.supabase.co/storage/v1/object/public/zod_manpower/cvs/${t.cv}`;
        }
      }
      
      // Fix Image URL
      let imageUrl = '';
      if (t.pic && t.pic !== '#' && t.pic !== 'N/A' && t.pic !== '') {
        if (t.pic.startsWith('http')) {
          imageUrl = t.pic;
        } else {
          imageUrl = `https://ksyxmoqzcghszrhlpaxh.supabase.co/storage/v1/object/public/zod_manpower/photos/${t.pic}`;
        }
      }
      
      return {
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
        imageUrl: imageUrl,
        cvUrl: cvUrl,
        workerType: t.workerType || 'Recruitment',
      };
    });
    
    await AsyncStorage.setItem(CACHE_KEYS.CANDIDATES, JSON.stringify(mappedTalents));
    await AsyncStorage.setItem(CACHE_KEYS.LAST_UPDATE, new Date().toISOString());
    
    return mappedTalents;
  } catch (error) {
    if (useOffline) {
      const cached = await AsyncStorage.getItem(CACHE_KEYS.CANDIDATES);
      if (cached) return JSON.parse(cached);
    }
    return [];
  }
};

// ==================== FIXED: OPEN CV IN BROWSER ====================
const openCV = async (url) => {
  console.log('Opening CV URL:', url);
  
  if (!url || url === 'N/A' || url === '#' || url === '') {
    Alert.alert('Info', 'CV link not available for this candidate');
    return;
  }
  
  try {
    if (url.startsWith('http://') || url.startsWith('https://')) {
      await WebBrowser.openBrowserAsync(url, {
        presentationStyle: WebBrowser.WebBrowserPresentationStyle.FULL_SCREEN,
        controlsColor: '#002F66',
        toolbarColor: '#002F66',
      });
    } else {
      Alert.alert('Error', 'Invalid URL format');
    }
  } catch (error) {
    console.error('Browser error:', error);
    Alert.alert('Error', 'Could not open CV. Please try again.');
  }
};

// Send download report to admin email
const sendDownloadReport = async (candidate, t, type = 'CV') => {
  try {
    const isAvailable = await MailComposer.isAvailableAsync();
    if (isAvailable) {
      await MailComposer.composeAsync({
        recipients: [ADMIN_EMAIL],
        subject: `${type} Download Report - ${candidate.name}`,
        body: `
          ${type} Download Report
          ------------------
          Candidate Name: ${candidate.name}
          Candidate Category: ${candidate.subCategory}
          Candidate Nationality: ${candidate.nationality}
          Download Time: ${new Date().toLocaleString()}
          App Version: ${APP_VERSION}
          
          This is an automated report from ZOD Manpower App.
        `
      });
    }
  } catch (error) {
    console.log('Email send error:', error);
  }
};

// Save profile to AsyncStorage for offline viewing
const saveProfileToStorage = async (candidate, profileData) => {
  try {
    const savedProfiles = await AsyncStorage.getItem(CACHE_KEYS.SAVED_PROFILES);
    let profiles = savedProfiles ? JSON.parse(savedProfiles) : [];
    
    const existingIndex = profiles.findIndex(p => p.id === candidate.id);
    const profileEntry = {
      id: candidate.id,
      name: candidate.name,
      category: candidate.subCategory,
      nationality: candidate.nationality,
      gender: candidate.gender,
      age: candidate.age,
      salary: candidate.salary,
      experience: candidate.experience,
      status: candidate.status,
      imageUrl: candidate.imageUrl,
      profileData: profileData,
      savedAt: new Date().toISOString()
    };
    
    if (existingIndex >= 0) {
      profiles[existingIndex] = profileEntry;
    } else {
      profiles.push(profileEntry);
    }
    
    await AsyncStorage.setItem(CACHE_KEYS.SAVED_PROFILES, JSON.stringify(profiles));
    return true;
  } catch (error) {
    console.log('Save profile error:', error);
    return false;
  }
};

// ==================== DOWNLOAD CV TO GALLERY FOLDER ====================
const downloadCV = async (candidate, t) => {
  if (!candidate.cvUrl || candidate.cvUrl === 'N/A' || candidate.cvUrl === '#') {
    Alert.alert('Info', 'CV link not available for this candidate');
    return;
  }

  Alert.alert(
    'Download CV',
    `Save CV for ${candidate.name} to Gallery?`,
    [
      { text: 'Cancel', style: 'cancel' },
      { 
        text: 'Save', 
        onPress: async () => {
          try {
            const { status } = await MediaLibrary.requestPermissionsAsync();
            if (status !== 'granted') {
              Alert.alert('Permission Required', 'Please allow access to save CVs to your gallery');
              return;
            }

            const fileName = `${candidate.name.replace(/[^a-zA-Z0-9]/g, '_')}_CV.pdf`;
            const fileUri = FileSystem.cacheDirectory + fileName;

            Alert.alert('Downloading', 'Please wait...');
            
            const downloadResult = await FileSystem.downloadAsync(
              candidate.cvUrl,
              fileUri
            );

            if (downloadResult.status === 200 && downloadResult.uri) {
              const asset = await MediaLibrary.createAssetAsync(downloadResult.uri);
              
              let album = await MediaLibrary.getAlbumAsync('ZOD MANPOWER');
              if (album === null) {
                album = await MediaLibrary.createAlbumAsync('ZOD MANPOWER', asset, false);
              } else {
                await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
              }
              
              await sendDownloadReport(candidate, t, 'CV');
              
              Alert.alert(
                '✅ Download Successful', 
                `CV saved to Gallery → ZOD MANPOWER folder\n\nFile: ${fileName}`,
                [{ text: 'OK' }]
              );
            } else {
              Alert.alert('Download Failed', 'Could not download the CV');
            }
          } catch (error) {
            console.error('Download error:', error);
            Alert.alert('Download Failed', error.message || 'Unknown error occurred');
          }
        }
      }
    ]
  );
};

// Download Profile and save to offline storage
const downloadProfile = async (candidate, t, onProfileSaved) => {
  const profileData = `
ZOD MANPOWER - Candidate Profile
================================

Name: ${candidate.name}
Category: ${candidate.subCategory}
Nationality: ${candidate.nationality}
Gender: ${candidate.gender}
Age: ${candidate.age}
Salary: ${candidate.salary}
Experience: ${candidate.experience}
Status: ${candidate.status}

CV Link: ${candidate.cvUrl || 'Not available'}

Download Date: ${new Date().toLocaleString()}
App Version: ${APP_VERSION}

For more details, contact: ${ADMIN_EMAIL}
  `;

  Alert.alert(
    'Download Profile',
    `Save profile for ${candidate.name} offline? You can view it without internet.`,
    [
      { text: 'Cancel', style: 'cancel' },
      { 
        text: 'Save Offline', 
        onPress: async () => {
          try {
            await saveProfileToStorage(candidate, profileData);
            
            const filePath = FileSystem.documentDirectory + `${candidate.name.replace(/[^a-zA-Z0-9]/g, '_')}_Profile.txt`;
            await FileSystem.writeAsStringAsync(filePath, profileData);
            
            await sendDownloadReport(candidate, t, 'Profile');
            Alert.alert('✅ Download Successful', 'Profile saved offline! You can view it from Saved Profiles.');
            if (onProfileSaved) onProfileSaved();
          } catch (error) {
            Alert.alert('Download Failed', error.message);
          }
        }
      }
    ]
  );
};

// View saved profiles offline
const SavedProfilesModal = ({ visible, onClose, isDarkMode, t }) => {
  const [savedProfiles, setSavedProfiles] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(null);

  useEffect(() => {
    if (visible) {
      loadSavedProfiles();
    }
  }, [visible]);

  const loadSavedProfiles = async () => {
    try {
      const saved = await AsyncStorage.getItem(CACHE_KEYS.SAVED_PROFILES);
      if (saved) {
        setSavedProfiles(JSON.parse(saved));
      }
    } catch (error) {
      console.log('Load profiles error:', error);
    }
  };

  const deleteProfile = async (profileId) => {
    Alert.alert(
      'Delete Profile',
      'Remove this saved profile?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const updated = savedProfiles.filter(p => p.id !== profileId);
            await AsyncStorage.setItem(CACHE_KEYS.SAVED_PROFILES, JSON.stringify(updated));
            setSavedProfiles(updated);
            Alert.alert('Deleted', 'Profile removed from saved list');
          }
        }
      ]
    );
  };

  const ProfileViewer = ({ profile, onBack }) => (
    <ScrollView style={styles.profileViewer}>
      <TouchableOpacity onPress={onBack} style={styles.profileViewerBack}>
        <Text style={styles.profileViewerBackText}>← Back to list</Text>
      </TouchableOpacity>
      <View style={styles.profileViewerHeader}>
        {profile.imageUrl ? (
          <Image source={{ uri: profile.imageUrl }} style={styles.profileViewerImage} />
        ) : (
          <View style={styles.profileViewerImagePlaceholder}>
            <Text style={styles.profileViewerImagePlaceholderText}>👤</Text>
          </View>
        )}
        <Text style={[styles.profileViewerName, isDarkMode && styles.darkTitle]}>{profile.name}</Text>
        <Text style={[styles.profileViewerCategory, isDarkMode && styles.darkText]}>{profile.category}</Text>
      </View>
      <View style={styles.profileViewerContent}>
        <View style={styles.profileViewerRow}><Text style={styles.profileViewerLabel}>📍 Nationality:</Text><Text style={[styles.profileViewerValue, isDarkMode && styles.darkText]}>{profile.nationality}</Text></View>
        <View style={styles.profileViewerRow}><Text style={styles.profileViewerLabel}>👤 Gender:</Text><Text style={[styles.profileViewerValue, isDarkMode && styles.darkText]}>{profile.gender}</Text></View>
        <View style={styles.profileViewerRow}><Text style={styles.profileViewerLabel}>🎂 Age:</Text><Text style={[styles.profileViewerValue, isDarkMode && styles.darkText]}>{profile.age}</Text></View>
        <View style={styles.profileViewerRow}><Text style={styles.profileViewerLabel}>💰 Salary:</Text><Text style={[styles.profileViewerValue, isDarkMode && styles.darkText]}>{profile.salary}</Text></View>
        <View style={styles.profileViewerRow}><Text style={styles.profileViewerLabel}>💼 Experience:</Text><Text style={[styles.profileViewerValue, isDarkMode && styles.darkText]}>{profile.experience}</Text></View>
        <View style={styles.profileViewerRow}><Text style={styles.profileViewerLabel}>✅ Status:</Text><Text style={[styles.profileViewerValue, styles.statusBadge]}>{profile.status}</Text></View>
        <View style={styles.profileViewerDivider} />
        <Text style={[styles.profileViewerSavedDate, isDarkMode && styles.darkText]}>Saved: {new Date(profile.savedAt).toLocaleString()}</Text>
      </View>
    </ScrollView>
  );

  if (selectedProfile) {
    return (
      <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
        <View style={[styles.modalContainer, isDarkMode && styles.darkContainer]}>
          <ProfileViewer profile={selectedProfile} onBack={() => setSelectedProfile(null)} />
        </View>
      </Modal>
    );
  }

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={[styles.modalContainer, isDarkMode && styles.darkContainer]}>
        <LinearGradient colors={['#002F66', '#004A99']} style={styles.modalHeader}>
          <Text style={styles.modalHeaderTitle}>{t.saved_profiles}</Text>
          <TouchableOpacity onPress={onClose} style={styles.modalCloseBtn}>
            <Text style={styles.modalCloseText}>✕</Text>
          </TouchableOpacity>
        </LinearGradient>
        
        {savedProfiles.length === 0 ? (
          <View style={styles.emptySavedContainer}>
            <Text style={styles.emptySavedIcon}>📭</Text>
            <Text style={[styles.emptySavedText, isDarkMode && styles.darkText]}>{t.no_saved_profiles}</Text>
            <Text style={[styles.emptySavedSubText, isDarkMode && styles.darkText]}>Download profiles to view them offline</Text>
          </View>
        ) : (
          <FlatList
            data={savedProfiles}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity style={[styles.savedProfileItem, isDarkMode && styles.darkCard]} onPress={() => setSelectedProfile(item)}>
                {item.imageUrl ? (
                  <Image source={{ uri: item.imageUrl }} style={styles.savedProfileImage} />
                ) : (
                  <View style={styles.savedProfileImagePlaceholder}>
                    <Text style={styles.savedProfileImagePlaceholderText}>👤</Text>
                  </View>
                )}
                <View style={styles.savedProfileInfo}>
                  <Text style={[styles.savedProfileName, isDarkMode && styles.darkTitle]}>{item.name}</Text>
                  <Text style={[styles.savedProfileCategory, isDarkMode && styles.darkText]}>{item.category}</Text>
                  <Text style={[styles.savedProfileDate, isDarkMode && styles.darkText]}>{new Date(item.savedAt).toLocaleDateString()}</Text>
                </View>
                <TouchableOpacity style={styles.savedProfileDelete} onPress={() => deleteProfile(item.id)}>
                  <Text style={styles.savedProfileDeleteText}>🗑️</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            )}
            contentContainerStyle={styles.savedProfilesList}
          />
        )}
      </View>
    </Modal>
  );
};

// ==================== HIRE FUNCTION WITH CV LINK ====================
const handleHire = (candidate, t) => {
  let message = `Hi! I'm interested in hiring ${candidate.name}`;
  
  if (candidate.subCategory && candidate.subCategory !== 'General') {
    message += ` (${candidate.subCategory})`;
  }
  
  if (candidate.nationality && candidate.nationality !== 'N/A') {
    message += ` from ${candidate.nationality}`;
  }
  
  message += `\n\n📋 Candidate Details:`;
  message += `\n• Name: ${candidate.name}`;
  message += `\n• Category: ${candidate.subCategory}`;
  message += `\n• Nationality: ${candidate.nationality}`;
  message += `\n• Gender: ${candidate.gender}`;
  message += `\n• Age: ${candidate.age}`;
  message += `\n• Salary: ${candidate.salary}`;
  message += `\n• Experience: ${candidate.experience}`;
  
  if (candidate.cvUrl && candidate.cvUrl !== '#' && candidate.cvUrl !== 'N/A') {
    message += `\n\n📄 CV Link: ${candidate.cvUrl}`;
  }
  
  message += `\n\nBest regards,\nZOD Manpower User`;
  
  Linking.openURL(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`);
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

const CandidateCard = ({ item, onPress, isDarkMode, t, index, onDownloadCV, onDownloadProfile, onHire }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateYAnim = useRef(new Animated.Value(30)).current;
  
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 400, delay: index * 60, useNativeDriver: true }),
      Animated.spring(translateYAnim, { toValue: 0, delay: index * 60, friction: 8, tension: 40, useNativeDriver: true })
    ]).start();
  }, []);

  const handlePressIn = () => Animated.spring(scaleAnim, { toValue: 0.96, friction: 5, tension: 300, useNativeDriver: true }).start();
  const handlePressOut = () => Animated.spring(scaleAnim, { toValue: 1, friction: 5, tension: 300, useNativeDriver: true }).start();

  return (
    <Animated.View style={{ opacity: fadeAnim, transform: [{ scale: scaleAnim }, { translateY: translateYAnim }], width: '48%', marginBottom: 16 }}>
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
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.hireButtonCard} onPress={() => onHire(item)}>
                <LinearGradient colors={['#25D366', '#128C7E']} style={styles.hireButtonGradient}>
                  <Text style={styles.hireButtonText}>💬 {t.hire}</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
            <View style={styles.downloadButtonsRow}>
              <TouchableOpacity style={styles.downloadCvBtn} onPress={() => onDownloadCV(item)}>
                <Text style={styles.downloadCvBtnText}>📄 {t.download_cv}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.downloadProfileBtn} onPress={() => onDownloadProfile(item)}>
                <Text style={styles.downloadProfileBtnText}>👤 {t.download_profile}</Text>
              </TouchableOpacity>
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
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, friction: 5, tension: 40, useNativeDriver: true }),
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
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, friction: 7, tension: 40, useNativeDriver: true })
    ]).start();
  }, []);

  return (
    <LinearGradient colors={['#f5f7fa', '#ffffff']} style={styles.container}>
      <StatusBar style="dark" />
      <Animated.View style={[styles.languageContainer, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
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
function SettingsScreen({ lang, onBack, onLangChange, isDarkMode, onToggleDarkMode, offlineMode, onToggleOfflineMode, onOpenSavedProfiles }) {
  const t = translations[lang];
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }).start();
  }, []);

  const handleShare = async () => {
    await Share.share({ message: 'Check out ZOD Manpower App! https://zodmanpower.info' });
  };

  const handleRate = () => {
    Linking.openURL('https://play.google.com/store/apps/details?id=com.zod.manpower');
  };

  const handleClearCache = async () => {
    try {
      await AsyncStorage.removeItem(CACHE_KEYS.CANDIDATES);
      await AsyncStorage.removeItem(CACHE_KEYS.LAST_UPDATE);
      Alert.alert('Success', t.cache_cleared);
    } catch (error) {
      Alert.alert('Error', 'Failed to clear cache');
    }
  };

  const SettingSection = ({ title, children }) => (
    <Animated.View style={[styles.settingsCard, isDarkMode && styles.darkCard, { opacity: fadeAnim }]}>
      <Text style={[styles.settingsSectionTitle, isDarkMode && styles.darkText]}>{title}</Text>
      {children}
    </Animated.View>
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

        <SettingSection title="📱 Offline Mode">
          <SwitchItem icon="📶" label={t.enable_offline} value={offlineMode} onValueChange={onToggleOfflineMode} />
          <Text style={[styles.offlineNote, isDarkMode && styles.darkText]}>
            {offlineMode ? t.offline_available : t.online_required}
          </Text>
        </SettingSection>

        <SettingSection title="💾 Saved Data">
          <TouchableOpacity style={styles.settingItem} onPress={onOpenSavedProfiles}>
            <View style={styles.settingItemLeft}>
              <Text style={styles.settingItemIcon}>📁</Text>
              <Text style={[styles.settingItemLabel, isDarkMode && styles.darkText]}>{t.view_saved_profiles}</Text>
            </View>
            <Text style={styles.settingItemArrow}>→</Text>
          </TouchableOpacity>
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

        <SettingSection title="💙 Support">
          <TouchableOpacity style={styles.settingItem} onPress={handleShare}>
            <View style={styles.settingItemLeft}><Text style={styles.settingItemIcon}>📤</Text><Text style={[styles.settingItemLabel, isDarkMode && styles.darkText]}>{t.share}</Text></View>
            <Text style={styles.settingItemArrow}>→</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingItem} onPress={handleRate}>
            <View style={styles.settingItemLeft}><Text style={styles.settingItemIcon}>⭐</Text><Text style={[styles.settingItemLabel, isDarkMode && styles.darkText]}>{t.rate}</Text></View>
            <Text style={styles.settingItemArrow}>→</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingItem} onPress={handleClearCache}>
            <View style={styles.settingItemLeft}><Text style={styles.settingItemIcon}>🗑️</Text><Text style={[styles.settingItemLabel, isDarkMode && styles.darkText]}>{t.clear_cache}</Text></View>
            <Text style={styles.settingItemArrow}>→</Text>
          </TouchableOpacity>
        </SettingSection>

        <SettingSection title="📞 Contact Us">
          <TouchableOpacity style={styles.settingItem} onPress={() => Linking.openURL('https://zodmanpower.info')}>
            <View style={styles.settingItemLeft}><Text style={styles.settingItemIcon}>🌐</Text><Text style={[styles.settingItemLabel, isDarkMode && styles.darkText]}>{t.website}</Text></View>
            <Text style={styles.settingItemArrow}>→</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingItem} onPress={() => Linking.openURL('tel:+97455355206')}>
            <View style={styles.settingItemLeft}><Text style={styles.settingItemIcon}>📞</Text><Text style={[styles.settingItemLabel, isDarkMode && styles.darkText]}>{t.call}</Text></View>
            <Text style={styles.settingItemArrow}>→</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingItem} onPress={() => Linking.openURL('mailto:info@zodmanpower.info')}>
            <View style={styles.settingItemLeft}><Text style={styles.settingItemIcon}>✉️</Text><Text style={[styles.settingItemLabel, isDarkMode && styles.darkText]}>{t.email}</Text></View>
            <Text style={styles.settingItemArrow}>→</Text>
          </TouchableOpacity>
        </SettingSection>

        <SettingSection title="ℹ️ About">
          <TouchableOpacity style={styles.settingItem} onPress={() => Alert.alert(t.developers, `${t.developer_name}\n${t.developer_email}`)}>
            <View style={styles.settingItemLeft}><Text style={styles.settingItemIcon}>👨‍💻</Text><Text style={[styles.settingItemLabel, isDarkMode && styles.darkText]}>{t.developers}</Text></View>
            <Text style={styles.settingItemArrow}>→</Text>
          </TouchableOpacity>
          <View style={styles.settingItem}>
            <View style={styles.settingItemLeft}><Text style={styles.settingItemIcon}>📅</Text><Text style={[styles.settingItemLabel, isDarkMode && styles.darkText]}>{t.version} {APP_VERSION}</Text></View>
          </View>
        </SettingSection>
      </ScrollView>
    </View>
  );
}

// ------------------- MAIN SCREEN -------------------
function MainScreen({ lang, onOpenSettings, isDarkMode, offlineMode, onOpenSavedProfiles }) {
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
  const [refreshKey, setRefreshKey] = useState(0);
  const scrollY = useRef(new Animated.Value(0)).current;

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
      const talents = await fetchTalents(offlineMode);
      if (talents.length > 0) {
        setCvs(talents);
        setFilteredCvs(talents);
        const lastUpdateTime = await AsyncStorage.getItem(CACHE_KEYS.LAST_UPDATE);
        if (lastUpdateTime) {
          const date = new Date(lastUpdateTime);
          setLastUpdate(`${date.getHours().toString().padStart(2,'0')}:${date.getMinutes().toString().padStart(2,'0')}`);
        } else {
          const now = new Date();
          setLastUpdate(`${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}`);
        }
      }
    } catch (error) {
      Alert.alert('Error', t.error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { loadCVs(); }, [offlineMode, refreshKey]);

  const onRefresh = () => {
    if (!offlineMode) {
      setRefreshing(true);
      loadCVs();
    } else {
      Alert.alert('Offline Mode', 'Please disable offline mode to refresh data');
      setRefreshing(false);
    }
  };

  const handleProfileSaved = () => {
    setRefreshKey(prev => prev + 1);
  };

  const onHire = (candidate) => {
    handleHire(candidate, t);
  };

  const onDownloadCV = (candidate) => {
    downloadCV(candidate, t);
  };

  const onDownloadProfile = (candidate) => {
    downloadProfile(candidate, t, handleProfileSaved);
  };

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

  const stats = { total: cvs.length };

  const headerHeight = scrollY.interpolate({
    inputRange: [0, 80],
    outputRange: [110, 70],
    extrapolate: 'clamp',
  });

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 50, 100],
    outputRange: [1, 0.96, 0.92],
    extrapolate: 'clamp',
  });

  const logoScale = scrollY.interpolate({
    inputRange: [0, 80],
    outputRange: [1, 0.85],
    extrapolate: 'clamp',
  });

  const titleOpacity = scrollY.interpolate({
    inputRange: [0, 60, 80],
    outputRange: [1, 0.6, 0],
    extrapolate: 'clamp',
  });

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
            <TouchableOpacity style={styles.detailHireBtn} onPress={() => onHire(selected)}>
              <LinearGradient colors={['#25D366', '#128C7E']} style={styles.hireBtnGradientDetail}>
                <Text style={styles.hireBtnTextDetail}>💬 {t.hire}</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
          
          <View style={styles.detailDownloadRow}>
            <TouchableOpacity style={styles.detailCvBtn} onPress={() => onDownloadCV(selected)}>
              <Text style={styles.detailDownloadText}>📄 {t.download_cv}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.detailProfileBtn} onPress={() => onDownloadProfile(selected)}>
              <Text style={styles.detailDownloadText}>👤 {t.download_profile}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    );
  }

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      
      <Animated.View style={[styles.headerContainer, { height: headerHeight, opacity: headerOpacity }]}>
        <LinearGradient colors={['#002F66', '#004A99']} style={styles.headerGradient}>
          <View style={styles.headerContent}>
            <Animated.Image source={{ uri: LOGO_URL }} style={[styles.headerLogo, { transform: [{ scale: logoScale }] }]} />
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

      <Animated.ScrollView 
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: false })}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
      >
        <View style={styles.statsGrid}>
          <LinearGradient colors={['#002F66', '#004A99']} style={styles.statCard}>
            <Text style={styles.statCardIcon}>👥</Text>
            <Text style={styles.statCardNumber}>{stats.total}</Text>
            <Text style={styles.statCardLabel}>{t.total_cvs}</Text>
          </LinearGradient>
        </View>

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

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.countriesScroll} contentContainerStyle={styles.countriesScrollContent}>
          {countries.map(c => (
            <TouchableOpacity key={c.key} onPress={() => setCountryFilter(c.key)} style={[styles.countryChip, countryFilter === c.key && styles.activeCountryChip]}>
              <Text style={styles.countryFlag}>{c.flag}</Text>
              <Text style={[styles.countryName, countryFilter === c.key && styles.activeCountryName]}>{c.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={[styles.lastUpdate, isDarkMode && styles.darkText]}>🕐 {t.last_update}: {lastUpdate}</Text>

        <View style={styles.gridContainer}>
          {filteredCvs.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>📭</Text>
              <Text style={[styles.emptyText, isDarkMode && styles.darkText]}>{t.no}</Text>
            </View>
          ) : (
            <View style={styles.gridRow}>
              {filteredCvs.map((item, index) => (
                <CandidateCard 
                  key={item.id} 
                  item={item} 
                  index={index} 
                  onPress={() => setSelected(item)} 
                  isDarkMode={isDarkMode} 
                  t={t}
                  onDownloadCV={onDownloadCV}
                  onDownloadProfile={onDownloadProfile}
                  onHire={onHire}
                />
              ))}
            </View>
          )}
        </View>
        
        <View style={{ height: 30 }} />
      </Animated.ScrollView>

      <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#002F66']} />
    </View>
  );
}

// ------------------- MAIN APP -------------------
export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [screen, setScreen] = useState('language');
  const [lang, setLang] = useState('en');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [offlineMode, setOfflineMode] = useState(false);
  const [showSavedProfiles, setShowSavedProfiles] = useState(false);

  useEffect(() => {
    const loadOfflineMode = async () => {
      const saved = await AsyncStorage.getItem(CACHE_KEYS.OFFLINE_MODE);
      if (saved !== null) setOfflineMode(saved === 'true');
    };
    loadOfflineMode();
  }, []);

  const toggleOfflineMode = async (value) => {
    setOfflineMode(value);
    await AsyncStorage.setItem(CACHE_KEYS.OFFLINE_MODE, value.toString());
  };

  if (showSplash) return <SplashScreen onFinish={() => setShowSplash(false)} />;
  if (screen === 'language') return <LanguageScreen onSelect={(l) => { setLang(l); setScreen('main'); }} />;
  if (screen === 'settings') return (
    <SettingsScreen 
      lang={lang} 
      onBack={() => setScreen('main')} 
      onLangChange={(l) => { setLang(l); setScreen('main'); }} 
      isDarkMode={isDarkMode} 
      onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
      offlineMode={offlineMode}
      onToggleOfflineMode={toggleOfflineMode}
      onOpenSavedProfiles={() => setShowSavedProfiles(true)}
    />
  );
  return (
    <>
      <MainScreen lang={lang} onOpenSettings={() => setScreen('settings')} isDarkMode={isDarkMode} offlineMode={offlineMode} onOpenSavedProfiles={() => setShowSavedProfiles(true)} />
      <SavedProfilesModal visible={showSavedProfiles} onClose={() => setShowSavedProfiles(false)} isDarkMode={isDarkMode} t={translations[lang]} />
    </>
  );
}

// ------------------- STYLES -------------------
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f7fa' },
  darkContainer: { backgroundColor: '#121212' },
  splashContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  splashLogoWrapper: { width: 140, height: 140, borderRadius: 70, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 8 },
  splashLogo: { width: 110, height: 110, borderRadius: 55 },
  splashTitle: { fontSize: 28, fontWeight: 'bold', color: '#fff', marginBottom: 5 },
  splashSubtitle: { fontSize: 14, color: '#fff', opacity: 0.8 },
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
  statsGrid: { flexDirection: 'row', paddingHorizontal: 15, marginTop: 15 },
  statCard: { flex: 1, borderRadius: 16, padding: 12, alignItems: 'center', elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  statCardIcon: { fontSize: 24, color: '#fff', marginBottom: 4 },
  statCardNumber: { fontSize: 28, fontWeight: 'bold', color: '#fff' },
  statCardLabel: { fontSize: 10, color: '#fff', opacity: 0.8, marginTop: 2 },
  searchWrapper: { paddingHorizontal: 15, marginTop: 15 },
  searchContainer: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, paddingVertical: 12, borderRadius: 30, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4 },
  searchIcon: { fontSize: 16, marginRight: 10, color: '#999' },
  searchInput: { flex: 1, fontSize: 14 },
  searchClear: { fontSize: 16, color: '#999', padding: 5 },
  categoriesScroll: { marginTop: 15 },
  categoriesScrollContent: { paddingHorizontal: 15, gap: 12 },
  categoryIconBtn: { alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 25, borderWidth: 1, borderColor: '#e0e0e0' },
  categoryIconBtnActive: { borderWidth: 0 },
  categoryIconEmoji: { fontSize: 18, marginBottom: 4 },
  categoryIconLabel: { fontSize: 11, color: '#666', fontWeight: '500' },
  categoryIconLabelActive: { color: '#fff' },
  countriesScroll: { marginTop: 12 },
  countriesScrollContent: { paddingHorizontal: 15, gap: 8 },
  countryChip: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f0f0f0', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, gap: 5 },
  activeCountryChip: { backgroundColor: '#002F66' },
  countryFlag: { fontSize: 12 },
  countryName: { fontSize: 11, color: '#666' },
  activeCountryName: { color: '#fff' },
  lastUpdate: { textAlign: 'center', fontSize: 9, color: '#999', marginVertical: 12 },
  gridContainer: { paddingHorizontal: 10 },
  gridRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
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
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  cardCountry: { backgroundColor: '#eef2ff', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 12 },
  cardCountryText: { fontSize: 9, color: '#002F66', fontWeight: '500' },
  cardSalary: { fontSize: 11, color: '#002F66', fontWeight: 'bold' },
  buttonContainer: { marginBottom: 8 },
  hireButtonCard: { borderRadius: 25, overflow: 'hidden', marginTop: 4 },
  hireButtonGradient: { paddingVertical: 8, alignItems: 'center', borderRadius: 25 },
  hireButtonText: { fontSize: 12, fontWeight: 'bold', color: '#fff' },
  downloadButtonsRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
  downloadCvBtn: { flex: 1, backgroundColor: '#002F66', paddingVertical: 6, borderRadius: 15, alignItems: 'center' },
  downloadCvBtnText: { fontSize: 10, color: '#fff', fontWeight: '500' },
  downloadProfileBtn: { flex: 1, backgroundColor: '#10b981', paddingVertical: 6, borderRadius: 15, alignItems: 'center' },
  downloadProfileBtnText: { fontSize: 10, color: '#fff', fontWeight: '500' },
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
  offlineNote: { fontSize: 11, color: '#666', marginTop: 8, textAlign: 'center' },
  languageSelector: { flexDirection: 'row', gap: 12, marginTop: 5 },
  langSelectorBtn: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 12, backgroundColor: '#f0f0f0' },
  activeLangSelector: { backgroundColor: '#002F66' },
  langSelectorText: { fontSize: 14, color: '#666' },
  activeLangSelectorText: { color: '#fff' },
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
  detailHireBtn: { flex: 1, borderRadius: 12, overflow: 'hidden' },
  hireBtnGradientDetail: { paddingVertical: 14, alignItems: 'center' },
  hireBtnTextDetail: { fontWeight: 'bold', color: '#fff', fontSize: 14 },
  detailDownloadRow: { flexDirection: 'row', gap: 12, marginTop: 15 },
  detailCvBtn: { flex: 1, backgroundColor: '#002F66', paddingVertical: 12, borderRadius: 12, alignItems: 'center' },
  detailProfileBtn: { flex: 1, backgroundColor: '#10b981', paddingVertical: 12, borderRadius: 12, alignItems: 'center' },
  detailDownloadText: { fontWeight: 'bold', color: '#fff', fontSize: 13 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 10, color: '#666' },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60 },
  emptyIcon: { fontSize: 50, marginBottom: 10 },
  emptyText: { fontSize: 16, color: '#999' },
  darkTitle: { color: '#fff' },
  darkText: { color: '#ccc' },
  modalContainer: { flex: 1, backgroundColor: '#f5f7fa' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 50, paddingBottom: 15, paddingHorizontal: 20, borderBottomLeftRadius: 25, borderBottomRightRadius: 25 },
  modalHeaderTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
  modalCloseBtn: { padding: 8 },
  modalCloseText: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
  emptySavedContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40 },
  emptySavedIcon: { fontSize: 60, marginBottom: 20, opacity: 0.5 },
  emptySavedText: { fontSize: 18, fontWeight: 'bold', color: '#666', textAlign: 'center', marginBottom: 8 },
  emptySavedSubText: { fontSize: 14, color: '#999', textAlign: 'center' },
  savedProfilesList: { padding: 15 },
  savedProfileItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 16, padding: 12, marginBottom: 12, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2 },
  savedProfileImage: { width: 50, height: 50, borderRadius: 25 },
  savedProfileImagePlaceholder: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#e0e0e0', alignItems: 'center', justifyContent: 'center' },
  savedProfileImagePlaceholderText: { fontSize: 24 },
  savedProfileInfo: { flex: 1, marginLeft: 12 },
  savedProfileName: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  savedProfileCategory: { fontSize: 12, color: '#666', marginTop: 2 },
  savedProfileDate: { fontSize: 10, color: '#999', marginTop: 2 },
  savedProfileDelete: { padding: 8 },
  savedProfileDeleteText: { fontSize: 18 },
  profileViewer: { flex: 1 },
  profileViewerBack: { padding: 15, paddingTop: 50 },
  profileViewerBackText: { fontSize: 16, fontWeight: 'bold', color: '#002F66' },
  profileViewerHeader: { alignItems: 'center', padding: 20 },
  profileViewerImage: { width: 100, height: 100, borderRadius: 50, marginBottom: 12 },
  profileViewerImagePlaceholder: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#e0e0e0', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  profileViewerImagePlaceholderText: { fontSize: 40 },
  profileViewerName: { fontSize: 22, fontWeight: 'bold', color: '#333', marginBottom: 4 },
  profileViewerCategory: { fontSize: 14, color: '#002F66', marginBottom: 8 },
  profileViewerContent: { backgroundColor: '#fff', margin: 15, borderRadius: 20, padding: 20, elevation: 2 },
  profileViewerRow: { flexDirection: 'row', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  profileViewerLabel: { width: 100, fontSize: 14, fontWeight: '600', color: '#666' },
  profileViewerValue: { flex: 1, fontSize: 14, color: '#333' },
  profileViewerDivider: { height: 1, backgroundColor: '#e0e0e0', marginVertical: 12 },
  profileViewerSavedDate: { fontSize: 11, color: '#999', textAlign: 'center', marginTop: 8 },
  statusBadge: { color: '#10b981', fontWeight: 'bold' },
});
