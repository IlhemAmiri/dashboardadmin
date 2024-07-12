"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import SideNavbar from '../components/SideNavbar';
import ReactPaginate from 'react-paginate';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

interface User {
  _id: string;
  email: string;
  role: string;
  image?: string;
  deleted_at?: Date | null;
  nom?: string;
  prenom?: string;
  CIN?: string;
  passport?: string;
  adresse?: string;
  numTel?: string;
  dateNaissance?: Date;
  numPermisConduire?: string;
  dateExpirationPermis?: Date;
}

const ITEMS_PER_PAGE = 5;

const AllUsersPage = () => {
  const [admins, setAdmins] = useState<User[]>([]);
  const [activeClients, setActiveClients] = useState<User[]>([]);
  const [deletedClients, setDeletedClients] = useState<User[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuth, setIsAuth] = useState(false);
  const [showDeletedClients, setShowDeletedClients] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeClientsCurrentPage, setActiveClientsCurrentPage] = useState(0);
  const [deletedClientsCurrentPage, setDeletedClientsCurrentPage] = useState(0);


  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
    const role = localStorage.getItem('role');
    setIsAdmin(role === 'admin');
    if (role !== 'admin') {
      router.push('/');
    } else {
      const authStatus = localStorage.getItem('isAuth') === 'true';
      setIsAuth(authStatus);
      fetchUsers();
    }
  }, [router]);

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:3001/users', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      const users: User[] = await response.json();
      const adminUsers = users.filter(user => user.role === 'admin');
      const activeClientUsers = users.filter(user => user.role === 'client' && !user.deleted_at);
      const deletedClientUsers = users.filter(user => user.role === 'client' && user.deleted_at);

      setAdmins(adminUsers);
      setActiveClients(activeClientUsers);
      setDeletedClients(deletedClientUsers);
    } catch (error) {
      console.error(error);
    }
  };

  if (!isMounted || !isAdmin) {
    return null;
  }

  const handleLogout = () => {
    localStorage.clear();
    setIsAuth(false);
    router.push('/');
  };

  const handleDelete = async (clientId: string) => {
    try {
      const response = await fetch(`http://localhost:3001/users/clients/${clientId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete client');
      }

      alert(`Le client avec l'identifiant ${clientId} a été supprimé`);

      // Fetch the updated list of users
      fetchUsers();
      // Optionally, update the state to remove the deleted client from the list
      //setActiveClients(prevClients => prevClients.filter(client => client._id !== clientId));
    } catch (error) {
      console.error(error);
      alert('An error occurred while deleting the client');
    }
  };

  const handleToggleDeletedClients = () => {
    setShowDeletedClients(!showDeletedClients);
  };

  const toggleMenu = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleActiveClientsPageClick = (data: { selected: number }) => {
    setActiveClientsCurrentPage(data.selected);
  };

  const handleDeletedClientsPageClick = (data: { selected: number }) => {
    setDeletedClientsCurrentPage(data.selected);
  };


  const displayClients = (clients: User[], currentPage: number) => {
    const offset = currentPage * ITEMS_PER_PAGE;
    const currentPageClients = clients.slice(offset, offset + ITEMS_PER_PAGE);

    return currentPageClients.map(client => (
      <tr key={client.email} className="border-b hover:bg-gray-50 transition duration-200">
        <td className="py-2 px-4 flex items-center space-x-4">
          <img src={client.image || 'images/avatar.png'} alt="Client" className="w-8 h-8 rounded-full" />
          <div>
            <p className="font-semibold">{`${client.nom} ${client.prenom}`}</p>
            <p>{client.email}</p>
          </div>
        </td>
        <td className="py-2 px-4">
          <p>CIN: {client.CIN}</p>
          <p>Passport: {client.passport}</p>
          <p>License: {client.numPermisConduire} (Expires: {new Date(client.dateExpirationPermis!).toLocaleDateString()})</p>
        </td>
        <td className="py-2 px-4">
          <p>Address: {client.adresse}</p>
          <p>Phone: {client.numTel}</p>
          <p>Birth Date: {new Date(client.dateNaissance!).toLocaleDateString()}</p>
        </td>
        {!client.deleted_at && (
          <td className="py-2 px-4">
            <Link href={`/updateUser/${client._id}`}>
              <button className="bg-[#1ECB15] text-white py-1 px-2 rounded-full hover:bg-green-600 transition duration-200">
                <FontAwesomeIcon icon={faEdit} />
              </button>
            </Link>
            <button onClick={() => handleDelete(client._id)} className="bg-red-500 text-white py-1 px-2 rounded-full hover:bg-red-600 transition duration-200 ml-2">
              <FontAwesomeIcon icon={faTrash} />
            </button>
          </td>
        )}
      </tr>
    ));
  };


  return (
    <div className="flex flex-col md:flex-row bg-white min-h-screen">
      <SideNavbar />
      <div className="flex-1 ml-0 md:ml-60 py-8 px-6 transition-all duration-300">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 space-y-4 md:space-y-0">
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-800">Customers</h2>
            <Link href={'/addConsumer'}>
              <button className="bg-[#1ECB15] text-white py-2 px-4 rounded-full hover:bg-green-600 transition duration-200">
                Add Customer
              </button>
            </Link>
          </div>
          <section className="mb-12">
            <h3 className="text-2xl font-semibold mb-4 text-gray-700">Active Clients</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white shadow-lg rounded-lg">
                <thead className="bg-gray-500 text-white">
                  <tr>
                    <th className="text-left py-2 px-4">Client Info</th>
                    <th className="text-left py-2 px-4">Documents</th>
                    <th className="text-left py-2 px-4">Contact</th>
                    <th className="text-left py-2 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {displayClients(activeClients, activeClientsCurrentPage)}
                </tbody>

              </table>
              <ReactPaginate
                previousLabel={'<'}
                nextLabel={'>'}
                breakLabel={'...'}
                pageCount={Math.ceil(activeClients.length / ITEMS_PER_PAGE)}
                marginPagesDisplayed={2}
                pageRangeDisplayed={3}
                onPageChange={handleActiveClientsPageClick}
                containerClassName={'flex justify-center mt-4'}
                pageClassName={'mx-2 px-3 py-1 rounded-full cursor-pointer bg-gray-200 hover:bg-gray-300'}
                previousClassName={'mx-2 px-3 py-1 rounded-full cursor-pointer bg-gray-200 hover:bg-gray-300'}
                nextClassName={'mx-2 px-3 py-1 rounded-full cursor-pointer bg-gray-200 hover:bg-gray-300'}
                activeClassName={'bg-[#1ECB15] text-white'}
              />

            </div>
          </section>

          <div className="mb-8">
            <p className="text-lg text-gray-500">
              Would you like to see the deleted users table?
              <button onClick={handleToggleDeletedClients} className="text-blue-500 py-1 px-3 rounded-full transition duration-200 ml-3">
                {showDeletedClients ? 'Hide' : 'Show'}
              </button>
            </p>
          </div>

          {showDeletedClients && (
            <section>
              <h3 className="text-2xl font-semibold mb-4 text-gray-700">Deleted Clients</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white shadow-lg rounded-lg">
                  <thead className="bg-[#1ECB15] text-white">
                    <tr>
                      <th className="text-left py-2 px-4">Client Info</th>
                      <th className="text-left py-2 px-4">Documents</th>
                      <th className="text-left py-2 px-4">Contact</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayClients(deletedClients, deletedClientsCurrentPage)}
                  </tbody>

                </table>
                <ReactPaginate
                  previousLabel={'<'}
                  nextLabel={'>'}
                  breakLabel={'...'}
                  pageCount={Math.ceil(deletedClients.length / ITEMS_PER_PAGE)}
                  marginPagesDisplayed={2}
                  pageRangeDisplayed={3}
                  onPageChange={handleDeletedClientsPageClick}
                  containerClassName={'flex justify-center mt-4'}
                  pageClassName={'mx-2 px-3 py-1 rounded-full cursor-pointer bg-gray-200 hover:bg-gray-300'}
                  previousClassName={'mx-2 px-3 py-1 rounded-full cursor-pointer bg-gray-200 hover:bg-gray-300'}
                  nextClassName={'mx-2 px-3 py-1 rounded-full cursor-pointer bg-gray-200 hover:bg-gray-300'}
                  activeClassName={'bg-[#1ECB15] text-white'}
                />

              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllUsersPage;
