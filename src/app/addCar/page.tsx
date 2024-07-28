"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SideNavbar from '../components/SideNavbar';

const AddCarPage = () => {
    const [marque, setMarque] = useState('');
    const [modele, setModele] = useState('');
    const [anneeFabrication, setAnneeFabrication] = useState<number>(2020);
    const [typeCarburant, setTypeCarburant] = useState('essence');
    const [typeTransmission, setTypeTransmission] = useState('manuelle');
    const [vehicleType, setVehicleType] = useState('Car');
    const [categorie, setCategorie] = useState('Compact');
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
    const [isAuth, setIsAuth] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);


    const router = useRouter();

    useEffect(() => {
        setIsMounted(true);
        const role = localStorage.getItem('role');
        setIsAdmin(role === 'admin');
        if (role !== 'admin') {
            router.push('/');
        } setMarque(localStorage.getItem('marque') || '');
        setModele(localStorage.getItem('modele') || '');
        setAnneeFabrication(parseInt(localStorage.getItem('anneeFabrication') || '2020'));
        setTypeCarburant(localStorage.getItem('typeCarburant') || 'essence');
        setTypeTransmission(localStorage.getItem('typeTransmission') || 'manuelle');
        setVehicleType(localStorage.getItem('vehicleType') || 'Car');
        setCategorie(localStorage.getItem('categorie') || 'Compact');
        setDisponibilite(localStorage.getItem('disponibilite') || 'disponible');
        setKilometrage(parseInt(localStorage.getItem('kilometrage') || '0'));
        setNbPlaces(parseInt(localStorage.getItem('NbPlaces') || '4'));
        setNbPortes(parseInt(localStorage.getItem('NbPortes') || '4'));
        setClimatisation(localStorage.getItem('climatisation') === 'true');
        setCaracteristiques(localStorage.getItem('caracteristiques') || '');
        setAccessoiresOptionSupp(localStorage.getItem('accessoiresOptionSupp') || '');
        setPrixParJ(parseFloat(localStorage.getItem('prixParJ') || '0'));
        const authStatus = localStorage.getItem('isAuth') === 'true';
        setIsAuth(authStatus);
    }, [router]);

    useEffect(() => {
        if (isMounted) {
            localStorage.setItem('marque', marque);
            localStorage.setItem('modele', modele);
            localStorage.setItem('anneeFabrication', anneeFabrication.toString());
            localStorage.setItem('typeCarburant', typeCarburant);
            localStorage.setItem('typeTransmission', typeTransmission);
            localStorage.setItem('vehicleType', vehicleType);
            localStorage.setItem('categorie', categorie);
            localStorage.setItem('disponibilite', disponibilite);
            localStorage.setItem('kilometrage', kilometrage.toString());
            localStorage.setItem('NbPlaces', NbPlaces.toString());
            localStorage.setItem('NbPortes', NbPortes.toString());
            localStorage.setItem('climatisation', climatisation.toString());
            localStorage.setItem('caracteristiques', caracteristiques);
            localStorage.setItem('accessoiresOptionSupp', accessoiresOptionSupp);
            localStorage.setItem('prixParJ', prixParJ.toString());
        }
    }, [
        marque, modele, anneeFabrication, typeCarburant, typeTransmission,
        vehicleType, categorie, disponibilite, kilometrage, NbPlaces,
        NbPortes, climatisation, caracteristiques, accessoiresOptionSupp,
        prixParJ, isMounted
    ]);


    const handleAddCar = async () => {
        if (!isMounted) return;

        const formData = new FormData();
        formData.append('marque', marque);
        formData.append('modele', modele);
        formData.append('anneeFabrication', anneeFabrication.toString());
        formData.append('typeCarburant', typeCarburant);
        formData.append('typeTransmission', typeTransmission);
        formData.append('vehicleType', vehicleType);
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
            const response = await fetch('http://localhost:3001/cars', {
                method: 'POST',
                body: formData,
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (!response.ok) {
                throw new Error('Failed to add car');
            }
            router.push('/cars');
        } catch (error) {
            setError('Failed to add car');
        }
        const authStatus = localStorage.getItem('isAuth') === 'true';
        setIsAuth(authStatus);
    };

    if (!isMounted || !isAdmin) {
        return null;
    }

    const toggleMenu = () => {
        setIsCollapsed(!isCollapsed);
    };
    return (
        <div className="flex bg-white min-h-screen">
            <SideNavbar />
            <div className="flex-1 ml-0 md:ml-60 py-8 px-4 transition-all duration-300">
                <div className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-10">
                    <h2 className="text-gray-800 font-semibold text-3xl mb-6">Add Car</h2>
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
                            <label className="text-gray-700 font-medium mb-2" htmlFor="vehicleType">Vehicle Type</label>
                            <select
                                id="vehicleType"
                                value={vehicleType}
                                onChange={(e) => setVehicleType(e.target.value)}
                                className="w-full h-12 px-4 rounded-lg border border-gray-300 bg-gray-50 text-gray-800 focus:ring focus:ring-indigo-200 focus:border-indigo-500"
                            >
                                <option value="Car">Car</option>
                                <option value="Van">Van</option>
                                <option value="Minibus">Minibus</option>
                                <option value="Prestige">Prestige</option>
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
                                <option value="Compact">Compact</option>
                                <option value="Sedan">Sedan</option>
                                <option value="SUV">SUV</option>
                                <option value="Minivan">Minivan</option>
                                <option value="Convertible">Convertible</option>
                                <option value="Coupe">Coupe</option>
                                <option value="Exotic Cars">Exotic Cars</option>
                                <option value="Hatchback">Hatchback</option>
                                <option value="Truck">Truck</option>
                                <option value="Sports Car">Sports Car</option>
                                <option value="Station Wagon">Station Wagon</option>

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
                                <option value="reserver">Reserved</option>
                                <option value="en entretien">In Maintenance</option>
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
                        <div className="flex items-center">
                            <label className="text-gray-700 font-medium mb-2 mr-2" htmlFor="air-conditioning">Air Conditioning</label>
                            <input
                                id="air-conditioning"
                                type="checkbox"
                                checked={climatisation}
                                onChange={(e) => setClimatisation(e.target.checked)}
                                className="h-6 w-6 rounded bg-gray-50 border border-gray-300 focus:ring focus:ring-indigo-200 focus:border-indigo-500"
                            />
                        </div>
                        <div className="flex flex-col col-span-2">
                            <label className="text-gray-700 font-medium mb-2" htmlFor="features">Features</label>
                            <textarea
                                id="features"
                                placeholder="Features"
                                value={caracteristiques}
                                onChange={(e) => setCaracteristiques(e.target.value)}
                                className="w-full h-24 px-4 rounded-lg border border-gray-300 bg-gray-50 text-gray-800 placeholder-gray-400 focus:ring focus:ring-indigo-200 focus:border-indigo-500"
                            ></textarea>
                        </div>
                        <div className="flex flex-col col-span-2">
                            <label className="text-gray-700 font-medium mb-2" htmlFor="optional-accessories">Optional Accessories</label>
                            <textarea
                                id="optional-accessories"
                                placeholder="Optional Accessories"
                                value={accessoiresOptionSupp}
                                onChange={(e) => setAccessoiresOptionSupp(e.target.value)}
                                className="w-full h-24 px-4 rounded-lg border border-gray-300 bg-gray-50 text-gray-800 placeholder-gray-400 focus:ring focus:ring-indigo-200 focus:border-indigo-500"
                            ></textarea>
                        </div>
                        <div className="flex flex-col">
                            <label className="text-gray-700 font-medium mb-2" htmlFor="price">Price per Day</label>
                            <input
                                id="price"
                                type="number"
                                placeholder="Price per Day"
                                value={prixParJ}
                                onChange={(e) => setPrixParJ(parseFloat(e.target.value))}
                                className="w-full h-12 px-4 rounded-lg border border-gray-300 bg-gray-50 text-gray-800 placeholder-gray-400 focus:ring focus:ring-indigo-200 focus:border-indigo-500"
                            />
                        </div>
                        <div className="flex flex-col col-span-2">
                            <label className="text-gray-700 font-medium mb-2" htmlFor="image">Upload Image</label>
                            <input
                                id="image"
                                type="file"
                                onChange={(e) => setImage(e.target.files?.[0] || null)}
                                className="w-full h-12 px-4 rounded-lg border border-gray-300 bg-gray-50 text-gray-800 placeholder-gray-400 focus:ring focus:ring-indigo-200 focus:border-indigo-500"
                            />
                        </div>
                        <div className="flex flex-col col-span-2">
                            <label className="text-gray-700 font-medium mb-2" htmlFor="image2">Upload Additional Image</label>
                            <input
                                id="image2"
                                type="file"
                                onChange={(e) => setImage2(e.target.files?.[0] || null)}
                                className="w-full h-12 px-4 rounded-lg border border-gray-300 bg-gray-50 text-gray-800 placeholder-gray-400 focus:ring focus:ring-indigo-200 focus:border-indigo-500"
                            />
                        </div>
                        <div className="flex flex-col col-span-2">
                            <label className="text-gray-700 font-medium mb-2" htmlFor="image3">Upload Additional Image</label>
                            <input
                                id="image3"
                                type="file"
                                onChange={(e) => setImage3(e.target.files?.[0] || null)}
                                className="w-full h-12 px-4 rounded-lg border border-gray-300 bg-gray-50 text-gray-800 placeholder-gray-400 focus:ring focus:ring-indigo-200 focus:border-indigo-500"
                            />
                        </div>
                        <div className="flex flex-col col-span-2">
                            <label className="text-gray-700 font-medium mb-2" htmlFor="image4">Upload Additional Image</label>
                            <input
                                id="image4"
                                type="file"
                                onChange={(e) => setImage4(e.target.files?.[0] || null)}
                                className="w-full h-12 px-4 rounded-lg border border-gray-300 bg-gray-50 text-gray-800 placeholder-gray-400 focus:ring focus:ring-indigo-200 focus:border-indigo-500"
                            />
                        </div>
                        {error && <p className="text-red-500 col-span-2">{error}</p>}
                        <button
                            onClick={handleAddCar}
                            className="w-full col-span-2 h-12 mt-6 rounded-lg bg-[#1ECB15]  hover:bg-green-600 text-white font-bold text-lg focus:outline-none focus:ring focus:ring-indigo-200"
                        >
                            Add Car
                        </button>
                    </form>
                </div>
            </div>
        </div>


    );
}

export default AddCarPage;
