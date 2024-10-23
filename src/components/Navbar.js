"use client";

import React, { useContext } from 'react';
import Link from 'next/link';
import { AuthContext } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const router = useRouter();

    console.log(user, "user")

    const handleLogout = () => {
        logout();
        toast.success('Logged out successfully!');

        setTimeout(() => {
            router.push('/login');
        }, 1500);
    };

    return (
        <nav className="bg-gray-100 shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">

                    <div className="flex-shrink-0">
                        <Link href="/" className="text-2xl font-bold text-blue-600">
                            MyLogo
                        </Link>
                    </div>

                    <div className="hidden md:flex space-x-8">
                        <Link href="/" className="text-gray-800 hover:text-blue-600">
                            Home
                        </Link>

                        {user ? (
                            <>
                                <Link href="/userlogs" className="text-gray-800 hover:text-blue-600">
                                    Logs
                                </Link>
                                <button onClick={handleLogout} className="text-gray-800 hover:text-blue-600">
                                    Logout
                                </button>
                            </>
                        ) : (
                            <Link href="/login" className="text-gray-800 hover:text-blue-600">
                                Login
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
