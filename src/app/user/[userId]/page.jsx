"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faMapMarkerAlt, faPhone, faBirthdayCake, faIdCard, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import SideNavbar from '../../components/SideNavbar';

const UserDetailsPage = () => {
    const [isMounted, setIsMounted] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [userData, setUserData] = useState(null);
    const [reservations, setReservations] = useState([]);

    const router = useRouter();

    useEffect(() => {
        setIsMounted(true);
        const role = localStorage.getItem('role');
        const authStatus = localStorage.getItem('isAuth') === 'true';

        if (role !== 'admin' || !authStatus) {
            router.push('/');
        } else {
            setIsAdmin(true);
            fetchUserData();
            fetchReservations();
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

    const fetchReservations = async () => {
        try {
            const userId = window.location.pathname.split('/').pop(); // Assumes URL pattern /user/[userId]
            const response = await fetch(`http://localhost:3001/reservations/client/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setReservations(data);
            } else {
                console.error('Failed to fetch reservations');
            }
        } catch (error) {
            console.error('Error fetching reservations:', error);
        }
    };

    const getFilteredReservations = (status, paymentStatus, past = false) => {
        const now = new Date();
        return reservations.filter(reservation => {
            const isPast = new Date(reservation.dateDebut) < now;
            return reservation.status === status &&
                (!paymentStatus || reservation.statusPaiement === paymentStatus) &&
                (past ? isPast : !isPast);
        });
    };

    const getAllPastReservations = () => {
        const now = new Date();
        return reservations.filter(reservation => new Date(reservation.dateDebut) < now);
    };

    if (!isMounted || !isAdmin) {
        return null;
    }

    const renderReservationsTable = (reservationsList) => {
        return (
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border rounded-lg overflow-hidden">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Car</th>
                            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
                            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Date</th>
                            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Rate</th>
                            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Driver</th>
                            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pickup Location</th>
                            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Destination</th>
                            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Comment</th>
                            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Status</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {reservationsList.map((reservation, index) => (
                            <tr key={index} className="hover:bg-gray-100">
                                <td className="py-3 px-4 whitespace-nowrap text-sm font-medium text-gray-900">{index + 1}</td>
                                <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-500">{reservation.idVoiture.marque} {reservation.idVoiture.modele}</td>
                                <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-500">{new Date(reservation.dateDebut).toLocaleDateString()}</td>
                                <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-500">{new Date(reservation.dateFin).toLocaleDateString()}</td>
                                <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-500">{reservation.tarifTotale} $</td>
                                <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-500">{reservation.chauffeur ? "Yes" : "No"}</td>
                                <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-500">{reservation.lieuRamassage}</td>
                                <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-500">{reservation.destination}</td>
                                <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-500">{reservation.commentaire}</td>
                                <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-500">{reservation.statusPaiement}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <div className="flex flex-col md:flex-row bg-white min-h-screen">
            <SideNavbar />
            <div className="flex-1 ml-0 md:ml-60 py-10 px-8 transition-all duration-300">
                {userData && (
                    <div className="w-full max-w-4xl mx-auto rounded-lg p-8">
                        <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">Client Profile</h1>
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
                                    <p><strong className="font-semibold text-gray-700">Full Name:</strong> {userData.nom} {userData.prenom}</p>
                                </div>
                                <div className="flex items-center text-xl mb-4">
                                    <FontAwesomeIcon icon={faEnvelope} className="text-gray-700 mr-4" />
                                    <p><strong className="font-semibold text-gray-700">Email:</strong> {userData.email}</p>
                                </div>
                                <div className="flex items-center text-xl mb-4">
                                    <FontAwesomeIcon icon={faMapMarkerAlt} className="text-gray-700 mr-4" />
                                    <p><strong className="font-semibold text-gray-700">Address:</strong> {userData.adresse}</p>
                                </div>
                                <div className="flex items-center text-xl mb-4">
                                    <FontAwesomeIcon icon={faPhone} className="text-gray-700 mr-4" />
                                    <p><strong className="font-semibold text-gray-700">Phone Number:</strong> {userData.numTel}</p>
                                </div>
                                <div className="flex items-center text-xl mb-4">
                                    <FontAwesomeIcon icon={faBirthdayCake} className="text-gray-700 mr-4" />
                                    <p><strong className="font-semibold text-gray-700">Date of Birth:</strong> {new Date(userData.dateNaissance).toLocaleDateString()}</p>
                                </div>
                                <div className="flex items-center text-xl mb-4">
                                    <FontAwesomeIcon icon={faIdCard} className="text-gray-700 mr-4" />
                                    <p><strong className="font-semibold text-gray-700">Driver's License Number:</strong> {userData.numPermisConduire}</p>
                                </div>
                                <div className="flex items-center text-xl mb-4">
                                    <FontAwesomeIcon icon={faCalendarAlt} className="text-gray-700 mr-4" />
                                    <p><strong className="font-semibold text-gray-700">License Expiry Date:</strong> {new Date(userData.dateExpirationPermis).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="mt-10">
                    <h2 className="text-3xl font-bold mb-6 text-gray-800">Confirmed Reservations - Paid</h2>
                    {renderReservationsTable(getFilteredReservations('confirmer', 'payee'))}
                </div>
                <div className="mt-10">
                    <h2 className="text-3xl font-bold mb-6 text-gray-800">Confirmed Reservations - Unpaid</h2>
                    {renderReservationsTable(getFilteredReservations('confirmer', 'non payee'))}
                </div>
                <div className="mt-10">
                    <h2 className="text-3xl font-bold mb-6 text-gray-800">Pending Reservations</h2>
                    {renderReservationsTable(getFilteredReservations('en Attent'))}
                </div>
                <div className="mt-10">
                    <h2 className="text-3xl font-bold mb-6 text-gray-800">Cancelled Reservations</h2>
                    {renderReservationsTable(getFilteredReservations('annuler'))}
                </div>
                <div className="mt-10">
                    <h2 className="text-3xl font-bold mb-6 text-gray-800">Past Reservations</h2>
                    {renderReservationsTable(getAllPastReservations())}
                </div>
            </div>
        </div>
    );
};

export default UserDetailsPage;
