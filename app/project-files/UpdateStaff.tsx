import { firestore } from '@/firebase';
import { addDoc, collection, doc, getDoc, serverTimestamp } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'

export default function UpdateStaff() {
    const [departmentData, setDepartmentData] = useState<Department | null>(null);
    const [selectedStaff, setSelectedStaff] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    useEffect(() => {
        const fetchDepartment = async () => {
            try {
                const docRef = doc(firestore, 'departments', 'BmDLpzJc6Eg94jCnIDax');
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data() as Department;
                    setDepartmentData(data);
                } else {
                    console.log('No such document!');
                }
            } catch (error) {
                console.error('Error fetching department:', error);
            }
        };

        fetchDepartment();
    }, []);

    const handleStaffChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedStaff(e.target.value);
    };

    const handleSubmit = async () => {
        try {
            if (selectedStaff && description) {
                const collectionRef = collection(firestore, 'changeRequest');
                await addDoc(collectionRef, {
                    updateId: selectedStaff.split("@")[0],
                    name: selectedStaff.split("@")[1],
                    isHoD: selectedStaff.split("@")[2],
                    requestedTime: serverTimestamp(),
                    isApproved: 'pending',
                    type: 'Update',
                    description,
                    approvedTime: null,
                });

                setSelectedStaff('');
                setDescription("");
            } else {
                console.error('No staff selected.');
            }
        } catch (error) {
            console.error('Error submitting removal request:', error);
        }
    };

    return (
        <div className="max-w-lg mx-auto mt-10">
            <h2 className="text-2xl font-semibold mb-4">Select Staff to Remove</h2>
            <select
                className="block w-full border border-gray-300 rounded-md px-4 py-2 mb-4"
                value={selectedStaff}
                onChange={handleStaffChange}
            >
                <option value="">Select Staff</option>
                {departmentData &&
                    departmentData.hod.map((hod, index) => (
                        <option key={hod.id} value={`${hod.id}@${hod.name}@${hod.isHoD}`}>
                            {hod.name} (HoD)
                        </option>
                    ))}
                {departmentData &&
                    departmentData.professors?.map((professor, index) => (
                        <option key={professor.id} value={`${professor.id}@${professor.name}@${professor.isHoD}`}>
                            {professor.name} (Professor)
                        </option>
                    ))}
            </select>
            {selectedStaff && (
                <div>

                    <label htmlFor="description" className="block">Description:</label>
                    <textarea id="description" name="description" value={description} onChange={(e) => setDescription(e.target.value)} className="border border-gray-300 rounded-md px-3 py-2 w-full" />
                </div>)}
            <button
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:bg-blue-200"
                onClick={handleSubmit}
                disabled={!(selectedStaff && description)}
            >
                Submit
            </button>
        </div>

    )
}
