"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SideNavbar from '../components/SideNavbar';
import AddBlogForm from '../components/AddBlogForm';

const AddBlogPage = () => {
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('Admin');
    const [date, setDate] = useState('');
    const [category, setCategory] = useState('');
    const [summary, setSummary] = useState('');
    const [image, setImage] = useState(null);
    const [content, setContent] = useState([{ title: '', text: '' }]);
    const [error, setError] = useState('');
    const [isMounted, setIsMounted] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isAuth, setIsAuth] = useState(false);

    const router = useRouter();

    useEffect(() => {
        setIsMounted(true);
        const role = localStorage.getItem('role');
        setIsAdmin(role === 'admin');
        if (role !== 'admin') {
            router.push('/');
        }

        const authStatus = localStorage.getItem('isAuth') === 'true';
        setIsAuth(authStatus);
        // Automatically set the date to today's date
        const today = new Date().toISOString().split('T')[0];
        setDate(today);
    }, [router]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('title', title);
        formData.append('author', author);
        formData.append('date', date);
        formData.append('category', category);
        formData.append('summary', summary);
        formData.append('image', image);
        formData.append('content', JSON.stringify(content));


        try {
            const response = await fetch('http://localhost:3001/blogs', {
                method: 'POST',
                body: formData,
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to add blog');
            }

            router.push('/blogs');
        } catch (error) {
            setError('Failed to add blog');
        }
    };
    const handleContentChange = (index, field, value) => {
        const newContent = [...content];
        newContent[index][field] = value;
        setContent(newContent);
    };

    const addContentSection = () => {
        setContent([...content, { title: '', text: '' }]);
    };


    if (!isMounted || !isAdmin) {
        return null;
    }

    return (
        <div className="flex flex-col md:flex-row bg-white min-h-screen">
            <SideNavbar />
            <div className="flex-1 ml-0 md:ml-60 py-8 px-4 transition-all duration-300">
                <div className="flex flex-col items-center justify-center flex-1 my-16">
                    <div className="w-full max-w-3xl bg-white rounded-lg shadow-lg p-10">
                        <h2 className="text-gray-800 font-semibold text-2xl mb-6">Add Blog</h2>
                        <AddBlogForm
                            handleSubmit={handleSubmit}
                            handleContentChange={handleContentChange}
                            addContentSection={addContentSection}
                            error={error}
                            content={content}
                            setTitle={setTitle}
                            setCategory={setCategory}
                            setSummary={setSummary}
                            setImage={setImage}
                            title={title}
                            category={category}
                            summary={summary}
                        />
                    </div>
                </div>
            </div>
        </div>


    );
}

export default AddBlogPage;