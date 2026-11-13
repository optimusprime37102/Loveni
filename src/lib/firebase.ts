import AsyncStorage from '@react-native-async-storage/async-storage';
import { FirebaseApp, getApp, getApps, initializeApp } from 'firebase/app';
import { Auth, getAuth, initializeAuth } from 'firebase/auth';
import { Firestore, getFirestore } from 'firebase/firestore';
import { Functions, getFunctions } from 'firebase/functions';
import googleServices from '../../google-services.json';

type GoogleServices = {
  project_info: {
    project_number: string;
    project_id: string;
    storage_bucket: string;
  };
  client: Array<{
    client_info: { mobilesdk_app_id: string };
    api_key: Array<{ current_key: string }>;
  }>;
};

const gs = googleServices as GoogleServices;
const androidClient = gs.client[0];

/** Config built only from google-services.json (Android Firebase app). */
const firebaseConfig = {
  apiKey: androidClient?.api_key?.[0]?.current_key ?? '',
  authDomain: `${gs.project_info.project_id}.firebaseapp.com`,
  projectId: gs.project_info.project_id,
  storageBucket: gs.project_info.storage_bucket,
  messagingSenderId: gs.project_info.project_number,
  appId: androidClient?.client_info?.mobilesdk_app_id ?? '',
};

export function isFirebaseConfigured(): boolean {
  return Boolean(firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId);
}

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let functions: Functions;

function ensureApp(): FirebaseApp {
  if (!isFirebaseConfigured()) {
    throw new Error(
      'Firebase is not configured. Add google-services.json from your Firebase Android app to the project root.'
    );
  }

  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApp();
  }
  return app;
}

function createAuth(firebaseApp: FirebaseApp): Auth {
  try {
    const rnAuth = require('firebase/auth') as typeof import('firebase/auth') & {
      getReactNativePersistence: (storage: typeof AsyncStorage) => unknown;
    };

    return initializeAuth(firebaseApp, {
      persistence: rnAuth.getReactNativePersistence(AsyncStorage) as never,
    });
  } catch {
    return getAuth(firebaseApp);
  }
}

export function getFirebaseAuth(): Auth {
  if (auth) return auth;
  auth = createAuth(ensureApp());
  return auth;
}

export function getDb(): Firestore {
  if (db) return db;
  db = getFirestore(ensureApp());
  return db;
}

export function getFirebaseFunctions(): Functions {
  if (functions) return functions;
  functions = getFunctions(ensureApp(), 'us-central1');
  return functions;
}
