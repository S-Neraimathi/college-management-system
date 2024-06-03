"use client"
import React, { useEffect, useState } from 'react';
import { collection, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { firestore } from '@/firebase';

export default function Page() {
    const [tickets, setTickets] = useState<TicketDetail[]>([]);
    const [selectedType, setSelectedType] = useState('');
    const [deviceIds, setDeviceIds] = useState<string[]>([]);
    const [selectedDeviceId, setSelectedDeviceId] = useState('');
    const [selectedVendor, setSelectedVendor] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (selectedType === 'camera') {
            const cameraIds = tickets.filter(ticket => ticket.type === 'camera').map(ticket => `${ticket.id}@${ticket.deviceId}@${ticket.docId}`);
            setDeviceIds(cameraIds);
        } else if (selectedType === 'computer') {
            const computerIds = tickets.filter(ticket => ticket.type === 'computer').map(ticket => `${ticket.id}@${ticket.deviceId}@${ticket.docId}`);
            setDeviceIds(computerIds);
        }
    }, [selectedType, tickets]);

    const fetchData = async () => {
        const ticketsCollection = collection(firestore, 'tickets');
        const q = query(ticketsCollection, where("status", '==', "initiated"));
        const querySnapshot = await getDocs(q);
        const ticketData: TicketDetail[] = [];
        querySnapshot.forEach((doc) => {
            ticketData.push({ docId: doc.id, ...doc.data() as TicketDetail });
        });
        setTickets(ticketData);
    };

    const handleTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedType(event.target.value);
        setDescription('');
    };

    const handleDeviceIdChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedDeviceId(event.target.value);
        const docId = event.target.value.split('@')[2];
        const deviceId = event.target.value.split('@')[1];

        const selectedTicket = tickets.find(ticket => ticket.docId === docId);
        if (selectedTicket) {
            setDescription(selectedTicket.description);
        }
    };

    const handleVendorChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedVendor(event.target.value);
    };

    const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPrice(event.target.value);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!selectedDeviceId || !selectedVendor) {
            alert('Please select a device ID and vendor.');
            return;
        }

        const docId = selectedDeviceId.split('@')[2];

        try {
            const ticketRef = doc(firestore, 'tickets', docId);
            const updatedFields: Partial<TicketDetail> = {
                vendor: selectedVendor,
                price: selectedVendor === 'External Vendor' ? parseFloat(price) : 0,
                status: "assigned"
            };
            await updateDoc(ticketRef, updatedFields);
            setSelectedType("");
            setSelectedDeviceId("");
            setSelectedVendor("");
            setPrice("");
            setDescription("");
            alert('Ticket updated successfully!');
        } catch (error) {
            console.error('Error updating ticket:', error);
            alert('An error occurred while updating the ticket.');
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Update Tickets</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-sm font-semibold mb-2">Select Type:</label>
                    <select value={selectedType} onChange={handleTypeChange} className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500">
                        <option value="">Select</option>
                        <option value="camera">Camera</option>
                        <option value="computer">Computer</option>
                    </select>
                </div>
                {selectedType && deviceIds.length === 0 && (
                    <p className="text-lg text-gray-600">You&apos;re all caught up! No repairs in progress at the moment.</p>
                )}
                {selectedType && deviceIds.length > 0 && (
                    <>
                        <div className="mb-4">
                            <label className="block text-sm font-semibold mb-2">Select Device ID:</label>
                            <select value={selectedDeviceId} onChange={handleDeviceIdChange} className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500">
                                <option value="">Select a Device ID</option>
                                {deviceIds.map((deviceId, index) => (
                                    <option key={index} value={deviceId}>{deviceId.split("@")[1]}</option>
                                ))}
                            </select>
                        </div>
                        <label className="block text-sm font-semibold mb-2">Description:</label>
                        <textarea value={description} readOnly className="w-full border border-gray-300 rounded-md py-2 px-3 mb-4" />
                        <div className="mb-4">
                            <label className="block text-sm font-semibold mb-2">Select Vendor:</label>
                            <select value={selectedVendor} onChange={handleVendorChange} className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500">
                                <option value="">Select a Vendor</option>
                                <option value="Internal Vendor">Internal Vendor</option>
                                <option value="External Vendor">External Vendor</option>
                            </select>
                        </div>
                        {selectedVendor === 'External Vendor' && (
                            <div className="mb-4">
                                <label className="block text-sm font-semibold mb-2">Price:</label>
                                <input type="text" value={price} onChange={handlePriceChange} className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500" />
                            </div>
                        )}
                        <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md">Update Ticket</button>
                    </>
                )}
            </form>
        </div>
    );
}
