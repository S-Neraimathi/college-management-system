"use client"
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { firestore } from '@/firebase'
import { collection, getDocs, query, where } from 'firebase/firestore'
import Image from 'next/image';
import { format } from 'path';
import React, { useEffect, useState } from 'react'

export default function Approved() {

    const [addSRequests, setAddSRequests] = useState<AddChangeRequest[]>([]);
    const [addRRequests, setAddRRequests] = useState<AddChangeRequest[]>([]);
    const [removeSRequests, setRemoveSRequests] = useState<RemoveChangeRequest[]>([]);
    const [removeRRequests, setRemoveRRequests] = useState<RemoveChangeRequest[]>([]);
    const [updateSRequests, setUpdateSRequests] = useState<UpdateChangeRequest[]>([]);
    const [updateRRequests, setUpdateRRequests] = useState<UpdateChangeRequest[]>([]);
    console.log(updateSRequests);
    const fetchData = async () => {
        try {
            const collectionRef = collection(firestore, "changeRequest");
            const successA = query(collectionRef,
                where("isApproved", '==', "success"),
                where("type", '==', "Add")
            )
            const rejectA = query(collectionRef,
                where("isApproved", '==', "reject"),
                where("type", '==', "Add")
            )
            const successR = query(collectionRef,
                where("isApproved", '==', "success"),
                where("type", '==', "Remove")
            )
            const rejectR = query(collectionRef,
                where("isApproved", '==', "reject"),
                where("type", '==', "Remove")
            )
            const successU = query(collectionRef,
                where("isApproved", '==', "success"),
                where("type", '==', "Update")
            )
            const rejectU = query(collectionRef,
                where("isApproved", '==', "reject"),
                where("type", '==', "Update")
            )
            const successAddSnapShot = await getDocs(successA);
            const rejectAddSnapShot = await getDocs(rejectA);
            const successAddData = successAddSnapShot.docs.map(doc => ({
                id: doc.id,
                ...doc.data() as AddChangeRequest
            }))
            const rejectAddData = rejectAddSnapShot.docs.map(doc => ({
                id: doc.id,
                ...doc.data() as AddChangeRequest
            }))
            setAddSRequests(successAddData);
            setAddRRequests(rejectAddData);
            const successRemoveSnapShot = await getDocs(successR);
            const rejectRemoveSnapShot = await getDocs(rejectR);
            const successRemoveData = successRemoveSnapShot.docs.map(doc => ({
                id: doc.id,
                ...doc.data() as RemoveChangeRequest
            }))
            const rejectRemoveData = rejectRemoveSnapShot.docs.map(doc => ({
                id: doc.id,
                ...doc.data() as RemoveChangeRequest
            }))
            setRemoveSRequests(successRemoveData);
            setRemoveRRequests(rejectRemoveData);
            const successUpdateSnapShot = await getDocs(successU);
            const rejectUpdateSnapShot = await getDocs(rejectU);
            const successUpdateData = successUpdateSnapShot.docs.map(doc => ({
                id: doc.id,
                ...doc.data() as UpdateChangeRequest
            }))
            const rejectUpdateData = rejectUpdateSnapShot.docs.map(doc => ({
                id: doc.id,
                ...doc.data() as UpdateChangeRequest
            }))
            // console.log(successUpdateData);
            setUpdateSRequests(successUpdateData);
            setUpdateRRequests(rejectUpdateData);

        } catch (error) {
            console.log("Error while fetching details");

        }
    }
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

    useEffect(() => {
        fetchData();
    }, [])
    console.log(addSRequests);
    return (
        <>
            <div className="container mx-auto">
                <h1 className="pt-4 text-3xl font-semibold mb-4">Requests to be Approved</h1>
                <Tabs className="w-full" defaultValue="add">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger className='flex items-center' value="add">
                            Add
                            <Badge className="ml-2 rounded-full w-6 h-6 flex items-center justify-center" variant="default">
                                {addSRequests.length + addRRequests.length}
                            </Badge>
                        </TabsTrigger>
                        <TabsTrigger className='flex items-center' value="remove">
                            Remove
                            <Badge className="ml-2 rounded-full w-6 h-6 flex items-center justify-center" variant="default">
                                {removeRRequests.length + removeSRequests.length}
                            </Badge>
                        </TabsTrigger>
                        <TabsTrigger className='flex items-center' value="update">
                            Update
                            <Badge className="ml-2 rounded-full w-6 h-6 flex items-center justify-center" variant="default">
                                {updateRRequests.length + updateSRequests.length}
                            </Badge>
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="add">
                        <Tabs defaultValue='success'>
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger className='flex items-center' value="success">
                                    Approved Requests
                                    <Badge className="ml-2 rounded-full w-6 h-6 flex items-center justify-center" variant="default">
                                        {addSRequests.length}
                                    </Badge>
                                </TabsTrigger>
                                <TabsTrigger className='flex items-center' value="reject">
                                    Rejected Requests
                                    <Badge className="ml-2 rounded-full w-6 h-6 flex items-center justify-center" variant="default">
                                        {addRRequests.length}
                                    </Badge>
                                </TabsTrigger>
                            </TabsList>
                            <TabsContent value='success'>
                                <Card>
                                    <CardContent className="space-y-2">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>S.No.</TableHead>
                                                    <TableHead>Name</TableHead>
                                                    <TableHead>Image</TableHead>
                                                    <TableHead>Requested Time</TableHead>
                                                    <TableHead>Approved Time</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {addSRequests?.map((request, index) => (
                                                    <TableRow>
                                                        <TableCell>{index + 1}.</TableCell>
                                                        <TableCell>{request.name}</TableCell>
                                                        <TableCell>
                                                            <Image
                                                                src={request.imageUrl}
                                                                alt=''
                                                                height={1080}
                                                                width={1920}
                                                                className='rounded-full w-40'
                                                            />
                                                        </TableCell>
                                                        <TableCell>{formatTimestamp(request.requestedTime)}</TableCell>
                                                        <TableCell>{formatTimestamp(request.approvedTime)}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                            <TabsContent value='reject'>
                                <Card>
                                    <CardContent className="space-y-2">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>S.No.</TableHead>
                                                    <TableHead>Name</TableHead>
                                                    <TableHead>Image</TableHead>
                                                    <TableHead>Requested Time</TableHead>
                                                    <TableHead>Rejected Time</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {addRRequests?.map((request, index) => (
                                                    <TableRow>
                                                        <TableCell>{index + 1}.</TableCell>
                                                        <TableCell>{request.name}</TableCell>
                                                        <TableCell>
                                                            <Image
                                                                src={request.imageUrl}
                                                                alt=''
                                                                height={1080}
                                                                width={1920}
                                                                className='rounded-full w-40'
                                                            />
                                                        </TableCell>
                                                        <TableCell>{formatTimestamp(request.requestedTime)}</TableCell>
                                                        <TableCell>{formatTimestamp(request.approvedTime)}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </TabsContent>
                    <TabsContent value="remove">
                        <Tabs>
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger className='flex items-center' value="success">
                                    Approved Requests
                                    <Badge className="ml-2 rounded-full w-6 h-6 flex items-center justify-center" variant="default">
                                        {removeSRequests.length}
                                    </Badge>
                                </TabsTrigger>
                                <TabsTrigger className='flex items-center' value="reject">
                                    Rejected Requests
                                    <Badge className="ml-2 rounded-full w-6 h-6 flex items-center justify-center" variant="default">
                                        {removeRRequests.length}
                                    </Badge>
                                </TabsTrigger>
                            </TabsList>
                            <TabsContent value='success'>
                                <Card>
                                    <CardContent className="space-y-2">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>S.No.</TableHead>
                                                    <TableHead>Name</TableHead>
                                                    <TableHead>Requested Time</TableHead>
                                                    <TableHead>Approved Time</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {removeSRequests?.map((request, index) => (
                                                    <TableRow>
                                                        <TableCell>{index + 1}.</TableCell>
                                                        <TableCell>{request.name}</TableCell>
                                                        <TableCell>{formatTimestamp(request.requestedTime)}</TableCell>
                                                        <TableCell>{formatTimestamp(request.approvedTime)}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                            <TabsContent value='reject'>
                                <Card>
                                    <CardContent className="space-y-2">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>S.No.</TableHead>
                                                    <TableHead>Name</TableHead>
                                                    <TableHead>Requested Time</TableHead>
                                                    <TableHead>Rejected Time</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {removeRRequests?.map((request, index) => (
                                                    <TableRow>
                                                        <TableCell>{index + 1}.</TableCell>
                                                        <TableCell>{request.name}</TableCell>
                                                        <TableCell>{formatTimestamp(request.requestedTime)}</TableCell>
                                                        <TableCell>{formatTimestamp(request.approvedTime)}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </TabsContent>
                    <TabsContent value="update">
                        <Tabs>
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger className='flex items-center' value="success">
                                    Approved Requests
                                    <Badge className="ml-2 rounded-full w-6 h-6 flex items-center justify-center" variant="default">
                                        {updateSRequests.length}
                                    </Badge>
                                </TabsTrigger>
                                <TabsTrigger className='flex items-center' value="reject">
                                    Rejected Requests
                                    <Badge className="ml-2 rounded-full w-6 h-6 flex items-center justify-center" variant="default">
                                        {updateRRequests.length}
                                    </Badge>
                                </TabsTrigger>
                            </TabsList>
                            <TabsContent value='success'>
                                <Card>
                                    <CardContent className="space-y-2">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>S.No.</TableHead>
                                                    <TableHead>Name</TableHead>
                                                    <TableHead>Description</TableHead>
                                                    <TableHead>Requested Time</TableHead>
                                                    <TableHead>Approved Time</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {updateSRequests?.map((request, index) => (
                                                    <TableRow>
                                                        <TableCell>{index + 1}.</TableCell>
                                                        <TableCell>{request.name}</TableCell>
                                                        <TableCell>{request.description}</TableCell>
                                                        <TableCell>{formatTimestamp(request.requestedTime)}</TableCell>
                                                        <TableCell>{formatTimestamp(request.approvedTime)}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                            <TabsContent value='reject'>
                                <Card>
                                    <CardContent className="space-y-2">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>S.No.</TableHead>
                                                    <TableHead>Name</TableHead>
                                                    <TableHead>Description</TableHead>
                                                    <TableHead>Requested Time</TableHead>
                                                    <TableHead>Rejected Time</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {updateRRequests?.map((request, index) => (
                                                    <TableRow>
                                                        <TableCell>{index + 1}.</TableCell>
                                                        <TableCell>{request.name}</TableCell>
                                                        <TableCell>{request.description}</TableCell>
                                                        <TableCell>{formatTimestamp(request.requestedTime)}</TableCell>
                                                        <TableCell>{formatTimestamp(request.approvedTime)}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </TabsContent>
                </Tabs>


            </div>

        </>

    )
}
