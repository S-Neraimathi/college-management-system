"use client"
import React, { useEffect, useState } from 'react';
import { firestore } from '@/firebase';
import { addDoc, collection, getDocs, orderBy, query, serverTimestamp } from 'firebase/firestore';

function TicketAdd() {
    const [selectedOption, setSelectedOption] = useState('');
    const [selectedId, setSelectedId] = useState('');
    const [cameraOptions, setCameraOptions] = useState<Camera[]>([]);
    const [computerOptions, setComputerOptions] = useState<Computer[]>([]);
    const [description, setDescription] = useState('');

    useEffect(() => {
        fetchOptions();
    }, []);

    const fetchOptions = async () => {
        const collectionRefOne = collection(firestore, "camera");
        const collectionRefTwo = collection(firestore, "computers");
        const q1 = query(collectionRefOne, orderBy("cameraId"));
        const q2 = query(collectionRefTwo, orderBy("computerId"));

        const docSnapShotOne = await getDocs(q1);
        const docSnapShotTwo = await getDocs(q2);
        const cameraData = docSnapShotOne.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Camera));
        const computerData = docSnapShotTwo.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Computer));

        setCameraOptions(cameraData);
        setComputerOptions(computerData);
    };

    const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedOption(event.target.value);
        setSelectedId('');
    };

    const handleIdChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedId(event.target.value);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log(selectedId, selectedOption, description);

        if (!description || !selectedOption || !selectedId) {
            alert("Please select all fields.");
            return;
        }
        try {
            const ticketData = {
                type: selectedOption,
                id: selectedId.split("@")[0],
                deviceId: selectedId.split("@")[1],
                description,
                status: 'initiated',
                initiatedTime: serverTimestamp(),
                startTime: null,
                completedTime: null,
                vendor: "",
                price: 0,
            };

            // Add the ticket data to Firestore
            const docRef = await addDoc(collection(firestore, 'tickets'), ticketData);
            console.log('Ticket added with ID:', docRef.id);
            alert("Added successfully!")
            setDescription('');
            setSelectedOption('');
            setSelectedId('');
        } catch (error) {
            console.error('Error adding ticket:', error);
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Select an option:</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="mr-4">
                        <input type="radio" name="option" value="camera" checked={selectedOption === 'camera'} onChange={handleOptionChange} /> Camera
                    </label>
                    <label>
                        <input type="radio" name="option" value="computer" checked={selectedOption === 'computer'} onChange={handleOptionChange} /> Computer
                    </label>
                </div>
                {selectedOption && (
                    <div className="mb-4">
                        <h3 className="text-lg font-semibold">IDs:</h3>
                        <select value={selectedId} onChange={handleIdChange} className="block w-full py-2 px-3 border border-gray-300 rounded-md">
                            <option value="">Select an ID</option>
                            {selectedOption === 'camera' && cameraOptions.map((camera) => (
                                <option key={camera.cameraId} value={`${camera.id}@${camera.cameraId}`}>{camera.cameraId}</option>
                            ))}
                            {selectedOption === 'computer' && computerOptions.map((computer) => (
                                <option key={computer.computerId} value={`${computer.id}@${computer.computerId}`}>{computer.computerId}</option>
                            ))}
                        </select>
                    </div>
                )}
                {!selectedOption && <p className="text-red-500">Please select an option.</p>}
                <label htmlFor='description' className="block mb-4">
                    Description:
                    <textarea id='description' value={description} onChange={(e) => setDescription(e.target.value)} className="block w-full border border-gray-300 rounded-md mt-2 px-3 py-2"></textarea>
                </label>
                <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md">Submit</button>
            </form>
        </div>
    );
}

export default TicketAdd;
