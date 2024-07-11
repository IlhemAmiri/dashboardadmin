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

interface SocialMedia {
    numTel: string;
    email: string;
    tempsDeTravail: string;
    lienFacebook?: string;
    lienTwitter?: string;
    lienYoutube?: string;
    lienPinterest?: string;
    lienInstagram?: string;
    localisation?: string;
}

const ProfilePage: React.FC = () => {
    const [admins, setAdmins] = useState<User[]>([]);
    const [socialMedia, setSocialMedia] = useState<SocialMedia>({
        numTel: '',
        email: '',
        tempsDeTravail: '',
        lienFacebook: '',
        lienTwitter: '',
        lienYoutube: '',
        lienPinterest: '',
        lienInstagram: '',
        localisation: ''
    });
    const [isMounted, setIsMounted] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isAuth, setIsAuth] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

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
            fetchSocialMedia();
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

    const fetchSocialMedia = async () => {
        try {
            const response = await fetch('http://localhost:3001/socialmedia', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (!response.ok) {
                throw new Error('Failed to fetch social media');
            }
            const socialMediaData: SocialMedia = await response.json();
            setSocialMedia(socialMediaData);
        } catch (error) {
            console.error(error);
        }
    };

    const handleSocialMediaSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            const method = socialMedia?.numTel ? 'PATCH' : 'POST';
            const response = await fetch('http://localhost:3001/socialmedia', {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(socialMedia)
            });
            if (!response.ok) {
                throw new Error('Failed to save social media');
            }
            fetchSocialMedia();
            setMessage('Social media information saved successfully.');
        } catch (error) {
            console.error(error);
            setMessage('Failed to save social media information.');
        }
    };

    const handleSocialMediaDelete = async () => {
        try {
            const response = await fetch('http://localhost:3001/socialmedia', {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (!response.ok) {
                throw new Error('Failed to delete social media');
            }
            setSocialMedia({
                numTel: '',
                email: '',
                tempsDeTravail: '',
                lienFacebook: '',
                lienTwitter: '',
                lienYoutube: '',
                lienPinterest: '',
                lienInstagram: '',
                localisation: ''
            });
            setMessage('Social media information deleted successfully.');
        } catch (error) {
            console.error(error);
            setMessage('Failed to delete social media information.');
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
                    {message && <div className="mb-4 text-center text-green-500">{message}</div>}
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
                    <form onSubmit={handleSocialMediaSubmit} className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-2xl font-bold text-gray-800 mb-4">Social Media Information</h3>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Phone Number:</label>
                            <input
                                type="text"
                                value={socialMedia?.numTel || ''}
                                onChange={(e) => setSocialMedia({ ...socialMedia, numTel: e.target.value })}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Email:</label>
                            <input
                                type="email"
                                value={socialMedia?.email || ''}
                                onChange={(e) => setSocialMedia({ ...socialMedia, email: e.target.value })}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Working Hours:</label>
                            <input
                                type="text"
                                value={socialMedia?.tempsDeTravail || ''}
                                onChange={(e) => setSocialMedia({ ...socialMedia, tempsDeTravail: e.target.value })}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Facebook Link:</label>
                            <input
                                type="text"
                                value={socialMedia?.lienFacebook || ''}
                                onChange={(e) => setSocialMedia({ ...socialMedia, lienFacebook: e.target.value })}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Twitter Link:</label>
                            <input
                                type="text"
                                value={socialMedia?.lienTwitter || ''}
                                onChange={(e) => setSocialMedia({ ...socialMedia, lienTwitter: e.target.value })}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">YouTube Link:</label>
                            <input
                                type="text"
                                value={socialMedia?.lienYoutube || ''}
                                onChange={(e) => setSocialMedia({ ...socialMedia, lienYoutube: e.target.value })}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Pinterest Link:</label>
                            <input
                                type="text"
                                value={socialMedia?.lienPinterest || ''}
                                onChange={(e) => setSocialMedia({ ...socialMedia, lienPinterest: e.target.value })}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Instagram Link:</label>
                            <input
                                type="text"
                                value={socialMedia?.lienInstagram || ''}
                                onChange={(e) => setSocialMedia({ ...socialMedia, lienInstagram: e.target.value })}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Location:</label>
                            <input
                                type="text"
                                value={socialMedia?.localisation || ''}
                                onChange={(e) => setSocialMedia({ ...socialMedia, localisation: e.target.value })}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <button
                                type="submit"
                                className="bg-[#1ECB15]  hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            >
                                {socialMedia?.numTel ? 'Update' : 'Add'}
                            </button>
                            {socialMedia?.numTel && (
                                <button
                                    type="button"
                                    onClick={handleSocialMediaDelete}
                                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                >
                                    Delete
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
