"use client"
import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { firestore } from '@/firebase';

export default function Page() {
    const [startedTickets, setStartedTickets] = useState<TicketDetail[]>([]);

    useEffect(() => {
        fetchStartedTickets();
    }, []);

    const fetchStartedTickets = async () => {
        const ticketsCollection = collection(firestore, 'tickets');
        const q = query(ticketsCollection, where('status', '==', 'started'));

        try {
            const querySnapshot = await getDocs(q);
            const startedTicketsData: TicketDetail[] = [];
            querySnapshot.forEach((doc) => {
                startedTicketsData.push({ docId: doc.id, ...doc.data() as TicketDetail });
            });
            setStartedTickets(startedTicketsData);
        } catch (error) {
            console.error('Error fetching started tickets:', error);
        }
    };

    const handleCompleteStatus = async (docId: string) => {
        try {
            const ticketRef = doc(firestore, 'tickets', docId);
            await updateDoc(ticketRef, { status: 'completed', completedTime: serverTimestamp() });
            fetchStartedTickets(); // Re-fetch tickets after updating status
        } catch (error) {
            console.error('Error updating ticket status:', error);
        }
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
            {startedTickets.length > 0 && <h2 className="text-2xl font-semibold">Started Tickets</h2>}
            {startedTickets.length === 0 ? (
                <div className="mt-8 text-center">
                    <p className="text-3xl font-bold">No ongoing repairs</p>
                    <p className="text-lg text-gray-600">You&apos;re all caught up! No repairs in progress at the moment.</p>
                </div>
            ) : (
                <div className="mt-4">
                    <table className="w-full border-collapse border">
                        <thead className="bg-gray-200">
                            <tr>
                                <th className="border p-2">S.No</th>
                                <th className="border p-2">Type</th>
                                <th className="border p-2">Device ID</th>
                                <th className="border p-2">Description</th>
                                <th className="border p-2">Price</th>
                                <th className="border p-2">Start Time</th>
                                <th className="border p-2">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {startedTickets.map((ticket, index) => (
                                <tr key={ticket.docId} className="bg-white">
                                    <td className="border p-2">{index + 1}</td>
                                    <td className="border p-2">{ticket.type.toUpperCase()}</td>
                                    <td className="border p-2">{ticket.deviceId}</td>
                                    <td className="border p-2">{ticket.description}</td>
                                    <td className="border p-2">{ticket.price}</td>
                                    <td className="border p-2">{formatTimestamp(ticket.startTime)}</td>
                                    <td className="border p-2">
                                        <button onClick={() => handleCompleteStatus(ticket.docId!)} className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-2 rounded-md">Finish the repair</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
