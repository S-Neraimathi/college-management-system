"use client"
import { firestore } from '@/firebase';
import { collection, getDocs } from 'firebase/firestore';
import React, { useState, useEffect } from 'react';

export default function Page() {
    const [tickets, setTickets] = useState<TicketDetail[]>([]);
    const [filter, setFilter] = useState('all'); // Default filter

    useEffect(() => {
        fetchTickets();
    }, []);

    const fetchTickets = async () => {
        try {
            const ticketsCollection = collection(firestore, "tickets");
            const docSnapShot = await getDocs(ticketsCollection);

            const data = docSnapShot.docs.map((doc) => ({ docId: doc.id, ...doc.data() } as TicketDetail))
            setTickets(data);
        } catch (error) {
            console.error('Error fetching tickets:', error);
        }
    };

    const filterTickets = (status: string) => {
        if (status === 'all') {
            return tickets;
        } else {
            return tickets.filter(ticket => ticket.status === status);
        }
    };

    const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setFilter(event.target.value);
    };

    function formatTimestamp(timestamp: timestamp) {
        const seconds = timestamp.seconds;
        const nanoseconds = timestamp.nanoseconds;
        const milliseconds = seconds * 1000 + nanoseconds / 1000000;
        const date = new Date(milliseconds);
        const formattedDate = date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: true,
        });
        return formattedDate;
    }

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">Tickets</h1>
            <label className="mb-4">
                Filter:
                <select value={filter} onChange={handleFilterChange} className="ml-2 px-2 py-1 border rounded-md mb-5">
                    <option value="all">All</option>
                    <option value="started">Ongoing</option>
                    <option value="completed">Completed</option>
                </select>
            </label>
            <table className="w-full border-collapse border">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border p-2">S.No.</th>
                        <th className="border p-2">Type</th>
                        <th className="border p-2">Device Id</th>
                        <th className="border p-2">Description</th>
                        <th className="border p-2">Vendor</th>
                        <th className="border p-2">Price</th>
                        {filter === 'all' && (<th className='border p-2'>Initiated Time</th>)}
                        {filter === 'all' && (<th className="border p-2">Status</th>)}
                        {filter === 'started' && (<th className="border p-2">Start Time</th>)}
                        {filter === 'completed' && (<th className="border p-2">Completed Time</th>)}
                    </tr>
                </thead>
                <tbody>
                    {filterTickets(filter).map((ticket, index) => (
                        <tr key={ticket.id} className="bg-white">
                            <td className="border p-2">{index + 1}</td>
                            <td className="border p-2">{ticket.type.toUpperCase()}</td>
                            <td className="border p-2">{ticket.deviceId}</td>
                            <td className="border p-2">{ticket.description}</td>
                            <td className="border p-2">{ticket.vendor}</td>
                            <td className="border p-2">{ticket.price}</td>
                            {filter === 'all' && (<td className="border p-2">{formatTimestamp(ticket.initiatedTime)}</td>)}
                            {filter === 'all' && (
                                <td className="border p-2">
                                    {ticket.status === "started" && "Ongoing"}
                                    {ticket.status === "completed" && "Completed"}
                                    {ticket.status === "initiated" && "Initiated"}
                                    {ticket.status === "assigned" && "Assigned"}
                                </td>
                            )}
                            {filter === 'started' && (
                                <td className="border p-2">{formatTimestamp(ticket.startTime)}</td>
                            )}
                            {filter === 'completed' && (
                                <td className="border p-2">{formatTimestamp(ticket.completedTime)}</td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
