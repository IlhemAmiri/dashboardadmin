"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import SideNavbar from '../../components/SideNavbar';

const PaymentRecordPage = ({ params }) => {
    const [reservation, setReservation] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const { reservationId } = params;

    useEffect(() => {
        const fetchReservation = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/reservations/${reservationId}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setReservation(response.data);
                setIsLoading(false);
            } catch (error) {
                console.error('Failed to fetch reservation', error);
                router.push('/404');
            }
        };

        fetchReservation();
    }, [reservationId, router]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!reservation) {
        return <div>Reservation not found</div>;
    }

    return (
        <div className="flex flex-col md:flex-row bg-white min-h-screen">
        <SideNavbar />
        <div className="flex-1 ml-0 md:ml-60 py-8 px-4 transition-all duration-300">
        <div className="max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-lg">
            <h1 className="text-3xl font-bold mb-8 text-center">Payment Record</h1>
            <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Client Information</h2>
                <div className="flex items-center mb-4">
                    <img src={reservation.idClient.image} alt="Client Profile" className="rounded-full w-24 h-24 mr-4" />
                    <div>
                        <p><strong>Name:</strong> {reservation.idClient.nom} {reservation.idClient.prenom}</p>
                        <p><strong>Email:</strong> {reservation.idClient.email}</p>
                        <p><strong>Address:</strong> {reservation.idClient.adresse}</p>
                        <p><strong>Phone:</strong> {reservation.idClient.numTel}</p>
                        <p><strong>Date of Birth:</strong> {new Date(reservation.idClient.dateNaissance).toLocaleDateString()}</p>
                        <p><strong>Driver's License Number:</strong> {reservation.idClient.numPermisConduire}</p>
                        <p><strong>License Expiration Date:</strong> {new Date(reservation.idClient.dateExpirationPermis).toLocaleDateString()}</p>
                    </div>
                </div>
            </div>

            <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Car Information</h2>
                <div className="grid grid-cols-3 gap-4">
                    <div className="flex items-center justify-center">
                        <img src={reservation.idVoiture.image} alt="Car" className="w-48 h-32 object-cover" />
                    </div>
                    <div>
                        <p><strong>Vehicle Type:</strong> {reservation.idVoiture.vehicleType}</p>
                        <p><strong>Make:</strong> {reservation.idVoiture.marque}</p>
                        <p><strong>Model:</strong> {reservation.idVoiture.modele}</p>
                        <p><strong>Year:</strong> {reservation.idVoiture.anneeFabrication}</p>
                        <p><strong>Category:</strong> {reservation.idVoiture.categorie}</p>

                    </div>
                    <div>
                        <p><strong>Fuel Type:</strong> {reservation.idVoiture.typeCarburant}</p>
                        <p><strong>Transmission Type:</strong> {reservation.idVoiture.typeTransmission}</p>
                        <p><strong>Number of Seats:</strong> {reservation.idVoiture.NbPlaces}</p>
                        <p><strong>Number of Doors:</strong> {reservation.idVoiture.NbPortes}</p>
                        <p><strong>Price per Day:</strong> {reservation.idVoiture.prixParJ} $</p>

                    </div>
                </div>
            </div>

            <div>
                <h2 className="text-2xl font-semibold mb-4">Reservation Information</h2>
                <table className="min-w-full bg-white mb-8">
                    <tbody>
                        <tr className="border-b">
                            <td className="py-2 px-4 font-semibold">Start Date</td>
                            <td className="py-2 px-4">{new Date(reservation.dateDebut).toLocaleDateString()}</td>
                        </tr>
                        <tr className="border-b">
                            <td className="py-2 px-4 font-semibold">End Date</td>
                            <td className="py-2 px-4">{new Date(reservation.dateFin).toLocaleDateString()}</td>
                        </tr>
                        <tr className="border-b">
                            <td className="py-2 px-4 font-semibold">Payment Status</td>
                            <td className="py-2 px-4">{reservation.statusPaiement}</td>
                        </tr>
                        <tr className="border-b">
                            <td className="py-2 px-4 font-semibold">Pickup Location</td>
                            <td className="py-2 px-4">{reservation.lieuRamassage}</td>
                        </tr>
                        <tr className="border-b">
                            <td className="py-2 px-4 font-semibold">Destination</td>
                            <td className="py-2 px-4">{reservation.destination}</td>
                        </tr>
                        <tr className="border-b">
                            <td className="py-2 px-4 font-semibold">Comment</td>
                            <td className="py-2 px-4">{reservation.commentaire}</td>
                        </tr>
                        <tr className="border-b bg-gray-100">
                            <td className="py-4 px-4 font-semibold text-xl">Total Price</td>
                            <td className="py-4 px-4 font-semibold text-xl">{reservation.tarifTotale} $</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        </div>
        </div>

    );
};

export default PaymentRecordPage;
