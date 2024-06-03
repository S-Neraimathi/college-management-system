"use client"
import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { firestore } from '@/firebase';

export default function Page() {
    const [assignedTickets, setAssignedTickets] = useState<TicketDetail[]>([]);

    useEffect(() => {
        fetchAssignedTickets();
    }, []);
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
    const fetchAssignedTickets = async () => {
        const ticketsCollection = collection(firestore, 'tickets');
        const q = query(ticketsCollection, where('status', '==', 'assigned'));

        try {
            const querySnapshot = await getDocs(q);
            const assignedTicketsData: TicketDetail[] = [];
            querySnapshot.forEach((doc) => {
                assignedTicketsData.push({ docId: doc.id, ...doc.data() as TicketDetail });
            });
            setAssignedTickets(assignedTicketsData);
        } catch (error) {
            console.error('Error fetching assigned tickets:', error);
        }
    };

    const handleUpdateStatus = async (docId: string) => {
        try {
            const ticketRef = doc(firestore, 'tickets', docId);
            await updateDoc(ticketRef, { status: 'started', startTime: serverTimestamp() });
            fetchAssignedTickets(); // Re-fetch tickets after updating status
        } catch (error) {
            console.error('Error updating ticket status:', error);
        }
    };

    return (
        <div>
            {
                assignedTickets.length > 0 && (
                    <div>
                        <h2 className='text-2xl font-semibold mb-4'>Assigned Tickets</h2>
                        <table className='w-full border-collapse border'>
                            <thead>
                                <tr className='bg-gray-200'>
                                    <th className='border p-2'>S.No</th>
                                    <th className='border p-2'>Type</th>
                                    <th className='border p-2'>Device ID</th>
                                    <th className='border p-2'>Initiated Time</th>
                                    <th className='border p-2'>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {assignedTickets.map((ticket, index) => (
                                    <tr key={ticket.docId} className='bg-white'>
                                        <td className='border p-2'>{index + 1}</td>
                                        <td className='border p-2'>{ticket.type.toUpperCase()}</td>
                                        <td className='border p-2'>{ticket.deviceId}</td>
                                        <td className='border p-2'>{formatTimestamp(ticket.initiatedTime)}</td>
                                        <td className='border p-2'>
                                            <button className='bg-blue-500 hover:bg-blue-600 text-white py-1 px-2 rounded-md' onClick={() => handleUpdateStatus(ticket.docId!)}>Start the repair</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )
            }
            {assignedTickets.length === 0 && (
                <div className="mt-8 text-center">
                    <p className="text-3xl font-bold">No assigned repairs</p>
                    <p className="text-lg text-gray-600">You&apos;re all caught up! No repairs in progress at the moment.</p>
                </div>
            )}

        </div>
    );
}
