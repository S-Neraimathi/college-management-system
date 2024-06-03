"use client"
import { firestore } from '@/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'

export default function Admin() {
    const [changeRequests, setChangeRequests] = useState<any[]>([]);
    const [error, setError] = useState('');
    useEffect(() => {
        const fetchChangeRequests = async () => {
            try {
                const changeRequestsCollection = collection(firestore, "changeRequest");
                const q = query(changeRequestsCollection,
                    where("isApprovedByHod", '==', "pending"),
                    where("isApprovedByPrincipal", '==', "pending")
                )
                const snapshot = await getDocs(changeRequestsCollection);

                const requestsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

                console.log(requestsData);
                setChangeRequests(requestsData);
            } catch (error) {
                console.error('Error fetching change requests:', error);
                setError('An error occurred.'); // Set an error state for handling (optional)
            }
        };

        fetchChangeRequests();
    }, []);
    return (
        <div>

        </div>
    )
}
