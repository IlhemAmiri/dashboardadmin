"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import SideNavbar from '../components/SideNavbar';

interface User {
    _id: string;
    email: string;
    role: string;
    image?: string;
    nom:string;
    prenom:string;

}

const ProfilePage = () => {
    const [isMounted, setIsMounted] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isAuth, setIsAuth] = useState(false);

    const router = useRouter();

    useEffect(() => {
        setIsMounted(true);
        const role = localStorage.getItem('role');
        setIsAdmin(role === 'admin');
        if (role !== 'admin') {
            router.push('/');
        } else {
            const authStatus = localStorage.getItem('isAuth') === 'true';
            setIsAuth(authStatus);
            fetchUsers();
        }
    }, [router]);

    const fetchUsers = async () => {
        try {
            const response = await fetch('http://localhost:3001/users', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (!response.ok) {
                throw new Error('Failed to fetch users');
            }
            const users: User[] = await response.json();
           
        } catch (error) {
            console.error(error);
        }
    };

    if (!isMounted || !isAdmin) {
        return null;
    }

    return (
        <div className="flex bg-white min-h-screen">
        <SideNavbar />
        <div className="flex-1 ml-[280px] py-8 px-4 transition-all duration-300">
           
        </div>
    </div>
    

    );
};

export default ProfilePage;
