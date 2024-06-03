"use client"
import React, { useState } from 'react';
import { firestore, storage } from '../../firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import RemoveStaff from '../project-files/RemoveStaff';
import UpdateStaff from '../project-files/UpdateStaff';

function ChangeRequest() {
    const [formData, setFormData] = useState({
        type: '',
        name: '',
        designation: '',
        specialization: '',
        imageUrl: '',
        email: '',
        isHoD: false,
        isApproved: "pending",
        description: '',
    });

    const [image, setImage] = useState<File | null>();

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prevState => ({
            ...prevState,
            name: e.target.value
        }));
    };

    const handleDesignationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        const isHoDVisible = value === "Associate Professor";
        setFormData(prevState => ({
            ...prevState,
            designation: value,
            isHoD: isHoDVisible ? prevState.isHoD : false
        }));
    };

    const handleSpecializationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prevState => ({
            ...prevState,
            specialization: e.target.value
        }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            setImage(files[0]);
        } else {
            alert("Select a file!")
        }
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prevState => ({
            ...prevState,
            email: e.target.value
        }));
    };

    const handleHoDChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prevState => ({
            ...prevState,
            isHoD: e.target.checked
        }));
    };

    const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setFormData(prevState => ({
            ...prevState,
            description: e.target.value
        }));
    };

    const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        setFormData(prevState => ({
            ...prevState,
            type: value,
        }));
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!image || !formData) {
            alert("Enter all fields");
            return;
        }

        const changeRequestRef = collection(firestore, 'changeRequest');
        const imageRef = ref(storage, `/images/${formData.name}.jpg`);

        try {
            await uploadBytes(imageRef, image);
            const downloadURL = await getDownloadURL(imageRef);
            const updatedData = {
                ...formData,
                imageUrl: downloadURL,
                requestedTime: serverTimestamp(),
                approvedTime: null,
            };

            await addDoc(changeRequestRef, updatedData);
            alert("Successfully added");

            setFormData({
                type: '',
                name: '',
                designation: '',
                specialization: '',
                imageUrl: '',
                email: '',
                isHoD: false,
                isApproved: "pending",
                description: '',
            });
            setImage(null);

        } catch (error) {
            console.error('Error submitting change request:', error);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-8 p-4 bg-gray-100 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Change Request Form</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="type" className="block">Type:</label>
                    <select name="type" id="type" value={formData.type} onChange={handleTypeChange} className="border border-gray-300 rounded-md px-3 py-2 w-full">
                        <option value="">Select</option>
                        <option value="Add">Add</option>
                        <option value="Remove">Remove</option>
                        <option value="Update">Update</option>
                    </select>
                </div>
                {formData.type === "Add" && (
                    <>
                        <div>
                            <label htmlFor="name" className="block">Name:</label>
                            <input type="text" id="name" name="name" value={formData.name} onChange={handleNameChange} className="border border-gray-300 rounded-md px-3 py-2 w-full" />
                        </div>
                        <div>
                            <label htmlFor="designation" className="block">Designation:</label>
                            <select name="designation" id="designation" value={formData.designation} onChange={handleDesignationChange} className="border border-gray-300 rounded-md px-3 py-2 w-full">
                                <option value="">Select</option>
                                <option value="Associate Professor">Associate Professor</option>
                                <option value="Professor">Professor</option>
                                <option value="Assistant Professor I">Assistant Professor I</option>
                                <option value="Assistant Professor II">Assistant Professor II</option>
                                <option value="Assistant Professor III">Assistant Professor III</option>
                            </select>
                        </div>
                        {formData.designation === "Associate Professor" && (
                            <div>
                                <label className="block">Head of Department:</label>
                                <input type="checkbox" name="isHoD" checked={formData.isHoD} onChange={handleHoDChange} />
                            </div>
                        )}
                        <div>
                            <label htmlFor="specialization" className="block">Specialization:</label>
                            <input type="text" id="specialization" name="specialization" value={formData.specialization} onChange={handleSpecializationChange} className="border border-gray-300 rounded-md px-3 py-2 w-full" />
                        </div>
                        <div>
                            <label htmlFor="description" className="block">Description:</label>
                            <textarea id="description" name="description" value={formData.description} onChange={handleDescriptionChange} className="border border-gray-300 rounded-md px-3 py-2 w-full" />
                        </div>
                        <div>
                            <label htmlFor="image" className="block">Image:</label>
                            <input type="file" accept="image/*" id="image" name="image" onChange={handleImageChange} className="border border-gray-300 rounded-md px-3 py-2 w-full" />
                        </div>
                        <div>
                            <label htmlFor="email" className="block">Email:</label>
                            <input type="email" id="email" name="email" value={formData.email} onChange={handleEmailChange} className="border border-gray-300 rounded-md px-3 py-2 w-full" />
                        </div>
                        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">Submit</button>
                    </>
                )}
            </form>
            {formData.type === "Remove" && (
                <RemoveStaff />
            )}
            {formData.type === "Update" && (
                <UpdateStaff />
            )}
        </div>
    );
}

export default ChangeRequest;
