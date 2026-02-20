'use client';

import { useState, useEffect } from 'react';
import { subscribeToEducatorCourses, Course, createCourse } from '@/lib/firestore';
import { useAuth } from '@/components/auth-provider';

export function useEducatorData() {
    const { user, profile } = useAuth();
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;

        const unsub = subscribeToEducatorCourses(user.uid, (data) => {
            setCourses(data);
            setLoading(false);
        });

        const timer = setTimeout(() => setLoading(false), 2000);
        return () => { unsub(); clearTimeout(timer); };
    }, [user]);

    const totalEnrolled = courses.reduce((acc, c) => acc + (c.enrolledCount ?? 0), 0);

    async function addCourse(data: {
        title: string;
        description: string;
        totalLessons: number;
        topics: string[];
        lessons?: { title: string; content: string }[];
    }) {
        if (!user || !profile) return null;
        const id = await createCourse(user.uid, profile.name, data);
        return id;
    }

    return { courses, loading, totalEnrolled, addCourse };
}
