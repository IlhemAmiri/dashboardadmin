"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import SideNavbar from '../components/SideNavbar';

interface User {
    _id: string;
    email: string;
    role: string;
    image?: string;
    nom: string;
    prenom: string;
}

const ProfilePage = () => {
    const [admins, setAdmins] = useState<User[]>([]);
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
            const adminUsers = users.filter(user => user.role === 'admin');
            setAdmins(adminUsers);
        } catch (error) {
            console.error(error);
        }
    };

    if (!isMounted || !isAdmin) {
        return null;
    }

    return (
        <div className="flex bg-gray-100 min-h-screen">
            <SideNavbar />
            <div className="flex-1 ml-0 md:ml-60 py-8 px-4 transition-all duration-300">
                <div className="container mx-auto py-8 px-4">
                    <h2 className="text-4xl font-bold text-gray-800 mb-12 text-center">Admin Profile</h2>
                    {admins.map(admin => (
                        <div key={admin._id} className="flex flex-col md:flex-row items-center bg-transparent py-8 mb-12">
                            <div className="w-full md:w-1/3 flex justify-center mb-4 md:mb-0">
                                {admin.image ? (
                                    <img src={admin.image} alt="Admin" className="w-48 h-48 rounded-full object-cover border-4 border-gray-300" />
                                ) : (
                                    <div className="w-48 h-48 rounded-full bg-gray-200 flex items-center justify-center border-4 border-gray-300">
                                        <img src='/images/avatar.png' alt="No Image" className="w-32 h-32 rounded-full" />
                                    </div>
                                )}
                            </div>
                            <div className="w-full md:w-2/3 flex flex-col items-center md:items-start pl-8">
                                <h3 className="text-3xl font-bold text-gray-800 mb-2">{admin.nom} {admin.prenom}</h3>
                                <p className="text-gray-600 mb-2"><strong>Email:</strong> {admin.email}</p>
                                <p className="text-gray-600 mb-2"><strong>Role:</strong> {admin.role}</p>
                                <p className="text-gray-600 mb-4">"Dedicated to optimizing our car rental services and ensuring customer satisfaction."</p>
                                <p className="text-gray-600 mb-4">"Oversees the smooth operation of the car rental process, from booking to return."</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>


    );
};

export default ProfilePage;
