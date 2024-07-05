"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import SideNavbar from '../components/SideNavbar';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

export default function FAQPage() {
    const [faqs, setFaqs] = useState([]);
    const [openIndexes, setOpenIndexes] = useState([]);
    const [isAuth, setIsAuth] = useState(false);

    useEffect(() => {
        const authStatus = localStorage.getItem('isAuth') === 'true';
        setIsAuth(authStatus);

        const fetchFaqs = async () => {
            try {
                const response = await axios.get('http://localhost:3001/faq');
                setFaqs(response.data);
            } catch (error) {
                console.error('Error fetching FAQs:', error);
            }
        };

        fetchFaqs();
    }, []);

    const toggleFaq = (index) => {
        setOpenIndexes((prevOpenIndexes) =>
            prevOpenIndexes.includes(index)
                ? prevOpenIndexes.filter((i) => i !== index)
                : [...prevOpenIndexes, index]
        );
    };

    const deleteFaq = async (id) => {
        try {
            await axios.delete(`http://localhost:3001/faq/${id}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            setFaqs(faqs.filter(faq => faq._id !== id));
        } catch (error) {
            console.error('Error deleting FAQ:', error);
        }
    };


    return (
        <div className="flex flex-col md:flex-row bg-white min-h-screen">
            <SideNavbar />
            <div className="flex-1 ml-0 md:ml-60 py-8 px-4 transition-all duration-300">
                <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-center mb-8 p-6 space-y-4 md:space-y-0">
                        <h2 className="font-outfit text-2xl md:text-4xl leading-tight md:leading-snug tracking-tight font-semibold text-gray-800">
                            Frequently Asked Questions
                        </h2>
                        <Link href={`/addfaq`}>
                            <button className="bg-[#1ECB15] text-white py-2 px-4 rounded-full hover:bg-green-600 transition duration-200">
                                Add FAQ
                            </button>
                        </Link>
                    </div>
                    <div className="flex flex-wrap -mx-4">
                        <div className="w-full sm:w-1/2 px-4">
                            {faqs.filter((_, i) => i % 2 === 0).map((faq, index) => (
                                <div key={index} className="mb-8">
                                    <div className="bg-white border border-gray-300 rounded-lg shadow-lg overflow-hidden">
                                        <div
                                            className="p-6 flex justify-between items-center cursor-pointer transition-all duration-300 ease-in-out hover:bg-gray-100"
                                            onClick={() => toggleFaq(index)}
                                        >
                                            <span className="text-lg font-semibold text-gray-800">{faq.question}</span>
                                            <button className="text-2xl font-bold text-green-500">
                                                {openIndexes.includes(index) ? '−' : '+'}
                                            </button>
                                        </div>
                                        <div
                                            className={`transition-all duration-500 ease-in-out overflow-hidden ${openIndexes.includes(index) ? 'max-h-screen' : 'max-h-0'
                                                }`}
                                        >
                                            {openIndexes.includes(index) && (
                                                <div className="p-6 bg-gray-50 border-t border-gray-300">
                                                    {faq.answer}
                                                    <div className="flex space-x-4 mt-4">
                                                        <Link href={`/updateFaq/${faq._id}`}>
                                                            <button className="bg-[#1ECB15] text-white py-2 px-4 rounded hover:bg-green-600 transition duration-200">
                                                                <FontAwesomeIcon icon={faEdit} />
                                                            </button>
                                                        </Link>
                                                        <button
                                                            className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition duration-200"
                                                            onClick={() => deleteFaq(faq._id)}
                                                        >
                                                            <FontAwesomeIcon icon={faTrash} />
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="w-full sm:w-1/2 px-4">
                            {faqs.filter((_, i) => i % 2 !== 0).map((faq, index) => (
                                <div key={index + faqs.length} className="mb-8">
                                    <div className="bg-white border border-gray-300 rounded-lg shadow-lg overflow-hidden">
                                        <div
                                            className="p-6 flex justify-between items-center cursor-pointer transition-all duration-300 ease-in-out hover:bg-gray-100"
                                            onClick={() => toggleFaq(index + faqs.length)}
                                        >
                                            <span className="text-lg font-semibold text-gray-800">{faq.question}</span>
                                            <button className="text-2xl font-bold text-green-500">
                                                {openIndexes.includes(index + faqs.length) ? '−' : '+'}
                                            </button>
                                        </div>
                                        <div
                                            className={`transition-all duration-500 ease-in-out overflow-hidden ${openIndexes.includes(index + faqs.length) ? 'max-h-screen' : 'max-h-0'
                                                }`}
                                        >
                                            {openIndexes.includes(index + faqs.length) && (
                                                <div className="p-6 bg-gray-50 border-t border-gray-300">
                                                    {faq.answer}
                                                    <div className="flex space-x-4 mt-4">
                                                        <Link href={`/updateFaq/${faq._id}`}>
                                                            <button className="bg-[#1ECB15] text-white py-2 px-4 rounded hover:bg-green-600 transition duration-200">
                                                                <FontAwesomeIcon icon={faEdit} />
                                                            </button>
                                                        </Link>
                                                        <button
                                                            className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition duration-200"
                                                            onClick={() => deleteFaq(faq._id)}
                                                        >
                                                            <FontAwesomeIcon icon={faTrash} />
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
