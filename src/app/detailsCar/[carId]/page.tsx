"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import Note from '../../components/Note';
import CarDetails from '../../components/CarDetails';
import SideNavbar from '../../components/SideNavbar';

interface Car {
  _id: string;
  marque: string;
  modele: string;
  anneeFabrication: number;
  typeCarburant: string;
  typeTransmission: string;
  categorie: string;
  disponibilite: string;
  kilometrage: number;
  NbPlaces: number;
  NbPortes: number;
  climatisation: boolean;
  caracteristiques: string;
  accessoiresOptionSupp: string;
  prixParJ: number;
  image: string;
  image2: string;
  image3: string;
  image4: string;
  conditionDeLocation: string;
  note?: number;
  offrePromotion: string;
}
interface Note {
  _id: string;
  note: number;
  idClient: string;
  commentaire?: string;
}

const CarDetailsPage = () => {
  const [hasRated, setHasRated] = useState(false);
  const { carId } = useParams();
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mainImage, setMainImage] = useState<string>('');
  const [showRatingForm, setShowRatingForm] = useState(false);
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [userId, setUserId] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setUserId(localStorage.getItem('userId'));
      setToken(localStorage.getItem('token'));
      const authStatus = localStorage.getItem('isAuth') === 'true';
      setIsAuth(authStatus);
    }
  }, []);

  useEffect(() => {
    if (carId) {
      const fetchCarDetails = async () => {
        try {
          const response = await axios.get(`http://localhost:3001/cars/${carId}`);
          setCar(response.data);
          setMainImage(response.data.image);
          setLoading(false);
        } catch (error) {
          console.error('There was an error fetching the car details!', error);
          setLoading(false);
        }
      };

      fetchCarDetails();
      const authStatus = localStorage.getItem('isAuth') === 'true';
      setIsAuth(authStatus);
    }
  }, [carId]);

  useEffect(() => {
    if (carId) {
      axios.get(`http://localhost:3001/notes/car/${carId}`)
        .then(response => {
          setNotes(response.data);
          setLoading(false);
        })
        .catch(error => {
          console.error("There was an error fetching the notes!", error);
          setLoading(false);
        });
    }
  }, [carId]);


  if (loading) {
    return <div>Loading...</div>;
  }

  if (!car) {
    return <div>Car not found</div>;
  }
  const handleLogout = () => {
    localStorage.clear();
    setIsAuth(false);
  };

  const handleRatingSubmit = async () => {
    try {
      const submitResponse = await axios.post('http://localhost:3001/notes', {
        idClient: userId,
        idVoiture: carId,
        note: rating,
        commentaire: comment,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (submitResponse.status === 201) {
        alert('Rating submitted successfully');
        setShowRatingForm(false);
        setCar((prevCar) => prevCar ? { ...prevCar, note: (prevCar.note || 0) + rating / 2 } : null);
        setHasRated(true);
        window.location.reload();
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const { status, data } = error.response;
        if (status === 400 && data.message.includes('Le client a déjà donné une note pour cette voiture.')) {
          alert('You have already submitted a rating for this car.');
        } else {
          alert('An error occurred while submitting your rating. Please try again.');
        }
      } else {
        alert('An error occurred while setting up your request. Please try again.');
      }
    }
  };
  return (
    <div className="flex flex-col md:flex-row bg-white min-h-screen">
      <SideNavbar />
      <div className="flex-1 ml-0 md:ml-60 py-8 px-6 transition-all duration-300">
        <CarDetails
          car={car}
          showRatingForm={showRatingForm}
          hasRated={hasRated}
          setShowRatingForm={setShowRatingForm}
          handleRatingSubmit={handleRatingSubmit}
          rating={rating}
          setRating={setRating}
          comment={comment}
          setComment={setComment}
        />
        <div className="container mx-auto p-4">
          <h1 className="text-2xl font-bold mb-4">Notes for Car: {car.marque} {car.modele}</h1>
          {notes.length === 0 ? (
            <p>No notes available for this car.</p>
          ) : (
            notes.map(note => (
              <Note key={note._id} note={note} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CarDetailsPage;
