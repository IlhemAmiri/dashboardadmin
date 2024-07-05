"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';
import SideNavbar from '../../components/SideNavbar';

export default function UpdateFAQPage() {
    const router = useRouter();
    const params = useParams();
    const faqId = params.faqId;

    const [faq, setFaq] = useState({ question: '', answer: '' });

    useEffect(() => {
        if (faqId) {
            fetchFaq();
        }
    }, [faqId]);

    const fetchFaq = async () => {
        try {
            const response = await axios.get(`http://localhost:3001/faq/${faqId}`);
            setFaq(response.data);
        } catch (error) {
            console.error('Error fetching FAQ:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFaq({ ...faq, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:3001/faq/${faqId}`, faq, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            router.push('/faq');
        } catch (error) {
            console.error('Error updating FAQ:', error);
        }
    };

    if (!faqId) {
        return <div>Loading...</div>;
    }

    return (
        <div className="flex flex-col md:flex-row bg-white min-h-screen">
            <SideNavbar />
            <div className="flex-1 ml-0 md:ml-60 py-8 px-4 transition-all duration-300">
                <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                    <h2 className="text-2xl md:text-4xl font-semibold mb-8">Update FAQ</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="mb-4">
                            <label className="block text-gray-700">Question</label>
                            <input
                                type="text"
                                name="question"
                                className="w-full mt-2 p-2 border border-gray-300 rounded"
                                value={faq.question}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700">Answer</label>
                            <textarea
                                name="answer"
                                className="w-full mt-2 p-2 border border-gray-300 rounded"
                                value={faq.answer}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="flex justify-end space-x-4">
                            <Link href="/faq">
                                <div className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition duration-200 cursor-pointer">
                                    Cancel
                                </div>
                            </Link>
                            <button
                                type="submit"
                                className="bg-[#1ECB15] text-white py-2 px-4 rounded hover:bg-green-600 transition duration-200"
                            >
                                Update FAQ
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
