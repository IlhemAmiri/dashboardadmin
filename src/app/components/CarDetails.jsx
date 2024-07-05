import React from 'react';
import Link from 'next/link';
import StarRating from './StarRating';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const CarDetails = ({
    car,
    showRatingForm,
    hasRated,
    setShowRatingForm,
    handleRatingSubmit,
    rating,
    setRating,
    comment,
    setComment
}) => {
    const router = useRouter();
    const [error, setError] = React.useState('');

    const handleDelete = async () => {
        try {
            const response = await axios.delete(`http://localhost:3001/cars/${car._id}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            console.log('Delete response:', response);
            router.push('/cars'); 
        } catch (err) {
            console.error('Delete error:', err);
            setError('Failed to delete car');
        }
    };

    return (
        <div>
            <div className="container mx-auto px-[2%] py-[2%] ">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="ont-outfit text-[42px] leading-[50px] tracking-[-1.8px] font-semibold text-gray-800 mb-6">The Car Details</h2>
                    
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
                        <div className="mt-4 flex items-center justify-between">
                            {car.note && (
                                <div className="mr-4">
                                    <h3 className="text-xl font-semibold mb-2">Rating</h3>
                                    <StarRating rating={car.note} />
                                </div>
                            )}
                           
                        </div>


                        <div className="mt-8 flex space-x-4">
                            <Link href={`/UpdateCar/${car._id}`}>
                                <div className="bg-[#1ECB15] text-white text-center px-4 py-2 rounded shadow-md hover:bg-[#17a413] transition cursor-pointer">
                                    <FontAwesomeIcon icon={faEdit} />
                                </div>
                            </Link>
                            <button
                                onClick={handleDelete}
                                className="bg-red-500 text-white text-center px-4 py-2 rounded shadow-md hover:bg-red-700 transition cursor-pointer"
                            >
                                <FontAwesomeIcon icon={faTrash} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
           
        </div>
    );
};

export default CarDetails;