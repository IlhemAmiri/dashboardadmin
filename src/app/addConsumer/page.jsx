"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SideNavbar from '../components/SideNavbar';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
const Signup = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        nom: '',
        prenom: '',
        CIN: '',
        passport: '',
        adresse: '',
        numTel: '',
        dateNaissance: '',
        numPermisConduire: '',
        dateExpirationPermis: '',
        image: null,
    });
    const [error, setError] = useState('');
    const [isMounted, setIsMounted] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    const router = useRouter();

    useEffect(() => {
        setIsMounted(true);
        const role = localStorage.getItem('role');
        setIsAdmin(role === 'admin');
        if (role !== 'admin') {
            router.push('/');
        }
    }, [router]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };
    const handlePhoneChange = (value) => {
        const formattedValue = value.startsWith('+') ? value : `+${value}`;
        setFormData({ ...formData, numTel: formattedValue });
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, image: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isMounted) return;

        const formDataToSubmit = new FormData();
        for (const key in formData) {
            formDataToSubmit.append(key, formData[key]);
        }

        try {
            const response = await fetch('http://localhost:3001/users/register', {
                method: 'POST',
                body: formDataToSubmit,
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to register: ${errorText}`);
            }

            const data = await response.json();
            console.log('Registration successful:', data);
            router.push('/signin');
        } catch (error) {
            console.error('Error during registration:', error);
            setError(error.message || 'Failed to register');
        }
    };

    if (!isMounted) {
        return null;
    }

    return (
        <div className="flex bg-white min-h-screen">
            <SideNavbar />
            <div className="flex-1 ml-0 md:ml-60 py-8 px-4 transition-all duration-300">

                <div className="w-full px-[12%]">
                    <h2 className="text-[#020202] font-outfit font-semibold text-2xl mb-6">Create an Account</h2>
                    <form onSubmit={handleSubmit} encType="multipart/form-data">
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="nom" className="block text-sm font-medium text-gray-700">First Name</label>
                            <input
                                type="text"
                                id="nom"
                                name="nom"
                                value={formData.nom}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="prenom" className="block text-sm font-medium text-gray-700">Last Name</label>
                            <input
                                type="text"
                                id="prenom"
                                name="prenom"
                                value={formData.prenom}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="CIN" className="block text-sm font-medium text-gray-700">CIN</label>
                            <input
                                type="text"
                                id="CIN"
                                name="CIN"
                                value={formData.CIN}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="passport" className="block text-sm font-medium text-gray-700">Passport</label>
                            <input
                                type="text"
                                id="passport"
                                name="passport"
                                value={formData.passport}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="adresse" className="block text-sm font-medium text-gray-700">Address</label>
                            <input
                                type="text"
                                id="adresse"
                                name="adresse"
                                value={formData.adresse}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="numTel" className="block text-sm font-medium text-gray-700">Phone Number</label>
                            <div className="mt-1 flex items-center">
                                <PhoneInput
                                    country={'tn'} // Définissez ici le pays par défaut souhaité
                                    value={formData.numTel}
                                    onChange={handlePhoneChange}
                                    inputProps={{
                                        name: 'numTel',
                                        required: true,
                                        className: 'block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm',
                                    }}
                                    containerStyle={{
                                        display: 'flex',
                                        flexDirection: 'row-reverse',
                                        alignItems: 'center',
                                        width: '100%',
                                    }}
                                    buttonStyle={{
                                        order: 2,
                                        marginLeft: '10px',
                                    }}
                                    inputStyle={{
                                        flex: '1',
                                    }}
                                />
                            </div>
                        </div>
                        <div className="mb-4">
                            <label htmlFor="dateNaissance" className="block text-sm font-medium text-gray-700">Date of Birth</label>
                            <input
                                type="date"
                                id="dateNaissance"
                                name="dateNaissance"
                                value={formData.dateNaissance}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="numPermisConduire" className="block text-sm font-medium text-gray-700">Driver's License Number</label>
                            <input
                                type="text"
                                id="numPermisConduire"
                                name="numPermisConduire"
                                value={formData.numPermisConduire}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="dateExpirationPermis" className="block text-sm font-medium text-gray-700">Driver's License Expiration Date</label>
                            <input
                                type="date"
                                id="dateExpirationPermis"
                                name="dateExpirationPermis"
                                value={formData.dateExpirationPermis}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="image" className="block text-sm font-medium text-gray-700">Profile Picture</label>
                            <input
                                type="file"
                                id="image"
                                name="image"
                                onChange={handleFileChange}
                                required
                                className="mt-1 block w-full text-sm text-gray-500 file:py-2 file:px-4 file:border file:border-gray-300 file:rounded-md file:text-sm file:bg-white file:text-gray-700 hover:file:bg-gray-100"
                            />
                        </div>
                        {error && (
                            <div className="text-red-500 text-sm mb-4">
                                {error}
                            </div>
                        )}
                        <div className="flex justify-center">
                            <button
                                type="submit"
                                className="w-full bg-[#1ECB15] text-white py-2 px-4 rounded-md shadow-md hover:bg-[#17a714] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#17a714]"
                            >
                                Sign Up
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Signup;
