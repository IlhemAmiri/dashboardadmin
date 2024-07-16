"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import SideNavbar from '../components/SideNavbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileInvoiceDollar } from '@fortawesome/free-solid-svg-icons';

const AllReservationPage = () => {
    const [reservations, setReservations] = useState([]);
    const [isMounted, setIsMounted] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isAuth, setIsAuth] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);

    const [currentPagePaid, setCurrentPagePaid] = useState(1);
    const [currentPageUnpaid, setCurrentPageUnpaid] = useState(1);
    const itemsPerPage = 5;

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

    if (!isMounted || !isAdmin) {
        return null;
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear()}`;
    };

    const toggleMenu = () => {
        setIsCollapsed(!isCollapsed);
    };

    const confirmedReservations = reservations.filter(reservation => reservation.status === 'confirmer');
    const payeeReservations = confirmedReservations.filter(reservation => reservation.statusPaiement === 'payee');
    const nonPayeeReservations = confirmedReservations.filter(reservation => reservation.statusPaiement === 'non payee');

    const totalTarifTotale = payeeReservations.reduce((total, reservation) => total + reservation.tarifTotale, 0);

    const indexOfLastPaid = currentPagePaid * itemsPerPage;
    const indexOfFirstPaid = indexOfLastPaid - itemsPerPage;
    const currentPaidReservations = payeeReservations.slice(indexOfFirstPaid, indexOfLastPaid);

    const indexOfLastUnpaid = currentPageUnpaid * itemsPerPage;
    const indexOfFirstUnpaid = indexOfLastUnpaid - itemsPerPage;
    const currentUnpaidReservations = nonPayeeReservations.slice(indexOfFirstUnpaid, indexOfLastUnpaid);

    const paginatePaid = (pageNumber) => setCurrentPagePaid(pageNumber);
    const paginateUnpaid = (pageNumber) => setCurrentPageUnpaid(pageNumber);

    return (
        <div className="flex flex-col md:flex-row bg-white min-h-screen">
            <SideNavbar />
            <div className="flex-1 ml-0 md:ml-60 py-8 px-4 transition-all duration-300">
            <div className="mb-8 flex justify-between">
                    <h1 className="text-2xl font-bold">Total Paid Reservations: {totalTarifTotale} $</h1>
                    <Link href="/ConfirmPayment">
                        <button className=" text-green-400 px-4 py-2 rounded">
                            Confirm Cash Payments
                        </button>
                    </Link>
                </div>
                <div>
                    <h2 className="text-xl font-semibold mb-4">Confirmed and Paid Reservations</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white">
                            <thead>
                                <tr>
                                    <th className="px-4 py-2">#</th>
                                    <th className="px-4 py-2">Client</th>
                                    <th className="px-4 py-2">Car</th>
                                    <th className="px-4 py-2">Pickup Location</th>
                                    <th className="px-4 py-2">Destination</th>
                                    <th className="px-4 py-2">Start Date</th>
                                    <th className="px-4 py-2">End Date</th>
                                    <th className="px-4 py-2">Total Fare</th>
                                    <th className="px-4 py-2">Chauffeur</th>
                                    <th className="px-4 py-2">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentPaidReservations.map((reservation, index) => (
                                    <tr key={reservation._id}>
                                        <td className="border px-4 py-2">{indexOfFirstPaid + index + 1}</td>
                                        <td className="border px-4 py-2 flex items-center">
                                            <img src={reservation.idClient.image} alt="Profile" className="rounded-full w-6 h-6 mr-2" />
                                            <Link href={`/user/${reservation.idClient._id}`}>
                                                {reservation.idClient.nom} {reservation.idClient.prenom}
                                            </Link>
                                        </td>
                                        <td className="border px-4 py-2"><Link href={`/detailsCar/${reservation.idVoiture._id}`}>
                                            {reservation.idVoiture.marque} {reservation.idVoiture.modele}
                                        </Link></td>
                                        <td className="border px-4 py-2">{reservation.lieuRamassage}</td>
                                        <td className="border px-4 py-2">{reservation.destination}</td>
                                        <td className="border px-4 py-2">{formatDate(reservation.dateDebut)}</td>
                                        <td className="border px-4 py-2">{formatDate(reservation.dateFin)}</td>
                                        <td className="border px-4 py-2">{reservation.tarifTotale} $</td>
                                        <td className="border px-4 py-2">{reservation.chauffeur ? 'Yes' : 'No'}</td>
                                        <td className="border px-4 py-2">
                                            <Link href={`/fich/${reservation._id}`}>
                                                <button className="text-green-500 rounded">
                                                <FontAwesomeIcon icon={faFileInvoiceDollar} />                                                </button>
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <Pagination
                            itemsPerPage={itemsPerPage}
                            totalItems={payeeReservations.length}
                            paginate={paginatePaid}
                            currentPage={currentPagePaid}
                        />
                    </div>
                </div>
                <div className="mt-8">
                    <h2 className="text-xl font-semibold mb-4">Confirmed and Unpaid Reservations</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white">
                            <thead>
                                <tr>
                                    <th className="px-4 py-2">#</th>
                                    <th className="px-4 py-2">Client</th>
                                    <th className="px-4 py-2">Car</th>
                                    <th className="px-4 py-2">Pickup Location</th>
                                    <th className="px-4 py-2">Destination</th>
                                    <th className="px-4 py-2">Start Date</th>
                                    <th className="px-4 py-2">End Date</th>
                                    <th className="px-4 py-2">Total Fare</th>
                                    <th className="px-4 py-2">Chauffeur</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentUnpaidReservations.map((reservation, index) => (
                                    <tr key={reservation._id}>
                                        <td className="border px-4 py-2">{indexOfFirstUnpaid + index + 1}</td>
                                        <td className="border px-4 py-2 flex items-center">
                                            <img src={reservation.idClient.image} alt="Profile" className="rounded-full w-6 h-6 mr-2" />
                                            <Link href={`/user/${reservation.idClient._id}`}>
                                                {reservation.idClient.nom} {reservation.idClient.prenom}
                                            </Link>
                                        </td>
                                        <td className="border px-4 py-2"><Link href={`/detailsCar/${reservation.idVoiture._id}`}>
                                            {reservation.idVoiture.marque} {reservation.idVoiture.modele}
                                        </Link></td>
                                        <td className="border px-4 py-2">{reservation.lieuRamassage}</td>
                                        <td className="border px-4 py-2">{reservation.destination}</td>
                                        <td className="border px-4 py-2">{formatDate(reservation.dateDebut)}</td>
                                        <td className="border px-4 py-2">{formatDate(reservation.dateFin)}</td>
                                        <td className="border px-4 py-2">{reservation.tarifTotale} $</td>
                                        <td className="border px-4 py-2">{reservation.chauffeur ? 'Yes' : 'No'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <Pagination
                            itemsPerPage={itemsPerPage}
                            totalItems={nonPayeeReservations.length}
                            paginate={paginateUnpaid}
                            currentPage={currentPageUnpaid}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

const Pagination = ({ itemsPerPage, totalItems, paginate, currentPage }) => {
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
        pageNumbers.push(i);
    }

    return (
        <nav className="mt-4">
            <ul className="flex justify-center">
                {pageNumbers.map(number => (
                    <li key={number} className="mx-1">
                        <button
                            onClick={() => paginate(number)}
                            className={`px-3 py-1 border rounded ${currentPage === number ? 'bg-white text-blue-600 ' : 'bg-white text-gray-900'}`}
                        >
                            {number}
                        </button>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default AllReservationPage;
