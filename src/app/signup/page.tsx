"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface FormData {
  nom: string;
  prenom: string;
  email: string;
  password: string;
  image: File | null;
}

const SignupPage: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    nom: '',
    prenom: '',
    email: '',
    password: '',
    image: null,
  });
  const [error, setError] = useState<string>('');
  const [isMounted, setIsMounted] = useState<boolean>(false);

  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFormData({ ...formData, image: e.target.files[0] });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isMounted) return;

    if (!validateEmail(formData.email)) {
      setError('Please enter a valid email address.');
      return;
    }

    const formDataToSubmit = new FormData();
    for (const key in formData) {
      if (formData.hasOwnProperty(key)) {
        const value = formData[key as keyof FormData];
        formDataToSubmit.append(key, value instanceof File ? value : String(value));
      }
    }

    try {
      const response = await fetch('http://localhost:3001/users/register', {
        method: 'POST',
        body: formDataToSubmit,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to register: ${errorText}`);
      }

      const data = await response.json();
      console.log('Registration successful:', data);
      router.push('/signin');
    } catch (error: any) {
      console.error('Error during registration:', error);
      setError(error.message || 'Failed to register');
    }
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden md:flex w-3/4 max-w-4xl">
        <div className="hidden md:block md:w-1/2">
          <img src="/images/sec.jpg" alt="Signup Illustration" className="object-cover w-full h-full" />
        </div>
        <div className="w-full md:w-1/2 p-8">
          <h2 className="text-3xl font-semibold text-gray-800 mb-6">Sign up</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="nom" className="block text-sm font-medium text-gray-700">First Name</label>
              <input
                id="nom"
                name="nom"
                type="text"
                placeholder="Your Nom"
                value={formData.nom}
                onChange={handleChange}
                className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="prenom" className="block text-sm font-medium text-gray-700">Last Name</label>
              <input
                id="prenom"
                name="prenom"
                type="text"
                placeholder="Your Prenom"
                value={formData.prenom}
                onChange={handleChange}
                className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Your Email Address"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="image" className="block text-sm font-medium text-gray-700">Profile Picture</label>
              <input
                id="image"
                name="image"
                type="file"
                onChange={handleFileChange}
                className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Sign up
            </button>
          </form>
          <div className="mt-6 flex items-center justify-center">
            <span className="text-sm text-gray-600">Already have an account? <Link href="/"><div className="text-indigo-600 hover:text-indigo-500">Sign in</div></Link></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
