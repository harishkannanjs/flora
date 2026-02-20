import {
    doc,
    setDoc,
    getDoc,
    collection,
    addDoc,
    onSnapshot,
    serverTimestamp,
    query,
    where,
    orderBy,
    getDocs,
    Unsubscribe,
    deleteField,
    updateDoc,
} from 'firebase/firestore';
import { db } from './firebase';
import { UserRole } from './auth';

// ─── Utilities ────────────────────────────────────────────────────────────────

function generateEnrollCode(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no I/O/0/1 to avoid confusion
    let code = '';
    for (let i = 0; i < 6; i++) {
        code += chars[Math.floor(Math.random() * chars.length)];
    }
    return code;
}

// ─── User Profile ────────────────────────────────────────────────────────────

export interface UserProfile {
    uid: string;
    name: string;
    email: string;
    role: UserRole;
    createdAt: unknown;
}

export async function createUserProfile(
    uid: string,
    data: { name: string; email: string; role: UserRole }
) {
    await setDoc(doc(db, 'users', uid), {
        uid,
        ...data,
        createdAt: serverTimestamp(),
    });
}

export async function updateUserProfile(
    uid: string,
    data: Partial<UserProfile>
) {
    await updateDoc(doc(db, 'users', uid), data);
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
    const snap = await getDoc(doc(db, 'users', uid));
    if (!snap.exists()) return null;
    return snap.data() as UserProfile;
}

// ─── Courses (Educator) ───────────────────────────────────────────────────────

export interface Lesson {
    title: string;
    content: string;
    order: number;
}

export interface Course {
    id: string;
    title: string;
    description: string;
    totalLessons: number;
    topics: string[];
    educatorId: string;
    educatorName: string;
    enrollCode: string;
    enrolledCount: number;
    createdAt: unknown;
    isAIGenerated?: boolean;
}

export async function createCourse(
    educatorId: string,
    educatorName: string,
    data: { title: string; description: string; totalLessons: number; topics: string[]; lessons?: Omit<Lesson, 'order'>[] }
): Promise<string> {
    let enrollCode = generateEnrollCode();

    // Ensure code is unique
    const existing = await getDocs(query(collection(db, 'courses'), where('enrollCode', '==', enrollCode)));
    if (!existing.empty) enrollCode = generateEnrollCode() + Math.floor(Math.random() * 9);

    const { lessons, ...courseData } = data;
    const finalTotalLessons = lessons ? lessons.length : data.totalLessons;

    const ref = await addDoc(collection(db, 'courses'), {
        ...courseData,
        totalLessons: finalTotalLessons,
        educatorId,
        educatorName,
        enrollCode,
        enrolledCount: 0,
        createdAt: serverTimestamp(),
        isAIGenerated: !!lessons,
    });

    if (lessons && lessons.length > 0) {
        const lessonsRef = collection(db, 'courses', ref.id, 'lessons');
        await Promise.all(lessons.map((lesson, index) =>
            addDoc(lessonsRef, {
                ...lesson,
                order: index + 1,
                createdAt: serverTimestamp(),
            })
        ));
    }

    return ref.id;
}

export async function getCourseLessons(courseId: string): Promise<Lesson[]> {
    const q = query(collection(db, 'courses', courseId, 'lessons'), orderBy('order', 'asc'));
    const snap = await getDocs(q);
    return snap.docs.map(d => d.data() as Lesson);
}

export function subscribeToEducatorCourses(
    educatorId: string,
    callback: (courses: Course[]) => void
): Unsubscribe {
    const q = query(
        collection(db, 'courses'),
        where('educatorId', '==', educatorId)
    );
    return onSnapshot(q, (snap) => {
        const courses = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Course));
        // Client-side sort to avoid index requirements
        courses.sort((a, b) => {
            const dateA = (a.createdAt as any)?.toDate?.() || new Date(0);
            const dateB = (b.createdAt as any)?.toDate?.() || new Date(0);
            return dateB - dateA;
        });
        callback(courses);
    });
}

