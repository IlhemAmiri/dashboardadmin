"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SideNavbar from '../components/SideNavbar';

const AddFaqPage = () => {
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
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

    const handleAddFaq = async () => {
        if (!isMounted) return;

        const faqData = { question, answer };

        try {
            const response = await fetch('http://localhost:3001/faq', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(faqData)
            });
            if (!response.ok) {
                throw new Error('Failed to add FAQ');
            }
            router.push('/faq');
        } catch (error) {
            setError('Failed to add FAQ');
        }
    };

    if (!isMounted || !isAdmin) {
        return null;
    }

    return (
        <div className="flex flex-col md:flex-row bg-white min-h-screen">
            <SideNavbar />
            <div className="flex-1 ml-0 md:ml-60 p-8 transition-all duration-300">
                <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                    <h1 className="text-2xl md:text-4xl font-semibold mb-8">Add FAQ</h1>
                    {error && <p className="text-red-500 mb-4">{error}</p>}
                    <div className="mb-4">
                        <label className="block text-gray-700">Question</label>
                        <input
                            type="text"
                            className="w-full mt-2 p-2 border border-gray-300 rounded"
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Answer</label>
                        <textarea
                            className="w-full mt-2 p-2 border border-gray-300 rounded"
                            value={answer}
                            onChange={(e) => setAnswer(e.target.value)}
                        />
                    </div>
                    <button
                        className="bg-[#1ECB15] text-white py-2 px-4 rounded hover:bg-green-600 transition duration-200"
                        onClick={handleAddFaq}
                    >
                        Add FAQ
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddFaqPage;
