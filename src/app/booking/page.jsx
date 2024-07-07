"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import SideNavbar from '../components/SideNavbar';

const AllReservationPage = () => {
    const [reservations, setReservations] = useState([]);
    const [isMounted, setIsMounted] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isAuth, setIsAuth] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [showPastReservations, setShowPastReservations] = useState(false);

    const router = useRouter();

    useEffect(() => {
        setIsMounted(true);
        const role = localStorage.getItem('role');
        setIsAdmin(role === 'admin');
        const authStatus = localStorage.getItem('isAuth') === 'true';
        setIsAuth(authStatus);

        if (role === 'admin') {
            fetchReservations();
        } else {
            router.push('/');
        }
    }, [router]);

    const fetchReservations = async () => {
        try {
            const response = await axios.get('http://localhost:3001/reservations', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            setReservations(response.data);
        } catch (error) {
            console.error('Failed to fetch reservations', error);
        }
    };

    const updateStatus = async (id, newStatus) => {
        try {
            await axios.patch(`http://localhost:3001/reservations/${id}/status`, { status: newStatus }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            fetchReservations(); // Refresh reservations
        } catch (error) {
            console.error('Failed to update status', error);
        }
    };

    if (!isMounted || !isAdmin) {
        return null;
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear()}`;
    };

    const renderTable = (status, showActions = true) => {
        const now = new Date();
        const filteredReservations = reservations.filter(res => {
            const pickUpDate = new Date(res.dateDebut);
            if (showActions) {
                return res.status === status && pickUpDate >= now;
            }
            return pickUpDate < now;
        });

        return (
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-300 rounded-lg">
                    <thead className="bg-gray-500 text-white text-sm">
                        <tr>
                            <th className="px-4 py-2 text-left">Client</th>
                            <th className="px-4 py-2 text-left">Car</th>
                            <th className="px-4 py-2 text-left">Pick Up Location</th>
                            <th className="px-4 py-2 text-left">Drop Off Location</th>
                            <th className="px-4 py-2 text-left">Pick Up Date</th>
                            <th className="px-4 py-2 text-left">Return Date</th>
                            <th className="px-4 py-2 text-left">Total Cost</th>
                            <th className="px-4 py-2 text-left">With Driver</th>
                            {showActions ? <th className="px-4 py-2 text-left">Actions</th> : <th className="px-4 py-2 text-left">Status</th>}
                        </tr>
                    </thead>
                    <tbody className="text-sm divide-y divide-gray-200">
                        {filteredReservations.map(reservation => (
                            <tr key={reservation._id} className="hover:bg-gray-100">
                                <td className="px-4 py-2 whitespace-nowrap flex items-center">
                                    <img src={reservation.idClient.image} alt="Profile" className="rounded-full w-6 h-6 mr-2" />
                                    <Link href={`/user/${reservation.idClient._id}`}>
                                        {reservation.idClient.nom} {reservation.idClient.prenom}
                                    </Link>
                                </td>
                                <td className="px-4 py-2 whitespace-nowrap">
                                    <Link href={`/detailsCar/${reservation.idVoiture._id}`}>
                                        {reservation.idVoiture.marque} {reservation.idVoiture.modele}
                                    </Link>
                                </td>
                                <td className="px-4 py-2 whitespace-nowrap">{reservation.lieuRamassage}</td>
                                <td className="px-4 py-2 whitespace-nowrap">{reservation.destination}</td>
                                <td className="px-4 py-2 whitespace-nowrap">{formatDate(reservation.dateDebut)}</td>
                                <td className="px-4 py-2 whitespace-nowrap">{formatDate(reservation.dateFin)}</td>
                                <td className="px-4 py-2 whitespace-nowrap">{reservation.tarifTotale} $</td>
                                <td className="px-4 py-2 whitespace-nowrap">{reservation.chauffeur ? 'Yes' : 'No'}</td>
                                {showActions ? (
                                    <td className="px-4 py-2 whitespace-nowrap">
                                        <button onClick={() => updateStatus(reservation._id, 'confirmer')} className="mr-2 bg-[#00B74A] text-white rounded-full text-xs px-2 py-1">Confirm</button>
                                        <button onClick={() => updateStatus(reservation._id, 'annuler')} className="mr-2 bg-[#F93154] text-white rounded-full text-xs px-2 py-1">Cancel</button>
                                        <button onClick={() => updateStatus(reservation._id, 'en Attent')} className="bg-[#FFA900] text-white rounded-full text-xs px-2 py-1">Schedule</button>
                                    </td>
                                ) : (
                                    <td className="px-4 py-2 whitespace-nowrap">{reservation.status}</td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    const toggleMenu = () => {
        setIsCollapsed(!isCollapsed);
    };

    return (
        <div className="flex flex-col md:flex-row bg-white min-h-screen">
            <SideNavbar />
            <div className="flex-1 ml-0 md:ml-60 py-8 px-4 transition-all duration-300">
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 space-y-4 md:space-y-0">
                    <h2 className="text-2xl md:text-3xl font-semibold text-gray-800">
                        Booking
                    </h2>
                </div>
                <h2 className="text-xl font-semibold mb-4">Scheduled Reservations</h2>
                {renderTable('en Attent')}
                <h2 className="text-xl font-semibold mb-4 mt-8">Confirmed Reservations</h2>
                {renderTable('confirmer')}
                <h2 className="text-xl font-semibold mb-4 mt-8">Cancelled Reservations</h2>
                {renderTable('annuler')}
                <h2 className="text-xl font-semibold mb-4 mt-8">Past Reservations</h2>
                <div>
                    <button
                        onClick={() => setShowPastReservations(!showPastReservations)}
                        className="bg-blue-500 text-white py-2 px-4 rounded-full hover:bg-blue-600 transition duration-200"
                    >
                        {showPastReservations ? 'Hide' : 'Show'} Past Reservations
                    </button>
                    {showPastReservations && renderTable('past', false)}
                </div>
            </div>
        </div>
    );
};

export default AllReservationPage;
