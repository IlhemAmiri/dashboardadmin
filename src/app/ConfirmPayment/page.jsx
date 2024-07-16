"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import SideNavbar from '../components/SideNavbar';
import Link from 'next/link';

const ConfirmPaymentPage = () => {
    const [payments, setPayments] = useState([]);
    const router = useRouter();

    useEffect(() => {
        const role = localStorage.getItem('role');
        if (role !== 'admin') {
            router.push('/');
        } else {
            const authStatus = localStorage.getItem('isAuth') === 'true';
            if (authStatus) {
                fetchPayments();
            } else {
                router.push('/login'); // Redirect to login if not authenticated
            }
        }
    }, [router]);

    const fetchPayments = async () => {
        try {
            const response = await axios.get('http://localhost:3001/payments', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const filteredPayments = response.data.filter(payment =>
                payment.status === 'payee' && !payment.confirmeParAdmin
            );
            setPayments(filteredPayments);
        } catch (error) {
            console.error('Failed to fetch payments', error);
        }
    };

    const confirmPayment = async (id) => {
        try {
            await axios.patch(`http://localhost:3001/payments/confirm/${id}`, {
                confirmeParAdmin: true
            }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            fetchPayments(); // Refresh payments after confirmation
        } catch (error) {
            console.error('Failed to confirm payment', error);
        }
    };

    return (
        <div className="flex flex-col md:flex-row bg-gradient-to-r from-gray-100 to-gray-200 min-h-screen">
            <SideNavbar />
            <div className="flex-1 ml-0 md:ml-60 py-8 px-4 transition-all duration-300">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Payment Confirmation</h2>
                <div className="overflow-x-auto shadow-lg rounded-lg">
                    <table className="min-w-full bg-white border border-gray-300 rounded-lg">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                                <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reservation Details</th>
                                <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Method</th>
                                <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {payments.map((payment, index) => (
                                <tr key={payment._id} className="hover:bg-gray-100 transition duration-150">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <Link href={`/fich/${payment.idReservation}`}>
                                            <div className="text-blue-600 hover:underline">View Details</div>
                                        </Link>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{payment.methodePaiement}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{payment.status}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <button
                                            onClick={() => confirmPayment(payment._id)}
                                            className="bg-green-500 text-white px-4 py-2 rounded shadow-md transform transition duration-150 hover:scale-105"
                                        >
                                            Accept Payment
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ConfirmPaymentPage;
