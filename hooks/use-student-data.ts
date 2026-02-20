'use client';

import { useState, useEffect } from 'react';
import { subscribeToEnrollments, subscribeToActivity, Enrollment, ActivityEvent, enrollWithCode } from '@/lib/firestore';
import { useAuth } from '@/components/auth-provider';

export function useStudentData() {
    const { user } = useAuth();
    const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
    const [activity, setActivity] = useState<ActivityEvent[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;

        const unsubEnroll = subscribeToEnrollments(user.uid, (data) => {
            setEnrollments(data);
            setLoading(false);
        });

        const unsubActivity = subscribeToActivity(user.uid, (data) => {
            setActivity(data);
        });

        const timer = setTimeout(() => setLoading(false), 2000);
        return () => { unsubEnroll(); unsubActivity(); clearTimeout(timer); };
    }, [user]);

    const totalCompleted = enrollments.reduce((acc, e) => acc + e.completedLessons, 0);
    const totalProgress = enrollments.length > 0
        ? Math.round(enrollments.reduce((acc, e) => acc + e.percent, 0) / enrollments.length)
        : 0;

    async function enroll(code: string): Promise<{ success: boolean; error?: string }> {
        if (!user) return { success: false, error: 'You must be signed in.' };
        return enrollWithCode(user.uid, code);
    }

    return { enrollments, activity, totalCompleted, totalProgress, loading, enroll };
}
