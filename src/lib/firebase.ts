/**
 * GreenCoach AI - Firebase Firestore & Authentication Service
 * Initializes Firebase App, Firestore database, and Google Authentication
 */

import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User as FirebaseUser,
  updateProfile
} from 'firebase/auth';

export { onAuthStateChanged, type FirebaseUser };
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  collection, 
  query, 
  where, 
  getDocs, 
  addDoc, 
  getDocFromServer,
  onSnapshot
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { Diagnosis, Farm, Farmer, GamificationScore, LanguageCode, TreatmentProduct } from '../../shared/types.ts';

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
/* CRITICAL: The app will break without passing firestoreDatabaseId */
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Connection test per skill requirements
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase client is offline or network restricted.');
    }
  }
}
testConnection();

// User profile interface
export interface AppUserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: 'farmer' | 'extension_worker';
  villageId: string;
  languagePref: LanguageCode;
  phoneNumber?: string;
  consentHealthData: boolean;
  consentLeaderboardPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

// Auth actions
export const signInWithGoogle = async (): Promise<FirebaseUser> => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    // Check if user document already exists in Firestore
    const userDocRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userDocRef);
    
    if (!userSnap.exists()) {
      // First-time Google user initialization
      const defaultProfile: AppUserProfile = {
        uid: user.uid,
        email: user.email || '',
        displayName: user.displayName || 'Farmer',
        role: 'farmer',
        villageId: 'vil-khadakwasla',
        languagePref: 'hi',
        phoneNumber: user.phoneNumber || '',
        consentHealthData: true,
        consentLeaderboardPublic: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      await setDoc(userDocRef, defaultProfile);

      // Create default farm parcel for new user
      const farmDocRef = doc(db, 'users', user.uid, 'farms', 'default-farm');
      await setDoc(farmDocRef, {
        farmId: 'default-farm',
        ownerUid: user.uid,
        cropTypes: ['cotton', 'tomato'],
        acreage: 2.0,
        soilType: 'Medium Black Loam',
        lat: 18.432,
        lng: 73.765,
        updatedAt: new Date().toISOString()
      });

      // Initialize default gamification score
      const scoreDocRef = doc(db, 'users', user.uid, 'gamification', 'score');
      await setDoc(scoreDocRef, {
        userUid: user.uid,
        farmFitnessScoreTotal: 88.5,
        streakEcoDays: 5,
        pesticideReductionScore: 92,
        soilHealthScore: 86,
        waterEfficiencyScore: 84,
        healthComplianceScore: 95,
        followthroughScore: 85,
        updatedAt: new Date().toISOString()
      });
    }
    return user;
  } catch (error) {
    console.error('Google Sign-in failed:', error);
    throw error;
  }
};

