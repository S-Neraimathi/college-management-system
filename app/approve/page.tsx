"use client"
import React, { useState, useEffect, DeprecatedLifecycle } from 'react';
import { firestore } from '../../firebase';
import { arrayUnion, collection, doc, getDoc, getDocs, query, serverTimestamp, updateDoc, where } from 'firebase/firestore';
import { TabsTrigger, TabsList, TabsContent, Tabs } from "@/components/ui/tabs"
import { CardTitle, CardDescription, CardHeader, CardContent, CardFooter, Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTrigger } from '@/components/ui/dialog';
import { log } from 'console';
export default function Approve() {
    const [changeRequests, setChangeRequests] = useState<any[]>([]);
    const [addRequests, setAddRequests] = useState<AddChangeRequest[]>([]);
    const [removeRequests, setRemoveRequests] = useState<RemoveChangeRequest[]>([]);
    const [updateRequests, setUpdateRequests] = useState<UpdateChangeRequest[]>([]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const collectionRef = collection(firestore, "changeRequest");
                const add = query(collectionRef,
                    where("isApproved", '==', "pending"),
                    where("type", '==', "Add")
                );
                const remove = query(collectionRef,
                    where("isApproved", '==', "pending"),
                    where("type", '==', "Remove")
                );
                const update = query(collectionRef,
                    where("isApproved", '==', "pending"),
                    where("type", '==', "Update")
                );
                const addSnapShot = await getDocs(add);
                const removeSnapShot = await getDocs(remove);
                const updateSnapShot = await getDocs(update);
                const addData = addSnapShot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data() as AddChangeRequest
                }));

                const removeData = removeSnapShot.docs.map(doc => ({ id: doc.id, ...doc.data() as RemoveChangeRequest }));
                const updateData = updateSnapShot.docs.map(doc => ({ id: doc.id, ...doc.data() as UpdateChangeRequest }));
                setAddRequests(addData);
                setRemoveRequests(removeData)
                setUpdateRequests(updateData);
            } catch (error) {
                console.error('Error fetching data: ', error);
            }
        };

        fetchData();
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

    const handleApprove = async (id: string, isHoD: boolean, type: string, sid?: string) => {
        try {
            if (type === "Add") {
                const docRef = doc(firestore, "changeRequest", id);
                await updateDoc(docRef, {
                    isApproved: "success",
                    approvedTime: serverTimestamp(),
                });
                const snapshot = await getDoc(doc(firestore, "changeRequest", id));
                const requestData = snapshot.data() as ChangeRequest;
                let data = {
                    name: requestData.name,
                    email: requestData.email,
                    description: requestData.description,
                    designation: requestData.designation,
                    specialization: requestData.specialization,
                    imageUrl: requestData.imageUrl,
                    isHoD: requestData.isHoD,
                    id,
                }
                if (isHoD && type == "Add") {
                    await updateDoc(doc(firestore, "departments", "BmDLpzJc6Eg94jCnIDax"), {
                        hod: arrayUnion({ ...data })
                    });
                } else if (!isHoD && type == "Add") {
                    await updateDoc(doc(firestore, "departments", "BmDLpzJc6Eg94jCnIDax"), {
                        professors: arrayUnion({ ...data })
                    });
                }
            } else if (type === "Remove") {
                const docRef = doc(firestore, "changeRequest", id);
                await updateDoc(docRef, {
                    isApproved: "success",
                    approvedTime: serverTimestamp(),
                });
                const departmentDocRef = doc(firestore, "departments", "BmDLpzJc6Eg94jCnIDax");
                const departmentSnapshot = await getDoc(departmentDocRef);
                const departmentData = departmentSnapshot.data() as Department;

                let updatedArray;
                if (isHoD) {
                    updatedArray = departmentData!.hod.filter((item) => item.id !== sid);
                    await updateDoc(departmentDocRef, {
                        hod: updatedArray
                    });
                } else {
                    updatedArray = departmentData!.professors.filter((item) => item.id !== sid);
                    await updateDoc(departmentDocRef, {
                        professors: updatedArray
                    });
                }
            } else {
                const docRef = doc(firestore, "changeRequest", id);
                await updateDoc(docRef, {
                    isApproved: "success",
                    approvedTime: serverTimestamp(),
                });
                const departmentDocRef = doc(firestore, "departments", "BmDLpzJc6Eg94jCnIDax");
                const departmentSnapshot = await getDoc(departmentDocRef);
                const departmentData = departmentSnapshot.data() as Department;
                const docSnap = await getDoc(docRef);
                let staffDetail;
                if (docSnap.exists()) {
                    staffDetail = docSnap.data() as UpdateChangeRequest;
                }
                const newDescription = staffDetail!.description;

                let saveData = departmentData;
                console.log(saveData, "Save Data");

                if (isHoD) {
                    const indexToUpdate = saveData.hod.findIndex(hod => hod.id === sid);
                    if (indexToUpdate !== -1) {
                        const update = saveData.hod[indexToUpdate];
                        const updatedDescription = `${update?.description} ${newDescription}`;
                        update.description = updatedDescription;
                        saveData.hod[indexToUpdate] = update;
                        const transformedSaveData: { [key: string]: any } = {
                            name: saveData.name,
                            hod: saveData.hod.map(hod => ({ ...hod })),
                            professors: saveData.professors.map(professor => ({ ...professor }))
                        };
                        await updateDoc(departmentDocRef, transformedSaveData);
                        console.log(transformedSaveData, "DB");

                    }

                } else {
                    const indexToUpdate = saveData.professors.findIndex(professor => professor.id === sid);
                    if (indexToUpdate !== -1) {
                        const update = saveData.professors[indexToUpdate];
                        const updatedDescription = `${update?.description} ${newDescription}`;
                        update.description = updatedDescription;
                        saveData.professors[indexToUpdate] = update;
                        const transformedSaveData: { [key: string]: any } = {
                            name: saveData.name,
                            hod: saveData.hod.map(hod => ({ ...hod })),
                            professors: saveData.professors.map(professor => ({ ...professor }))
                        };
                        console.log(transformedSaveData, "DB");

                        await updateDoc(departmentDocRef, transformedSaveData);
                    }
                }

            }


            alert("Approved Successfully!");
            window.location.reload();
        } catch (error) {
            console.error('Error updating document: ', error);
        }
    };


    const handleReject = async (id: string, isHoD: boolean) => {
        try {

            const docRef = doc(firestore, "changeRequest", id);
            await updateDoc(docRef, {
                isApproved: "Reject",
                approvedTime: serverTimestamp(),
            });
            alert("Rejected Successfully!")
            window.location.reload();
        } catch (error) {
            console.error('Error updating document: ', error);
        }
    };
    console.log(changeRequests.filter((request) => request.type === "Add"), "ADD");
    console.log(changeRequests.filter((request) => request.type === "Update"), "UPDATE");
    console.log(changeRequests.filter((request) => request.type === "Remove"), "REMOVE");

    return (
        <>
            <div className="container mx-auto">
                <h1 className="pt-4 text-3xl font-semibold mb-4">Requests to be Approved</h1>
                <Tabs className="w-full" defaultValue="add">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger className='flex items-center' value="add">
                            Add
                            <Badge className="ml-2 rounded-full w-6 h-6 flex items-center justify-center" variant="default">
                                {addRequests.length}
                            </Badge>
                        </TabsTrigger>
                        <TabsTrigger className='flex items-center' value="remove">
                            Remove
                            <Badge className="ml-2 rounded-full w-6 h-6 flex items-center justify-center" variant="default">
                                {removeRequests.length}
                            </Badge>
                        </TabsTrigger>
                        <TabsTrigger className='flex items-center' value="update">
                            Update
                            <Badge className="ml-2 rounded-full w-6 h-6 flex items-center justify-center" variant="default">
                                {updateRequests.length}
                            </Badge>
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="add">
                        <Card>
                            <CardContent className="space-y-2">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>S.No.</TableHead>
                                            <TableHead>Name</TableHead>
                                            <TableHead>Designation</TableHead>
                                            <TableHead>Specialization</TableHead>
                                            <TableHead>Email</TableHead>
                                            <TableHead>Image</TableHead>
                                            <TableHead>Description</TableHead>
                                            <TableHead>Requested Time   </TableHead>
                                            <TableHead>Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {addRequests?.map((request, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{index + 1}.</TableCell>
                                                <TableCell>{request.name}</TableCell>
                                                <TableCell>{request.designation}</TableCell>
                                                <TableCell>{request.specialization}</TableCell>
                                                <TableCell>{request.email}</TableCell>
                                                <TableCell>
                                                    <Image
                                                        src={request.imageUrl}
                                                        alt=''
                                                        height={1080}
                                                        width={1920}
                                                        className='rounded-full'
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Dialog>
                                                        <DialogTrigger className='h-40 overflow-y-hidden w-40 text-left'>
                                                            {request.description}
                                                        </DialogTrigger>
                                                        <DialogContent>
                                                            <DialogHeader>
                                                                <DialogDescription>
                                                                    {request.description}
                                                                </DialogDescription>
                                                            </DialogHeader>
                                                        </DialogContent>
                                                    </Dialog>
                                                </TableCell>
                                                <TableCell>{formatTimestamp(request.requestedTime)}</TableCell>
                                                <TableCell className='flex flex-col space-y-5 justify-end'>
                                                    <button onClick={() => handleApprove(request.id!, request.isHoD, request.type)} className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">
                                                        Approve
                                                    </button>
                                                    <button onClick={() => handleReject(request.id!, request.isHoD)} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded">
                                                        Reject
                                                    </button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="remove">
                        <Card>
                            <CardContent className="space-y-2">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>S.No.</TableHead>
                                            <TableHead>Name</TableHead>
                                            <TableHead>Requested Time</TableHead>
                                            <TableHead>Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {removeRequests?.map((request, index) => (
                                            <TableRow key={index + request.name}>
                                                <TableCell>{index + 1}.</TableCell>
                                                <TableCell>{request.name}</TableCell>
                                                <TableCell>{formatTimestamp(request.requestedTime)}</TableCell>
                                                <TableCell className='flex flex-col space-y-5 justify-end'>
                                                    <button onClick={() => handleApprove(request.id!, request.isHoD, request.type, request.removeId)} className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">
                                                        Approve
                                                    </button>
                                                    <button onClick={() => handleReject(request.id!, request.isHoD)} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded">
                                                        Reject
                                                    </button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="update">
                        <Card>
                            <CardContent className="space-y-2">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>S.No.</TableHead>
                                            <TableHead>Name</TableHead>
                                            <TableHead>Description</TableHead>
                                            <TableHead>Requested Time</TableHead>
                                            <TableHead>Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {updateRequests?.map((request, index) => (
                                            <TableRow key={index + request.name}>
                                                <TableCell>{index + 1}.</TableCell>
                                                <TableCell>{request.name}</TableCell>
                                                <TableCell>
                                                    <Dialog>
                                                        <DialogTrigger className='h-40 overflow-y-hidden w-40 text-left'>
                                                            {request.description}
                                                        </DialogTrigger>
                                                        <DialogContent>
                                                            <DialogHeader>
                                                                <DialogDescription>
                                                                    {request.description}
                                                                </DialogDescription>
                                                            </DialogHeader>
                                                        </DialogContent>
                                                    </Dialog>
                                                </TableCell>
                                                <TableCell>{formatTimestamp(request.requestedTime)}</TableCell>
                                                <TableCell className='flex flex-col space-y-5 justify-end'>
                                                    <button onClick={() => handleApprove(request.id!, request.isHoD, request.type, request.updateId)} className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">
                                                        Approve
                                                    </button>
                                                    <button onClick={() => handleReject(request.id!, request.isHoD)} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded">
                                                        Reject
                                                    </button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>


            </div>

        </>
    );
}