// ─── Enrollment (Student) ─────────────────────────────────────────────────────

export interface Enrollment {
    courseId: string;
    title: string;
    description: string;
    totalLessons: number;
    topics: string[];
    educatorName: string;
    enrollCode: string;
    completedLessons: number;
    percent: number;
    lastTopic: string;
    enrolledAt: unknown;
}

export async function enrollWithCode(
    studentId: string,
    code: string
): Promise<{ success: boolean; error?: string }> {
    try {
        const upperCode = code.trim().toUpperCase();
        const q = query(collection(db, 'courses'), where('enrollCode', '==', upperCode));
        const snap = await getDocs(q);

        if (snap.empty) return { success: false, error: 'Invalid code. Please check and try again.' };

        const courseDoc = snap.docs[0];
        const course = { id: courseDoc.id, ...courseDoc.data() } as Course;

        // Check if already enrolled
        const enrollRef = doc(db, 'enrollments', studentId, 'courses', course.id);
        const existing = await getDoc(enrollRef);
        if (existing.exists()) return { success: false, error: 'You are already enrolled in this course.' };

        // Write enrollment
        await setDoc(enrollRef, {
            courseId: course.id,
            title: course.title,
            description: course.description,
            totalLessons: course.totalLessons,
            topics: course.topics,
            educatorName: course.educatorName,
            enrollCode: upperCode,
            completedLessons: 0,
            percent: 0,
            lastTopic: course.topics?.[0] ?? 'Getting Started',
            enrolledAt: serverTimestamp(),
        });
        await updateDoc(doc(db, 'courses', course.id), {
            enrolledCount: (course.enrolledCount ?? 0) + 1,
        });

        return { success: true };
    } catch {
        return { success: false, error: 'Something went wrong. Please try again.' };
    }
}

export function subscribeToEnrollments(
    studentId: string,
    callback: (enrollments: Enrollment[]) => void
): Unsubscribe {
    const ref = collection(db, 'enrollments', studentId, 'courses');
    return onSnapshot(ref, (snap) => {
        const enrolls = snap.docs.map((d) => ({ courseId: d.id, ...d.data() } as Enrollment));
        enrolls.sort((a, b) => {
            const dateA = (a.enrolledAt as any)?.toDate?.() || new Date(0);
            const dateB = (b.enrolledAt as any)?.toDate?.() || new Date(0);
            return dateB - dateA;
        });
        callback(enrolls);
    });
}

export async function updateProgress(
    studentId: string,
    courseId: string,
    completedLessons: number,
    totalLessons: number,
    lastTopic: string
) {
    const percent = Math.round((completedLessons / totalLessons) * 100);
    await setDoc(
        doc(db, 'enrollments', studentId, 'courses', courseId),
        { completedLessons, percent, lastTopic },
        { merge: true }
    );
}

// ─── Activity Feed (Student) ──────────────────────────────────────────────────

export interface ActivityEvent {
    id: string;
    type: 'enrolled' | 'lesson_completed' | 'quiz_passed' | 'achievement';
    title: string;
    createdAt: unknown;
}

export async function logActivity(
    uid: string,
    event: Omit<ActivityEvent, 'id' | 'createdAt'>
) {
    await addDoc(collection(db, 'activity', uid, 'events'), {
        ...event,
        createdAt: serverTimestamp(),
    });
}

export function subscribeToActivity(
    uid: string,
    callback: (events: ActivityEvent[]) => void
): Unsubscribe {
    const q = query(
        collection(db, 'activity', uid, 'events')
    );
    return onSnapshot(q, (snap) => {
        const events = snap.docs.map((d) => ({ id: d.id, ...d.data() } as ActivityEvent));
        events.sort((a, b) => {
            const dateA = (a.createdAt as any)?.toDate?.() || new Date(0);
            const dateB = (b.createdAt as any)?.toDate?.() || new Date(0);
            return dateB - dateA;
        });
        callback(events);
    });
}
