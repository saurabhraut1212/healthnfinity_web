"use client";

import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { AuthContext } from '../../context/AuthContext';

const UserLogs = () => {
    const { user } = useContext(AuthContext);
    const [logs, setLogs] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [selectedLog, setSelectedLog] = useState(null);

    const router = useRouter();
    const token = typeof window !== 'undefined' ? localStorage.getItem('healthToken') : null;


    useEffect(() => {
        if (!user) {
            router.push('/login');
        }
    }, [user, router]);


    const fetchLogs = async (page) => {
        setLoading(true);
        try {
            const endpoint = user?.role === 'admin' ? `/logs` : `/user/logs`;
            const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/v1${endpoint}?page=${page}&limit=10`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.status === 200) {
                setLogs(response.data.logs);
                setCurrentPage(response.data.currentPage);
                setTotalPages(response.data.totalPages);
                toast.success('Logs fetched successfully!');
            }
        } catch (error) {
            toast.error('Failed to fetch logs');
        } finally {
            setLoading(false);
        }
    };


    const handleDelete = async (logId) => {
        try {
            const response = await axios.delete(`${process.env.NEXT_PUBLIC_BASE_URL}/v1/log/${logId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.status === 200) {
                toast.success('Log soft deleted successfully');
                fetchLogs(currentPage);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error('Failed to delete log');
        }
    };


    const handleUpdateClick = (log) => {
        setSelectedLog(log);
        setShowModal(true);
    };


    const handleUpdateLog = async () => {
        try {
            const updateLog = {
                actionType: selectedLog.actionType,
                additionalData: {
                    email: selectedLog.additionalData.email,
                },
            };

            const response = await axios.put(`${process.env.NEXT_PUBLIC_BASE_URL}/v1/log/${selectedLog._id}`, updateLog, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.status === 200) {
                toast.success('Log updated successfully');
                setShowModal(false);
                fetchLogs(currentPage);
            }
        } catch (error) {
            toast.error('Failed to update log');
        }
    };

    useEffect(() => {
        if (user) {
            fetchLogs(currentPage);
        }
    }, [user, currentPage]);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage((prevPage) => prevPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage((prevPage) => prevPage - 1);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Logs List</h2>

            {loading ? (
                <p>Loading...</p>
            ) : (
                <table className="min-w-full bg-white border border-gray-300">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="px-4 py-2 border">#</th>
                            <th className="px-4 py-2 border">Action Type</th>
                            <th className="px-4 py-2 border">User</th>
                            <th className="px-4 py-2 border">Email</th>
                            <th className="px-4 py-2 border">Date</th>
                            <th className="px-4 py-2 border">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {logs.length > 0 ? (
                            logs.map((log, index) => (
                                <tr key={log._id}>
                                    <td className="border px-4 py-2">{index + 1 + (currentPage - 1) * 10}</td>
                                    <td className="border px-4 py-2">{log.actionType}</td>
                                    <td className="border px-4 py-2">{log.userId}</td>
                                    <td className="border px-4 py-2">{log.additionalData.email}</td>
                                    <td className="border px-4 py-2">{new Date(log.createdAt).toLocaleString()}</td>
                                    <td className="border px-4 py-2 flex space-x-2">
                                        <button
                                            onClick={() => handleDelete(log._id)}
                                            className={`px-2 py-1 rounded text-white ${user && log.userId === user.id ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-300 cursor-not-allowed'}`}
                                            disabled={!user || log.userId !== user?.id}
                                        >
                                            Delete
                                        </button>
                                        <button
                                            onClick={() => handleUpdateClick(log)}
                                            className={`px-2 py-1 rounded text-white ${user && log.userId === user.id ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-300 cursor-not-allowed'}`}
                                            disabled={!user || log.userId !== user?.id}
                                        >
                                            Update
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="border px-4 py-2 text-center">No logs found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}


            <div className="mt-4 flex justify-center">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-blue-500 text-white rounded mr-2 disabled:bg-gray-300"
                >
                    Previous
                </button>

                <span className="px-4 py-2">
                    Page {currentPage} of {totalPages}
                </span>

                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-blue-500 text-white rounded ml-2 disabled:bg-gray-300"
                >
                    Next
                </button>
            </div>


            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded shadow-lg">
                        <h3 className="text-lg font-bold mb-4">Update Log</h3>
                        <p>Action Type: {selectedLog?.actionType}</p>
                        <p>Email: {selectedLog?.additionalData.email}</p>
                        <button onClick={handleUpdateLog} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">Confirm Update</button>
                        <button onClick={() => setShowModal(false)} className="mt-4 ml-2 bg-gray-300 px-4 py-2 rounded">Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserLogs;
