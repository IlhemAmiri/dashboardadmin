"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import AllBlogs from '../components/AllBlogs';
import SideNavbar from '../components/SideNavbar';

interface Blog {
    _id: string;
    title: string;
    author: string;
    date: string;
    category: string;
    image: string;
    summary: string;
}

const PageBlogs = () => {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [isAuth, setIsAuth] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const blogsPerPage = 12;
    const [totalBlogs, setTotalBlogs] = useState(0);
    const [isMounted, setIsMounted] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    const router = useRouter();

    const fetchBlogs = async (page: number) => {
        try {
            const res = await axios.get(`http://localhost:3001/blogs?page=${page}&limit=${blogsPerPage}`);
            setBlogs(res.data.data);
            setTotalBlogs(res.data.total);
        } catch (error) {
            console.error("Failed to fetch blogs:", error);
        }
    };

    useEffect(() => {
        setIsMounted(true);
        const role = localStorage.getItem('role');
        const authStatus = localStorage.getItem('isAuth') === 'true';
        setIsAuth(authStatus);
        setIsAdmin(role === 'admin');
        if (role !== 'admin') {
            router.push('/');
        }
    }, [router]);

    useEffect(() => {
        if (isAdmin) {
            fetchBlogs(currentPage);
        }
    }, [currentPage, isAdmin]);

    const totalPages = Math.ceil(totalBlogs / blogsPerPage);
    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    return (
        <div>
            <div className="flex bg-white min-h-screen">
                <SideNavbar />
                <div className="flex-1 ml-0 md:ml-60 py-8 px-4 transition-all duration-300">
                    <AllBlogs
                        blogs={blogs}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                        totalPages={totalPages}
                        formatDate={formatDate}
                    />
                </div>
            </div>
        </div>
    );
};

export default PageBlogs;