import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut as firebaseSignOut,
    updateProfile,
    User,
    onIdTokenChanged,
} from 'firebase/auth';
import { auth } from './firebase';
import { createUserProfile } from './firestore';

export type UserRole = 'student' | 'educator' | 'researcher';

export interface SignUpData {
    name: string;
    email: string;
    password: string;
    role: UserRole;
}

// Keep cookie in sync with Firebase token so middleware can read it
if (typeof window !== 'undefined') {
    onIdTokenChanged(auth, async (user) => {
        if (user) {
            const token = await user.getIdToken();
            document.cookie = `firebase-token=${token}; path=/; max-age=3600; SameSite=Strict`;
        } else {
            document.cookie = 'firebase-token=; path=/; max-age=0';
        }
    });
}

export async function signUp({ name, email, password, role }: SignUpData) {
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    const user = credential.user;

    // Set display name
    await updateProfile(user, { displayName: name });

    // Save profile to Firestore
    await createUserProfile(user.uid, { name, email, role });

    return user;
}

export async function signIn(email: string, password: string) {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    return credential.user;
}

export async function signOut() {
    await firebaseSignOut(auth);
    // Clear cookie immediately
    if (typeof window !== 'undefined') {
        document.cookie = 'firebase-token=; path=/; max-age=0';
    }
}

export function getCurrentUser(): User | null {
    return auth.currentUser;
}
