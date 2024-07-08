"use client";
import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';
import SideNavbar from '../../components/SideNavbar';


const CarReservationHistory = () => {
    const router = useRouter();
    const { carId } = useParams();
    const [car, setCar] = useState(null);
    const [reservations, setReservations] = useState([]);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        const role = localStorage.getItem('role');
        setIsAdmin(role === 'admin');
        if (role !== 'admin') {
            router.push('/');
        }
    }, [router]);

    useEffect(() => {
        if (carId && isMounted) {
            const fetchCarAndReservations = async () => {
                const token = localStorage.getItem('token');
                try {
                    // Fetch car details
                    const carResponse = await axios.get(`http://localhost:3001/cars/${carId}`, {
                        headers: { 'Authorization': `Bearer ${token}` },
                    });
                    setCar(carResponse.data);

                    // Fetch reservations
                    const reservationsResponse = await axios.get(`http://localhost:3001/reservations/car/${carId}`, {
                        headers: { 'Authorization': `Bearer ${token}` },
                    });
                    setReservations(reservationsResponse.data);
                } catch (error) {
                    console.error('Error fetching car and reservations:', error);
                }
            };
            fetchCarAndReservations();
        }
    }, [carId, isMounted]);

    if (!isMounted || !isAdmin) {
        return null;
    }

    return (
        <div className="flex flex-col md:flex-row bg-white min-h-screen">
            <SideNavbar />
            <div className="flex-1 ml-0 md:ml-60 py-8 px-6 transition-all duration-300">
                {car && (
                    <div className="container mx-auto px-[2%] py-[2%] ">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="ont-outfit text-[42px] leading-[50px] tracking-[-1.8px] font-semibold text-gray-800 mb-6">The Car History</h2>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div>
                                <div className="mb-4">
                                    <img src={car.image} alt={car.modele} className="w-full h-80 object-cover rounded-lg shadow-lg" />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <img
                                        src={car.image2 ? car.image2 : car.image}
                                        alt={car.modele}
                                        className="w-full h-40 object-cover rounded-lg shadow-lg"
                                    />
                                    <img
                                        src={car.image3 ? car.image3 : car.image}
                                        alt={car.modele}
                                        className="w-full h-40 object-cover rounded-lg shadow-lg"
                                    />
                                    <img
                                        src={car.image4 ? car.image4 : car.image}
                                        alt={car.modele}
                                        className="w-full h-40 object-cover rounded-lg shadow-lg"
                                    />
                                </div>
                            </div>
                            <div className="bg-white shadow-md rounded-lg p-8">
                                <h2 className="text-3xl font-bold mb-2 text-center py-4">{car.marque} {car.modele} {car.anneeFabrication}</h2>
                                <p className="text-xl text-gray-700 mb-4 text-center">Daily rate</p>
                                <p className="text-[50px] font-bold text-center">${car.prixParJ}</p>
                                <p className="mb-4">{car.caracteristiques}</p>
                                <h3 className="text-xl font-semibold mb-2">Specifications</h3>
                                <ul className="mb-4 divide-y divide-gray-300">
                                    <li className="flex justify-between py-2"><span>Seats</span><span className='font-bold'>{car.NbPlaces} seats</span></li>
                                    <li className="flex justify-between py-2"><span>Doors</span><span className='font-bold'>{car.NbPortes} doors</span></li>
                                    <li className="flex justify-between py-2"><span>Mileage</span><span className='font-bold'>{car.kilometrage} km</span></li>
                                    <li className="flex justify-between py-2"><span>Fuel Type</span><span className='font-bold'>{car.typeCarburant}</span></li>
                                    <li className="flex justify-between py-2"><span>Engine</span><span className='font-bold'>{car.kilometrage}</span></li>
                                    <li className="flex justify-between py-2"><span>Year</span><span className='font-bold '>{car.anneeFabrication}</span></li>
                                    <li className="flex justify-between py-2"><span>Transmission</span><span className='font-bold '>{car.typeTransmission}</span></li>
                                    <li className="flex justify-between py-2"><span>Category</span><span className='font-bold'>{car.categorie}</span></li>
                                    <li className="flex justify-between py-2"><span>Availability</span><span className='font-bold'>{car.disponibilite}</span></li>
                                    <li className="flex justify-between py-2"><span>AC</span><span className='font-bold'>{car.climatisation ? 'Yes' : 'No'}</span></li>
                                </ul>
                                <h3 className="text-xl font-semibold mb-2">Additional Accessories</h3>
                                <p className="mb-4">{car.accessoiresOptionSupp}</p>
                                <h3 className="text-xl font-semibold mb-2">Rental Conditions</h3>
                                <p className="mb-4">{car.conditionDeLocation}</p>
                                {car.offrePromotion && (
                                    <div className="mt-4">
                                        <h3 className="text-xl font-semibold mb-2">Promotional Offer</h3>
                                        <p className="mb-4">{car.offrePromotion}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                        <h1 className="text-2xl font-bold mb-6 mt-12">
                            Reservation History for Car{' '}
                            <span className="text-[#1ECB15]">{car.marque} {car.modele} {car.anneeFabrication}</span>
                        </h1>
                    </div>
                )}
                {reservations.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border rounded-lg overflow-hidden">
                            <thead className="bg-gray-200">
                                <tr>
                                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
                                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Date</th>
                                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Rate</th>
                                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Driver</th>
                                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pickup Location</th>
                                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Destination</th>
                                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Comment</th>
                                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Status</th>
                                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {reservations.map((reservation, index) => (
                                    <tr key={reservation._id} className="hover:bg-gray-100">
                                        <td className="py-3 px-4 whitespace-nowrap text-sm font-medium text-gray-900">{index + 1}</td>
                                        <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-500">{new Date(reservation.dateDebut).toLocaleDateString()}</td>
                                        <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-500">{new Date(reservation.dateFin).toLocaleDateString()}</td>
                                        <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-500">{reservation.tarifTotale} $</td>
                                        <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-500">{reservation.chauffeur ? "Yes" : "No"}</td>
                                        <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-500">{reservation.lieuRamassage}</td>
                                        <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-500">{reservation.destination}</td>
                                        <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-500">{reservation.commentaire}</td>
                                        <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-500">{reservation.statusPaiement}</td>
                                        <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-500">{reservation.idClient.nom} {reservation.idClient.prenom}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p>No reservations found for this car.</p>
                )}
            </div>
        </div>
    );
};

export default CarReservationHistory;
