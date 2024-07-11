"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Bar, Pie } from 'react-chartjs-2';
import SideNavbar from '../components/SideNavbar';
import { 
    Chart as ChartJS, 
    CategoryScale, 
    LinearScale, 
    BarElement, 
    Title, 
    Tooltip, 
    Legend, 
    ArcElement 
} from 'chart.js';

ChartJS.register(
    CategoryScale, 
    LinearScale, 
    BarElement, 
    Title, 
    Tooltip, 
    Legend, 
    ArcElement
);

const Dashboard = () => {
    const router = useRouter();
    const [reservations, setReservations] = useState([]);
    const [topOneCar, setTopOneCar] = useState(null);
    const [topThreeCars, setTopThreeCars] = useState([]);
    const [isMounted, setIsMounted] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        const role = localStorage.getItem('role');
        setIsAdmin(role === 'admin');
        if (role === 'admin') {
            fetchReservations();
            fetchTopReservedCars();
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

    const fetchTopReservedCars = async () => {
        try {
            const [topOneResponse, topThreeResponse] = await Promise.all([
                axios.get('http://localhost:3001/reservations/top/one', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }),
                axios.get('http://localhost:3001/reservations/top/three', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                })
            ]);
            setTopOneCar(topOneResponse.data);
            setTopThreeCars(topThreeResponse.data);
        } catch (error) {
            console.error('Failed to fetch top reserved cars', error);
        }
    };

    if (!isMounted || !isAdmin) {
        return null;
    }

    const confirmedReservations = reservations.filter(reservation => reservation.status === 'confirmer');
    const payeeReservations = confirmedReservations.filter(reservation => reservation.statusPaiement === 'payee');
    const nonPayeeReservations = confirmedReservations.filter(reservation => reservation.statusPaiement !== 'payee');
    const pendingReservations = reservations.filter(reservation => reservation.status === 'en Attent');
    const cancelledReservations = reservations.filter(reservation => reservation.status === 'annuler');
    const pastReservations = reservations.filter(reservation => new Date(reservation.dateDebut) < new Date());

    const reservationCounts = {
        confirmed: confirmedReservations.length,
        payee: payeeReservations.length,
        nonPayee: nonPayeeReservations.length,
        pending: pendingReservations.length,
        cancelled: cancelledReservations.length,
        past: pastReservations.length,
    };

    const barData = {
        labels: ['Confirmed', 'Paid', 'Unpaid', 'Pending', 'Cancelled', 'Past'],
        datasets: [
            {
                label: '# of Reservations',
                data: [
                    reservationCounts.confirmed,
                    reservationCounts.payee,
                    reservationCounts.nonPayee,
                    reservationCounts.pending,
                    reservationCounts.cancelled,
                    reservationCounts.past,
                ],
                backgroundColor: [
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(255, 159, 64, 0.6)',
                    'rgba(153, 102, 255, 0.6)',
                    'rgba(255, 99, 132, 0.6)',
                ],
                borderColor: [
                    'rgba(75, 192, 192, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 99, 132, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    const pieData = {
        labels: ['Paid', 'Unpaid'],
        datasets: [
            {
                label: '# of Reservations',
                data: [reservationCounts.payee, reservationCounts.nonPayee],
                backgroundColor: ['rgba(54, 162, 235, 0.6)', 'rgba(255, 206, 86, 0.6)'],
                borderColor: ['rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)'],
                borderWidth: 1,
            },
        ],
    };

    return (
        <div className="flex flex-col md:flex-row bg-gray-100 min-h-screen">
            <SideNavbar />
            <div className="flex-1 ml-0 md:ml-60 py-8 px-4 transition-all duration-300">
                <h1 className="text-3xl font-bold mb-8 text-gray-800">Admin Dashboard</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-white shadow-md rounded-lg p-6">
                        <h2 className="text-xl font-bold mb-4 text-gray-800">Reservation Statistics</h2>
                        <Bar data={barData} />
                    </div>
                    {topOneCar && (
                        <div className="bg-white shadow-lg rounded-lg p-8">
                            <h2 className="text-2xl font-extrabold mb-6 text-gray-800">Top Reserved Car</h2>
                            <div className="flex flex-col md:flex-row items-center">
                                <img 
                                    src={topOneCar.image} 
                                    alt={topOneCar.marque} 
                                    className="w-48 h-48 object-cover rounded-lg shadow-md" 
                                />
                                <div className="ml-0 md:ml-6 mt-6 md:mt-0">
                                    <h3 className="text-3xl font-bold text-gray-800">
                                        {topOneCar.marque} {topOneCar.modele}
                                    </h3>
                                    <p className="text-lg text-gray-600 mt-2">Year: {topOneCar.anneeFabrication}</p>
                                    <p className="text-lg text-gray-600 mt-2">Asking Price: ${topOneCar.prixParJ} USD</p>
                                    <div className="grid grid-cols-2 gap-4 mt-4">
                                        <div className="flex flex-col items-center">
                                            <div className="bg-violet-200 p-4 rounded-lg shadow-md">
                                                <span className="block text-sm font-semibold text-gray-700">Kilometrage</span>
                                                <span className="text-lg font-bold text-gray-800">{topOneCar.kilometrage}</span>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-center">
                                            <div className="bg-blue-200 p-4 rounded-lg shadow-md">
                                                <span className="block text-sm font-semibold text-gray-700">Fuel</span>
                                                <span className="text-lg font-bold text-gray-800">{topOneCar.typeCarburant}</span>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-center">
                                            <div className="bg-yellow-200 p-4 rounded-lg shadow-md">
                                                <span className="block text-sm font-semibold text-gray-700">Doors</span>
                                                <span className="text-lg font-bold text-gray-800">{topOneCar.NbPortes}</span>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-center">
                                            <div className="bg-pink-200 p-4 rounded-lg shadow-md">
                                                <span className="block text-sm font-semibold text-gray-700">Seats</span>
                                                <span className="text-lg font-bold text-gray-800">{topOneCar.NbPlaces}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    <div className="bg-white shadow-md rounded-lg p-6">
                        <h2 className="text-xl font-bold mb-4 text-gray-800">Payment Status</h2>
                        <Pie data={pieData} />
                    </div>
                    {topThreeCars.length > 0 && (
                        <div className="bg-white shadow-md rounded-lg p-6 max-h-[450px]">
                            <h2 className="text-xl font-bold mb-4 text-gray-800">Top 3 Reserved Cars</h2>
                            <table className="min-w-full bg-white">
                                <thead>
                                    <tr>
                                        <th className="py-2">Image</th>
                                        <th className="py-2">Car</th>
                                        <th className="py-2">Price</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {topThreeCars.map((car, index) => (
                                        <tr key={index} className="border-t">
                                            <td className="py-2">
                                                <img 
                                                    src={car.image} 
                                                    alt={car.marque} 
                                                    className="w-20 h-20 object-cover rounded-full shadow-md" 
                                                />
                                            </td>
                                            <td className="py-2">{car.marque} {car.modele}</td>
                                            <td className="py-2">${car.prixParJ} USD</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
