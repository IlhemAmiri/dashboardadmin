import axios from 'axios';
import { useEffect, useState } from 'react';


const StarRating = ({ rating }) => {
    const fullStars = Math.floor(rating);
    const quarterStar = (rating % 1) >= 0.25 && (rating % 1) < 0.5;
    const halfStar = (rating % 1) >= 0.5 && (rating % 1) < 0.75;
    const threeQuarterStar = (rating % 1) >= 0.75;
    const emptyStars = 5 - fullStars - (quarterStar || halfStar || threeQuarterStar ? 1 : 0);

    return (
        <div className="flex items-center">
            {Array(fullStars).fill(0).map((_, index) => (
                <svg key={index} className="w-6 h-6 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.357 4.167a1 1 0 00.95.69h4.389c.969 0 1.372 1.24.588 1.81l-3.557 2.581a1 1 0 00-.364 1.118l1.358 4.167c.3.921-.755 1.688-1.54 1.118l-3.557-2.581a1 1 0 00-1.175 0l-3.557 2.581c-.784.57-1.838-.197-1.54-1.118l1.358-4.167a1 1 0 00-.364-1.118L2.064 9.594c-.784-.57-.381-1.81.588-1.81h4.389a1 1 0 00.95-.69l1.357-4.167z" />
                </svg>
            ))}
            {quarterStar && (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <defs>
                        <linearGradient id="quarterGrad">
                            <stop offset="25%" stopColor="currentColor" className="text-yellow-500" />
                            <stop offset="25%" stopColor="currentColor" className="text-gray-300" />
                        </linearGradient>
                    </defs>
                    <path fill="url(#quarterGrad)" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.357 4.167a1 1 0 00.95.69h4.389c.969 0 1.372 1.24.588 1.81l-3.557 2.581a1 1 0 00-.364 1.118l1.358 4.167c.3.921-.755 1.688-1.54 1.118l-3.557-2.581a1 1 0 00-1.175 0l-3.557 2.581c-.784.57-1.838-.197-1.54-1.118l1.358-4.167a1 1 0 00-.364-1.118L2.064 9.594c-.784-.57-.381-1.81.588-1.81h4.389a1 1 0 00.95-.69l1.357-4.167z" />
                </svg>
            )}
            {halfStar && (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <defs>
                        <linearGradient id="halfGrad">
                            <stop offset="50%" stopColor="currentColor" className="text-yellow-500" />
                            <stop offset="50%" stopColor="currentColor" className="text-gray-300" />
                        </linearGradient>
                    </defs>
                    <path fill="url(#halfGrad)" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.357 4.167a1 1 0 00.95.69h4.389c.969 0 1.372 1.24.588 1.81l-3.557 2.581a1 1 0 00-.364 1.118l1.358 4.167c.3.921-.755 1.688-1.54 1.118l-3.557-2.581a1 1 0 00-1.175 0l-3.557 2.581c-.784.57-1.838-.197-1.54-1.118l1.358-4.167a1 1 0 00-.364-1.118L2.064 9.594c-.784-.57-.381-1.81.588-1.81h4.389a1 1 0 00.95-.69l1.357-4.167z" />
                </svg>
            )}
            {threeQuarterStar && (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <defs>
                        <linearGradient id="threeQuarterGrad">
                            <stop offset="75%" stopColor="currentColor" className="text-yellow-500" />
                            <stop offset="75%" stopColor="currentColor" className="text-gray-300" />
                        </linearGradient>
                    </defs>
                    <path fill="url(#threeQuarterGrad)" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.357 4.167a1 1 0 00.95.69h4.389c.969 0 1.372 1.24.588 1.81l-3.557 2.581a1 1 0 00-.364 1.118l1.358 4.167c.3.921-.755 1.688-1.54 1.118l-3.557-2.581a1 1 0 00-1.175 0l-3.557 2.581c-.784.57-1.838-.197-1.54-1.118l1.358-4.167a1 1 0 00-.364-1.118L2.064 9.594c-.784-.57-.381-1.81.588-1.81h4.389a1 1 0 00.95-.69l1.357-4.167z" />
                </svg>
            )}
            {Array(emptyStars).fill(0).map((_, index) => (
                <svg key={index} className="w-6 h-6 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.357 4.167a1 1 0 00.95.69h4.389c.969 0 1.372 1.24.588 1.81l-3.557 2.581a1 1 0 00-.364 1.118l1.358 4.167c.3.921-.755 1.688-1.54 1.118l-3.557-2.581a1 1 0 00-1.175 0l-3.557 2.581c-.784.57-1.838-.197-1.54-1.118l1.358-4.167a1 1 0 00-.364-1.118L2.064 9.594c-.784-.57-.381-1.81.588-1.81h4.389a1 1 0 00.95-.69l1.357-4.167z" />
                </svg>
            ))}
        </div>
    );
};

const Note = ({ note }) => {
    const [client, setClient] = useState({ firstName: '', lastName: '' });

    useEffect(() => {
        const token = localStorage.getItem('token');
        axios.get(`http://localhost:3001/users/clients/${note.idClient}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then(response => {
                setClient(response.data);
            })
            .catch(error => {
                console.error("There was an error fetching the client data!", error);
            });
    }, [note.idClient]);
    return (
        <div className="border rounded-lg p-4 mb-4">
            <div className="flex items-center mb-2">
                <img src={note.idClient.image} alt="Profile" className="rounded-full w-12 h-12 mr-4" />
                <span className="font-semibold text-[25px]">{note.idClient.nom} {note.idClient.prenom}</span>
            </div>
            <StarRating rating={note.note} />
            {note.commentaire && (
                <div className="mt-2">
                    <span className="font-semibold">Commentaire:</span> {note.commentaire}
                </div>
            )}
        </div>
    );
};

export default Note;
