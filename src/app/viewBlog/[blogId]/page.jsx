"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { motion } from 'framer-motion';
import { InView } from 'react-intersection-observer';
import SideNavbar from '../../components/SideNavbar';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';


const BlogDetails = () => {
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const params = useParams();
    const router = useRouter();
    const blogId = params.blogId;
    const [isAuth, setIsAuth] = useState(false);

    useEffect(() => {
        const authStatus = localStorage.getItem('isAuth') === 'true';
        setIsAuth(authStatus);
        if (!blogId) return;

        const fetchBlog = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/blogs/${blogId}`);
                setBlog(response.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch blog details');
                setLoading(false);
            }
        };

        fetchBlog();
    }, [blogId]);
    const handleDelete = async () => {
        try {
            await axios.delete(`http://localhost:3001/blogs/${blogId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            router.push('/blogs');  // Redirect to blogs page after deletion
        } catch (err) {
            setError('Failed to delete blog');
        }
    };


    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    const fadeInUp = {
        initial: { opacity: 0, y: 50 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 1.2, ease: "easeInOut" }
    };

    return (
        <div className="flex flex-col md:flex-row bg-white min-h-screen">
            <SideNavbar />
            <div className="flex-1 ml-0 md:ml-60 py-8 px-4 transition-all duration-300">
                <div className="container mx-auto p-4 text-center">
                    <div className="flex flex-col md:flex-row justify-between items-center mb-8">
                        <motion.h1
                            initial="initial"
                            animate="animate"
                            variants={fadeInUp}
                            className="text-2xl md:text-4xl font-bold my-4 md:my-12 pb-2"
                        >
                            {blog.title}
                        </motion.h1>

                        <div className="flex flex-col md:flex-row justify-center md:justify-start space-y-4 md:space-y-0 md:space-x-4">
                            
                            <Link href={`/updateBlog/${blog._id}`}>
                                <button className="bg-[#1ECB15] text-white py-2 px-4 rounded-full hover:bg-green-600 transition duration-200">
                                    <FontAwesomeIcon icon={faEdit} />
                                </button>
                            </Link>
                            {isAuth && (
                                <button
                                    onClick={handleDelete}
                                    className="bg-red-500 text-white py-2 px-4 rounded-full hover:bg-red-700 transition duration-200"
                                >
                                    <FontAwesomeIcon icon={faTrash} />
                                </button>
                            )}
                        </div>

                    </div>

                    <motion.img
                        initial="initial"
                        animate="animate"
                        variants={fadeInUp}
                        src={blog.image}
                        alt={blog.title}
                        className="mx-auto w-full md:w-[50%] h-auto object-cover object-center mb-4 rounded-lg shadow-lg"
                    />
                    <p className="text-gray-600 mb-4">{blog.author} · {new Date(blog.date).toLocaleDateString()}</p>
                </div>
                <div className="content space-y-6 mx-[5%] md:mx-[10%] p-4 md:p-8">
                    {blog.content.map((section, index) => (
                        <InView key={index} triggerOnce={false}>
                            {({ inView, ref }) => (
                                <motion.div
                                    ref={ref}
                                    initial="initial"
                                    animate={inView ? "animate" : "initial"}
                                    variants={fadeInUp}
                                    className="content-section"
                                >
                                    {section.title && (
                                        <h2 className="text-2xl md:text-3xl font-semibold mb-4 md:mb-8 text-[#1ECB15]">
                                            {section.title}
                                        </h2>
                                    )}
                                    <p className="text-base md:text-lg text-gray-700 font-semibold mb-4 md:mb-8">{section.text}</p>
                                </motion.div>
                            )}
                        </InView>
                    ))}
                </div>

            </div>
        </div>
    );
};

export default BlogDetails;
