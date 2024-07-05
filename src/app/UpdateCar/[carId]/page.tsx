"use client";
import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import SideNavbar from '../../components/SideNavbar';

const UpdateCarPage = () => {
    const [marque, setMarque] = useState('');
    const [modele, setModele] = useState('');
    const [anneeFabrication, setAnneeFabrication] = useState<number>(2020);
    const [typeCarburant, setTypeCarburant] = useState('essence');
    const [typeTransmission, setTypeTransmission] = useState('manuelle');
    const [categorie, setCategorie] = useState('compacte');
    const [disponibilite, setDisponibilite] = useState('disponible');
    const [kilometrage, setKilometrage] = useState<number>(0);
    const [NbPlaces, setNbPlaces] = useState<number>(4);
    const [NbPortes, setNbPortes] = useState<number>(4);
    const [climatisation, setClimatisation] = useState<boolean>(false);
    const [caracteristiques, setCaracteristiques] = useState('');
    const [accessoiresOptionSupp, setAccessoiresOptionSupp] = useState('');
    const [prixParJ, setPrixParJ] = useState<number>(0);
    const [image, setImage] = useState<File | null>(null);
    const [image2, setImage2] = useState<File | null>(null);
    const [image3, setImage3] = useState<File | null>(null);
    const [image4, setImage4] = useState<File | null>(null);
    const [error, setError] = useState('');
    const [isMounted, setIsMounted] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);

    const router = useRouter();
    const { carId } = useParams();

    useEffect(() => {
        setIsMounted(true);
        const role = localStorage.getItem('role');
        setIsAdmin(role === 'admin');
        if (role !== 'admin') {
            router.push('/');
        } else {
            fetchCarData();
        }
    }, [router, carId]);

    const fetchCarData = async () => {
        try {
            const response = await fetch(`http://localhost:3001/cars/${carId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (!response.ok) {
                throw new Error('Failed to fetch car data');
            }
            const data = await response.json();
            setMarque(data.marque);
            setModele(data.modele);
            setAnneeFabrication(data.anneeFabrication);
            setTypeCarburant(data.typeCarburant);
            setTypeTransmission(data.typeTransmission);
            setCategorie(data.categorie);
            setDisponibilite(data.disponibilite);
            setKilometrage(data.kilometrage);
            setNbPlaces(data.NbPlaces);
            setNbPortes(data.NbPortes);
            setClimatisation(data.climatisation);
            setCaracteristiques(data.caracteristiques);
            setAccessoiresOptionSupp(data.accessoiresOptionSupp);
            setPrixParJ(data.prixParJ);
        } catch (error) {
            setError('Failed to fetch car data');
        }
    };

    const handleUpdateCar = async () => {
        if (!isMounted) return;

        const formData = new FormData();
        formData.append('marque', marque);
        formData.append('modele', modele);
        formData.append('anneeFabrication', anneeFabrication.toString());
        formData.append('typeCarburant', typeCarburant);
        formData.append('typeTransmission', typeTransmission);
        formData.append('categorie', categorie);
        formData.append('disponibilite', disponibilite);
        formData.append('kilometrage', kilometrage.toString());
        formData.append('NbPlaces', NbPlaces.toString());
        formData.append('NbPortes', NbPortes.toString());
        formData.append('climatisation', climatisation.toString());
        formData.append('caracteristiques', caracteristiques);
        formData.append('accessoiresOptionSupp', accessoiresOptionSupp);
        formData.append('prixParJ', prixParJ.toString());
        if (image) formData.append('images', image);
        if (image2) formData.append('images', image2);
        if (image3) formData.append('images', image3);
        if (image4) formData.append('images', image4);

        try {
            const response = await fetch(`http://localhost:3001/cars/${carId}`, {
                method: 'PUT',
                body: formData,
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (!response.ok) {
                throw new Error('Failed to update car');
            }
            router.push('/cars');
        } catch (error) {
            setError('Failed to update car');
        }
    };

    if (!isMounted || !isAdmin) {
        return null;
    }

    const toggleMenu = () => {
        setIsCollapsed(!isCollapsed);
    };

    return (
        <div className="flex flex-col md:flex-row bg-white min-h-screen">
            <SideNavbar />
            <div className="flex-1 ml-0 md:ml-60 py-8 px-6 transition-all duration-300">
                <div className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-10 mt-4">
                    <h2 className="text-gray-800 font-semibold text-3xl mb-6">Update Car</h2>
                    <form className="grid grid-cols-2 gap-6">
                        <div className="flex flex-col">
                            <label className="text-gray-700 font-medium mb-2" htmlFor="brand">Brand</label>
                            <input
                                id="brand"
                                type="text"
                                placeholder="Brand"
                                value={marque}
                                onChange={(e) => setMarque(e.target.value)}
                                className="w-full h-12 px-4 rounded-lg border border-gray-300 bg-gray-50 text-gray-800 placeholder-gray-400 focus:ring focus:ring-indigo-200 focus:border-indigo-500"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-gray-700 font-medium mb-2" htmlFor="model">Model</label>
                            <input
                                id="model"
                                type="text"
                                placeholder="Model"
                                value={modele}
                                onChange={(e) => setModele(e.target.value)}
                                className="w-full h-12 px-4 rounded-lg border border-gray-300 bg-gray-50 text-gray-800 placeholder-gray-400 focus:ring focus:ring-indigo-200 focus:border-indigo-500"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-gray-700 font-medium mb-2" htmlFor="year">Year of Manufacture</label>
                            <input
                                id="year"
                                type="number"
                                placeholder="Year of Manufacture"
                                value={anneeFabrication}
                                onChange={(e) => setAnneeFabrication(parseInt(e.target.value))}
                                className="w-full h-12 px-4 rounded-lg border border-gray-300 bg-gray-50 text-gray-800 placeholder-gray-400 focus:ring focus:ring-indigo-200 focus:border-indigo-500"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-gray-700 font-medium mb-2" htmlFor="fuel">Fuel Type</label>
                            <select
                                id="fuel"
                                value={typeCarburant}
                                onChange={(e) => setTypeCarburant(e.target.value)}
                                className="w-full h-12 px-4 rounded-lg border border-gray-300 bg-gray-50 text-gray-800 focus:ring focus:ring-indigo-200 focus:border-indigo-500"
                            >
                                <option value="essence">Gasoline</option>
                                <option value="diesel">Diesel</option>
                                <option value="hybride">Hybrid</option>
                                <option value="electrique">Electric</option>
                            </select>
                        </div>
                        <div className="flex flex-col">
                            <label className="text-gray-700 font-medium mb-2" htmlFor="transmission">Transmission Type</label>
                            <select
                                id="transmission"
                                value={typeTransmission}
                                onChange={(e) => setTypeTransmission(e.target.value)}
                                className="w-full h-12 px-4 rounded-lg border border-gray-300 bg-gray-50 text-gray-800 focus:ring focus:ring-indigo-200 focus:border-indigo-500"
                            >
                                <option value="manuelle">Manual</option>
                                <option value="automatique">Automatic</option>
                            </select>
                        </div>
                        <div className="flex flex-col">
                            <label className="text-gray-700 font-medium mb-2" htmlFor="category">Category</label>
                            <select
                                id="category"
                                value={categorie}
                                onChange={(e) => setCategorie(e.target.value)}
                                className="w-full h-12 px-4 rounded-lg border border-gray-300 bg-gray-50 text-gray-800 focus:ring focus:ring-indigo-200 focus:border-indigo-500"
                            >
                                <option value="compacte">Compact</option>
                                <option value="berline">Sedan</option>
                                <option value="suv">SUV</option>
                                <option value="camion">Truck</option>
                                <option value="fourgonette">Van</option>
                            </select>
                        </div>
                        <div className="flex flex-col">
                            <label className="text-gray-700 font-medium mb-2" htmlFor="availability">Availability</label>
                            <select
                                id="availability"
                                value={disponibilite}
                                onChange={(e) => setDisponibilite(e.target.value)}
                                className="w-full h-12 px-4 rounded-lg border border-gray-300 bg-gray-50 text-gray-800 focus:ring focus:ring-indigo-200 focus:border-indigo-500"
                            >
                                <option value="disponible">Available</option>
                                <option value="indisponible">Unavailable</option>
                            </select>
                        </div>
                        <div className="flex flex-col">
                            <label className="text-gray-700 font-medium mb-2" htmlFor="mileage">Mileage</label>
                            <input
                                id="mileage"
                                type="number"
                                placeholder="Mileage"
                                value={kilometrage}
                                onChange={(e) => setKilometrage(parseInt(e.target.value))}
                                className="w-full h-12 px-4 rounded-lg border border-gray-300 bg-gray-50 text-gray-800 placeholder-gray-400 focus:ring focus:ring-indigo-200 focus:border-indigo-500"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-gray-700 font-medium mb-2" htmlFor="seats">Number of Seats</label>
                            <input
                                id="seats"
                                type="number"
                                placeholder="Number of Seats"
                                value={NbPlaces}
                                onChange={(e) => setNbPlaces(parseInt(e.target.value))}
                                className="w-full h-12 px-4 rounded-lg border border-gray-300 bg-gray-50 text-gray-800 placeholder-gray-400 focus:ring focus:ring-indigo-200 focus:border-indigo-500"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-gray-700 font-medium mb-2" htmlFor="doors">Number of Doors</label>
                            <input
                                id="doors"
                                type="number"
                                placeholder="Number of Doors"
                                value={NbPortes}
                                onChange={(e) => setNbPortes(parseInt(e.target.value))}
                                className="w-full h-12 px-4 rounded-lg border border-gray-300 bg-gray-50 text-gray-800 placeholder-gray-400 focus:ring focus:ring-indigo-200 focus:border-indigo-500"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-gray-700 font-medium mb-2">Air Conditioning</label>
                            <label className="inline-flex items-center">
                                <input
                                    type="checkbox"
                                    checked={climatisation}
                                    onChange={(e) => setClimatisation(e.target.checked)}
                                    className="form-checkbox h-5 w-5 text-indigo-600"
                                />
                                <span className="ml-2 text-gray-700">Yes</span>
                            </label>
                        </div>
                        <div className="flex flex-col">
                            <label className="text-gray-700 font-medium mb-2" htmlFor="features">Features</label>
                            <textarea
                                id="features"
                                placeholder="Features"
                                value={caracteristiques}
                                onChange={(e) => setCaracteristiques(e.target.value)}
                                className="w-full h-24 px-4 py-2 rounded-lg border border-gray-300 bg-gray-50 text-gray-800 placeholder-gray-400 focus:ring focus:ring-indigo-200 focus:border-indigo-500"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-gray-700 font-medium mb-2" htmlFor="extraAccessories">Extra Accessories</label>
                            <textarea
                                id="extraAccessories"
                                placeholder="Extra Accessories"
                                value={accessoiresOptionSupp}
                                onChange={(e) => setAccessoiresOptionSupp(e.target.value)}
                                className="w-full h-24 px-4 py-2 rounded-lg border border-gray-300 bg-gray-50 text-gray-800 placeholder-gray-400 focus:ring focus:ring-indigo-200 focus:border-indigo-500"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-gray-700 font-medium mb-2" htmlFor="pricePerDay">Price per Day</label>
                            <input
                                id="pricePerDay"
                                type="number"
                                placeholder="Price per Day"
                                value={prixParJ}
                                onChange={(e) => setPrixParJ(parseInt(e.target.value))}
                                className="w-full h-12 px-4 rounded-lg border border-gray-300 bg-gray-50 text-gray-800 placeholder-gray-400 focus:ring focus:ring-indigo-200 focus:border-indigo-500"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-gray-700 font-medium mb-2" htmlFor="image">Main Image</label>
                            <input
                                id="image"
                                type="file"
                                onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-800 placeholder-gray-400 focus:ring focus:ring-indigo-200 focus:border-indigo-500"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-gray-700 font-medium mb-2" htmlFor="image2">Image 2</label>
                            <input
                                id="image2"
                                type="file"
                                onChange={(e) => setImage2(e.target.files ? e.target.files[0] : null)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-800 placeholder-gray-400 focus:ring focus:ring-indigo-200 focus:border-indigo-500"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-gray-700 font-medium mb-2" htmlFor="image3">Image 3</label>
                            <input
                                id="image3"
                                type="file"
                                onChange={(e) => setImage3(e.target.files ? e.target.files[0] : null)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-800 placeholder-gray-400 focus:ring focus:ring-indigo-200 focus:border-indigo-500"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-gray-700 font-medium mb-2" htmlFor="image4">Image 4</label>
                            <input
                                id="image4"
                                type="file"
                                onChange={(e) => setImage4(e.target.files ? e.target.files[0] : null)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-800 placeholder-gray-400 focus:ring focus:ring-indigo-200 focus:border-indigo-500"
                            />
                        </div>
                    </form>
                    <div className="flex justify-end mt-6">
                        <button
                            onClick={handleUpdateCar}
                            className="bg-[#1ECB15] text-white font-semibold py-2 px-6 rounded-lg hover:bg-green-600 transition duration-300"
                        >
                            Update Car
                        </button>
                    </div>
                    {error && (
                        <p className="text-red-500 mt-4">{error}</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UpdateCarPage;
