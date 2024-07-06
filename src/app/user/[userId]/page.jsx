"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SideNavbar from '../../components/SideNavbar';

const UserDetailsPage = () => {
    const [isMounted, setIsMounted] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [isAuth, setIsAuth] = useState(false);
    const [userData, setUserData] = useState(null);

    const router = useRouter();

    useEffect(() => {
        setIsMounted(true);
        const role = localStorage.getItem('role');
        setIsAdmin(role === 'admin');
        if (role !== 'admin') {
            router.push('/');
        }

        const authStatus = localStorage.getItem('isAuth') === 'true';
        setIsAuth(authStatus);

        if (authStatus && role === 'admin') {
            fetchUserData();
        }
    }, [router]);

    const fetchUserData = async () => {
        try {
            const userId = window.location.pathname.split('/').pop(); // Assumes URL pattern /user/[userId]
            const response = await fetch(`http://localhost:3001/users/clients/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setUserData(data);
            } else {
                console.error('Failed to fetch user data');
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    if (!isMounted || !isAdmin) {
        return null;
    }

    const handleLogout = () => {
        localStorage.clear();
        setIsAuth(false);
        router.push('/signin');
    };


    return (
        <div className="flex flex-col md:flex-row bg-white min-h-screen">
            <SideNavbar />
            <div className="flex-1 ml-0 md:ml-60 py-8 px-6 transition-all duration-300">
                {userData && (
                    <div>
                        <h1 className="text-2xl font-bold mb-4">User Details</h1>
                        <div className="flex flex-col items-center">
                            {userData.image && (
                                <img
                                    src={userData.image}
                                    alt="User"
                                    className="w-32 h-32 rounded-full mb-4 border-4 border-gray-200"
                                />
                            )}
                            <div className="w-full">
                                <p className="text-lg mb-2">
                                    <strong className="font-semibold">Full Name:</strong> {userData.nom} {userData.prenom}
                                </p>
                                <p className="text-lg mb-2">
                                    <strong className="font-semibold">Email:</strong> {userData.email}
                                </p>
                                <p className="text-lg mb-2">
                                    <strong className="font-semibold">Address:</strong> {userData.adresse}
                                </p>
                                <p className="text-lg mb-2">
                                    <strong className="font-semibold">Phone Number:</strong> {userData.numTel}
                                </p>
                                <p className="text-lg mb-2">
                                    <strong className="font-semibold">Date of Birth:</strong> {new Date(userData.dateNaissance).toLocaleDateString()}
                                </p>
                                <p className="text-lg mb-2">
                                    <strong className="font-semibold">Driver's License Number:</strong> {userData.numPermisConduire}
                                </p>
                                <p className="text-lg mb-2">
                                    <strong className="font-semibold">License Expiration Date:</strong> {new Date(userData.dateExpirationPermis).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserDetailsPage;