export const registerWithEmail = async (
  email: string,
  pass: string,
  displayName: string,
  role: 'farmer' | 'extension_worker',
  villageId: string,
  languagePref: LanguageCode
): Promise<FirebaseUser> => {
  const result = await createUserWithEmailAndPassword(auth, email, pass);
  const user = result.user;
  
  if (displayName) {
    await updateProfile(user, { displayName });
  }

  // Create user profile in Firestore
  const userProfile: AppUserProfile = {
    uid: user.uid,
    email: user.email || email,
    displayName: displayName || (role === 'farmer' ? 'Farmer' : 'Extension Officer'),
    role,
    villageId: villageId || 'vil-khadakwasla',
    languagePref: languagePref || 'hi',
    consentHealthData: true,
    consentLeaderboardPublic: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  const userDocRef = doc(db, 'users', user.uid);
  await setDoc(userDocRef, userProfile);

  // Initialize farm
  const farmDocRef = doc(db, 'users', user.uid, 'farms', 'default-farm');
  await setDoc(farmDocRef, {
    farmId: 'default-farm',
    ownerUid: user.uid,
    cropTypes: ['cotton', 'tomato'],
    acreage: 2.0,
    soilType: 'Medium Black Loam',
    lat: 18.432,
    lng: 73.765,
    updatedAt: new Date().toISOString()
  });

  // Initialize gamification score
  const scoreDocRef = doc(db, 'users', user.uid, 'gamification', 'score');
  await setDoc(scoreDocRef, {
    userUid: user.uid,
    farmFitnessScoreTotal: 85.0,
    streakEcoDays: 3,
    pesticideReductionScore: 88,
    soilHealthScore: 84,
    waterEfficiencyScore: 82,
    healthComplianceScore: 90,
    followthroughScore: 80,
    updatedAt: new Date().toISOString()
  });

  return user;
};

export const loginWithEmail = async (email: string, pass: string): Promise<FirebaseUser> => {
  const result = await signInWithEmailAndPassword(auth, email, pass);
  return result.user;
};

export const logOutUser = async () => {
  await signOut(auth);
};

// Firestore User Data Services
export const fetchUserProfile = async (uid: string): Promise<AppUserProfile | null> => {
  try {
    const userSnap = await getDoc(doc(db, 'users', uid));
    if (userSnap.exists()) {
      return userSnap.data() as AppUserProfile;
    }
    return null;
  } catch (err) {
    console.error('Failed to fetch user profile:', err);
    return null;
  }
};

export const updateUserProfile = async (uid: string, updates: Partial<AppUserProfile>) => {
  try {
    await updateDoc(doc(db, 'users', uid), {
      ...updates,
      updatedAt: new Date().toISOString()
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `users/${uid}`);
  }
};

// User Farms
export const fetchUserFarm = async (uid: string): Promise<Farm | null> => {
  try {
    const snap = await getDoc(doc(db, 'users', uid, 'farms', 'default-farm'));
    if (snap.exists()) {
      const d = snap.data();
      return {
        farm_id: d.farmId || 'default-farm',
        farmer_id: uid,
        crop_types: d.cropTypes || ['cotton', 'tomato'],
        acreage: d.acreage || 2.0,
        geo_location: { lat: d.lat || 18.432, lng: d.lng || 73.765 },
        soil_type: d.soilType || 'Medium Black Loam'
      };
    }
    return null;
  } catch (err) {
    console.error('Failed to fetch user farm:', err);
    return null;
  }
};

export const saveUserFarm = async (uid: string, farm: Farm) => {
  try {
    await setDoc(doc(db, 'users', uid, 'farms', farm.farm_id || 'default-farm'), {
      farmId: farm.farm_id,
      ownerUid: uid,
      cropTypes: farm.crop_types,
      acreage: farm.acreage,
      soilType: farm.soil_type,
      lat: farm.geo_location.lat,
      lng: farm.geo_location.lng,
      updatedAt: new Date().toISOString()
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `users/${uid}/farms`);
  }
};

// User Diagnoses History
export const fetchUserDiagnoses = async (uid: string): Promise<Diagnosis[]> => {
  try {
    const colRef = collection(db, 'users', uid, 'diagnoses');
    const snap = await getDocs(colRef);
    const results: Diagnosis[] = [];
    snap.forEach(d => {
      results.push(d.data() as Diagnosis);
    });
    return results.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  } catch (err) {
    console.error('Failed to fetch user diagnoses:', err);
    return [];
  }
};

export const saveUserDiagnosis = async (uid: string, diagnosis: Diagnosis) => {
  try {
    await setDoc(doc(db, 'users', uid, 'diagnoses', diagnosis.diagnosis_id), {
      ...diagnosis,
      farmer_id: uid
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `users/${uid}/diagnoses/${diagnosis.diagnosis_id}`);
  }
};

// User Treatments History
export const saveUserTreatment = async (uid: string, treatment: any) => {
  try {
    await setDoc(doc(db, 'users', uid, 'treatments', treatment.treatment_id), {
      ...treatment,
      farmer_id: uid
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `users/${uid}/treatments/${treatment.treatment_id}`);
  }
};

// User Favorites
export const fetchUserFavorites = async (uid: string): Promise<Set<string>> => {
  try {
    const colRef = collection(db, 'users', uid, 'favorites');
    const snap = await getDocs(colRef);
    const favs = new Set<string>();
    snap.forEach(d => favs.add(d.id));
    return favs;
  } catch (err) {
    console.error('Failed to fetch user favorites:', err);
    return new Set(['prod-neem-nske']);
  }
};

export const toggleUserFavorite = async (uid: string, product: TreatmentProduct): Promise<boolean> => {
  try {
    const favDocRef = doc(db, 'users', uid, 'favorites', product.id);
    const snap = await getDoc(favDocRef);
    if (snap.exists()) {
      // Remove
      await setDoc(favDocRef, { is_favorite: false, removed_at: new Date().toISOString() });
      return false;
    } else {
      // Add
      await setDoc(favDocRef, {
        productId: product.id,
        userUid: uid,
        productName: product.name,
        activeIngredient: product.active_ingredient,
        dosage: product.dosage,
        savedAt: new Date().toISOString(),
        is_favorite: true
      });
      return true;
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `users/${uid}/favorites/${product.id}`);
    return false;
  }
};

// User Gamification Score
export const fetchUserGamification = async (uid: string): Promise<GamificationScore | null> => {
  try {
    const snap = await getDoc(doc(db, 'users', uid, 'gamification', 'score'));
    if (snap.exists()) {
      return snap.data() as GamificationScore;
    }
    return null;
  } catch (err) {
    console.error('Failed to fetch user gamification score:', err);
    return null;
  }
};

export const saveUserGamification = async (uid: string, score: GamificationScore) => {
  try {
    await setDoc(doc(db, 'users', uid, 'gamification', 'score'), {
      ...score,
      userUid: uid,
      updatedAt: new Date().toISOString()
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `users/${uid}/gamification/score`);
  }
};
