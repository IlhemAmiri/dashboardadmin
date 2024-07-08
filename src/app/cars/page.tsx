"use client";

import React, { useEffect, useState } from 'react';
import { FaArrowUp, FaHistory } from 'react-icons/fa';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import SideNavbar from '../components/SideNavbar';

interface Car {
    _id: string;
    image: string;
    modele: string;
    marque: string;
    categorie: string;
    kilometrage: number;
    typeCarburant: string;
    typeTransmission: string;
    anneeFabrication: number;
    prixParJ: number;
}

const Page = () => {
    const [cars, setCars] = useState<Car[]>([]);
    const [isAuth, setIsAuth] = useState(false);
    const [favourites, setFavourites] = useState<Set<string>>(new Set());
    const [currentPage, setCurrentPage] = useState(() => parseInt(localStorage.getItem('currentPage') || '1', 10));
    const [itemsPerPage] = useState(12);
    const [totalItems, setTotalItems] = useState(0);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setIsMounted(true);
        const role = localStorage.getItem('role');
        setIsAdmin(role === 'admin');
        if (role !== 'admin') {
            router.push('/');
        }
    }, [router]);

    useEffect(() => {
        const fetchFavourites = async () => {
            const clientId = localStorage.getItem('userId');
            const token = localStorage.getItem('token');
            if (!clientId || !token) return;

            try {
                const config = {
                    headers: { 'Authorization': `Bearer ${token}` },
                };

                const response = await axios.get(`http://localhost:3001/favorite-cars/client/${clientId}`, config);
                const favouriteCars = response.data.map((fav: any) => fav.idVoiture);
                setFavourites(new Set(favouriteCars));
            } catch (error) {
                console.error('Error fetching favourites:', error);
            }
        };

        fetchFavourites();
    }, []);

    const handleToggleFavourite = async (carId: string) => {
        const clientId = localStorage.getItem('userId');
        const token = localStorage.getItem('token');
        if (!clientId || !token) {
            alert('Please log in to add to favourites');
            return;
        }

        const isFavourite = favourites.has(carId);
        try {
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            };

            if (!isFavourite) {
                await axios.post('http://localhost:3001/favorite-cars', { idClient: clientId, idVoiture: carId }, config);
                setFavourites((prev) => new Set(prev).add(carId));
            } else {
                await axios.delete('http://localhost:3001/favorite-cars', {
                    data: { idClient: clientId, idVoiture: carId },
                    ...config,
                });
                setFavourites((prev) => {
                    const newFavourites = new Set(prev);
                    newFavourites.delete(carId);
                    return newFavourites;
                });
            }
        } catch (error: any) {
            alert(`An error occurred while toggling favourite status: ${error.response?.data?.message || error.message}`);
        }
    };

    useEffect(() => {
        const fetchCars = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/cars?page=${currentPage}&limit=${itemsPerPage}`);
                setCars(response.data.data);
                setTotalItems(response.data.total);
            } catch (error) {
                console.error('There was an error fetching the car data!', error);
            }
        };

        fetchCars();
        setIsAuth(localStorage.getItem('isAuth') === 'true');
    }, [currentPage, itemsPerPage]);


    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            const nextPage = currentPage + 1;
            setCurrentPage(nextPage);
            localStorage.setItem('currentPage', nextPage.toString());
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            const prevPage = currentPage - 1;
            setCurrentPage(prevPage);
            localStorage.setItem('currentPage', prevPage.toString());
        }
    };

    const handlePageClick = (page: number) => {
        setCurrentPage(page);
        localStorage.setItem('currentPage', page.toString());
    };
    const toggleMenu = () => {
        setIsCollapsed(!isCollapsed);
    };
    return (
        <div className="flex bg-white min-h-screen">
            <SideNavbar />
            <div className="flex-1 ml-0 md:ml-60 py-8 px-4 transition-all duration-300">
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 p-6 space-y-4 md:space-y-0">
                    <h2 className="font-outfit text-[32px] md:text-[42px] leading-[40px] md:leading-[50px] tracking-[-1.8px] font-semibold text-gray-800">
                        Explore All Vehicles
                    </h2>
                    <Link href={`/addCar`}>
                        <button className="bg-[#1ECB15] text-white py-2 px-4 rounded-full hover:bg-green-600 transition duration-200">
                            Add Car
                        </button>
                    </Link>
                </div>


                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
                    {cars.map((car) => (
                        <div key={car._id} className="bg-white rounded-lg shadow-md mb-20 transition-transform transform hover:scale-105 min-h-[300px] max-h-[425px]">
                            <Link href={`/history/${car._id}`}>
                                <div className="absolute top-1 right-1 p-2 bg-[#1ECB15] text-white rounded-full">
                                    <FaHistory size={20} />
                                </div>
                            </Link>
                            <img src={car.image} alt={car.modele} className="w-full h-48 object-cover" />
                            <div className="p-4">
                                <h3 className="font-dm-sans text-[18px] font-bold leading-[21.6px]">{car.marque} {car.modele}</h3>
                                <p className="font-dm-sans text-[14px] leading-[14px] mt-2">{car.categorie}</p>
                                <div className="grid grid-cols-2 gap-4 mt-2">
                                    <div className="flex items-center">
                                        <img src="/images/Miles.png" alt="" className="mr-2" />
                                        <span className="font-dm-sans text-[14px] leading-[14px]">{car.kilometrage} Miles</span>
                                    </div>
                                    <div className="flex items-center">
                                        <img src="/images/Petrol.png" alt="" className="mr-2" />
                                        <span className="font-dm-sans text-[14px] leading-[14px]">{car.typeCarburant}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <img src="/images/Automatic.png" alt="" className="mr-2" />
                                        <span className="font-dm-sans text-[14px] leading-[14px]">{car.typeTransmission}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <img src="/images/cal.png" alt="" className="mr-2" />
                                        <span className="font-dm-sans text-[14px] leading-[14px]">{car.anneeFabrication}</span>
                                    </div>
                                </div>
                                <hr className="my-4 border-[#E9E9E9]" />
                                <div className="flex justify-between items-center mt-4">
                                    <span className="font-dm-sans text-[20px] font-bold leading-[30px]">${car.prixParJ}</span>
                                    <Link href={`/detailsCar/${car._id}`}>
                                        <div className="text-[#1ECB15] text-sm flex items-center text-[15px] cursor-pointer">
                                            View Details <FaArrowUp className="ml-1 rotate-45" />
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex justify-center items-center mt-8 pb-8">
                    <button
                        onClick={handlePreviousPage}
                        disabled={currentPage === 1}
                        className={`w-[36px] h-[36px] rounded-l-md ${currentPage === 1 ? 'opacity-0 ' : ''}`}
                    >
                        ←
                    </button>
                    {Array.from({ length: totalPages }, (_, index) => (
                        <button
                            key={index}
                            onClick={() => handlePageClick(index + 1)}
                            className={`w-[36px] h-[36px] ${index + 1 === currentPage ? 'bg-[#1ECB15] text-white' : 'bg-transparent text-black'} rounded-md mx-1`}
                        >
                            {index + 1}
                        </button>
                    ))}
                    <button
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages}
                        className={`w-[36px] h-[36px] rounded-r-md ${currentPage === totalPages ? 'opacity-0' : ''}`}
                    >
                        →
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Page;
