"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SideNavbar from '../components/SideNavbar';
import AddCarForm from '../components/AddCarForm';

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
                    <AddCarForm
                            handleAddCar={handleAddCar}
                            setMarque={setMarque}
                            setModele={setModele}
                            setAnneeFabrication={setAnneeFabrication}
                            setTypeCarburant={setTypeCarburant}
                            setTypeTransmission={setTypeTransmission}
                            setVehicleType={setVehicleType}
                            setCategorie={setCategorie}
                            setDisponibilite={setDisponibilite}
                            setKilometrage={setKilometrage}
                            setNbPlaces={setNbPlaces}
                            setNbPortes={setNbPortes}
                            setClimatisation={setClimatisation}
                            setCaracteristiques={setCaracteristiques}
                            setAccessoiresOptionSupp={setAccessoiresOptionSupp}
                            setPrixParJ={setPrixParJ}
                            setImage={setImage}
                            setImage2={setImage2}
                            setImage3={setImage3}
                            setImage4={setImage4}
                            error={error}
                            marque={marque}
                            modele={modele}
                            anneeFabrication={anneeFabrication}
                            typeCarburant={typeCarburant}
                            typeTransmission={typeTransmission}
                            vehicleType={vehicleType}
                            categorie={categorie}
                            disponibilite={disponibilite}
                            kilometrage={kilometrage}
                            NbPlaces={NbPlaces}
                            NbPortes={NbPortes}
                            climatisation={climatisation}
                            caracteristiques={caracteristiques}
                            accessoiresOptionSupp={accessoiresOptionSupp}
                            prixParJ={prixParJ}
                        />
                </div>
            </div>
        </div>


    );
}

export default AddCarPage;
