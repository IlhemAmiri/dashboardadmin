"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faMapMarkerAlt, faPhone, faBirthdayCake, faIdCard, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
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
            <div className="flex-1 ml-0 md:ml-60 py-10 px-8 transition-all duration-300">
                {userData && (
                    <div className="w-full max-w-4xl mx-auto rounded-lg p-8">
                        <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">Fiche Client</h1>
                        <div className="flex flex-col items-center md:flex-row md:items-start md:space-x-24">
                            {userData.image && (
                                <img
                                    src={userData.image}
                                    alt="User"
                                    className="w-40 h-50 rounded-full mb-6 md:mb-0 border-4 border-gray-300 shadow-sm"
                                />
                            )}
                            <div className="w-full space-y-6">
                                <div className="flex items-center text-xl mb-4">
                                    <FontAwesomeIcon icon={faUser} className="text-gray-700 mr-4" />
                                    <p><strong className="font-semibold text-gray-700">Nom complet:</strong> {userData.nom} {userData.prenom}</p>
                                </div>
                                <div className="flex items-center text-xl mb-4">
                                    <FontAwesomeIcon icon={faEnvelope} className="text-gray-700 mr-4" />
                                    <p><strong className="font-semibold text-gray-700">Email:</strong> {userData.email}</p>
                                </div>
                                <div className="flex items-center text-xl mb-4">
                                    <FontAwesomeIcon icon={faMapMarkerAlt} className="text-gray-700 mr-4" />
                                    <p><strong className="font-semibold text-gray-700">Adresse:</strong> {userData.adresse}</p>
                                </div>
                                <div className="flex items-center text-xl mb-4">
                                    <FontAwesomeIcon icon={faPhone} className="text-gray-700 mr-4" />
                                    <p><strong className="font-semibold text-gray-700">Numéro de téléphone:</strong> {userData.numTel}</p>
                                </div>
                                <div className="flex items-center text-xl mb-4">
                                    <FontAwesomeIcon icon={faBirthdayCake} className="text-gray-700 mr-4" />
                                    <p><strong className="font-semibold text-gray-700">Date de naissance:</strong> {new Date(userData.dateNaissance).toLocaleDateString()}</p>
                                </div>
                                <div className="flex items-center text-xl mb-4">
                                    <FontAwesomeIcon icon={faIdCard} className="text-gray-700 mr-4" />
                                    <p><strong className="font-semibold text-gray-700">Numéro de permis de conduire:</strong> {userData.numPermisConduire}</p>
                                </div>
                                <div className="flex items-center text-xl mb-4">
                                    <FontAwesomeIcon icon={faCalendarAlt} className="text-gray-700 mr-4" />
                                    <p><strong className="font-semibold text-gray-700">Date d'expiration du permis:</strong> {new Date(userData.dateExpirationPermis).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserDetailsPage;
