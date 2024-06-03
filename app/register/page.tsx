"use client"
import { CardTitle, CardDescription, CardHeader, CardContent, Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ChangeEvent, FormEvent, useState } from "react"
import { addDoc, collection, serverTimestamp } from "firebase/firestore"
import { firestore } from "@/firebase"
import { useToast } from "@/components/ui/use-toast"
import { useRegisterStore } from "@/store/registerStore"

export default function Register() {
    const { name, email, role, setName, setEmail, setRole } = useRegisterStore();
    const handleRadioChange = (e: ChangeEvent<HTMLInputElement>) => {
        setRole(e.target.value)
    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const userRef = collection(firestore, "users");
            const newUser = {
                name,
                role,
                email,
                firstTimeLogin: true,
                createdAt: serverTimestamp(),
            };

            if (!name || !email || !role) {
                alert("Enter all fields");
                return;
            }

            const docRef = await addDoc(userRef, newUser);
            console.log("Document written with ID:", docRef.id);
            alert("User added Successfully");
            setName("");
            setRole("");
            setEmail("");
        } catch (error) {
            alert("Error occurred while adding user");
        }
    };
    return (
        <form className="mx-auto max-w-sm md:max-w-md lg:max-w-2xl" onSubmit={handleSubmit}>
            <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold">Add User</CardTitle>
                <CardDescription>Enter the details below to create an account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex flex-col space-y-2">
                    <div className="flex items-center space-x-2">
                        <Label className="text-gray-700" htmlFor="name">
                            Name
                        </Label>
                        <Input id="name" placeholder="John Doe" value={name} onChange={e => setName(e.target.value)} required />
                    </div>
                    <div className="flex flex-col space-y-2">
                        <Label className="text-gray-700">Role</Label>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center space-x-2">
                                <Label htmlFor="admin">Admin</Label>
                                <input
                                    className="w-4 h-4 border-gray-300 rounded-full focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    id="admin"
                                    name="role"
                                    type="radio"
                                    value="admin"
                                    checked={role === "admin"}
                                    onChange={handleRadioChange}
                                />
                            </div>
                            <div className="flex items-center space-x-2">
                                <Label htmlFor="hod">HOD</Label>
                                <input
                                    className="w-4 h-4 border-gray-300 rounded-full focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    id="hod"
                                    name="role"
                                    type="radio"
                                    value="hod"
                                    checked={role === "hod"}
                                    onChange={handleRadioChange}
                                />
                            </div>
                            <div className="flex items-center space-x-2">
                                <Label htmlFor="technician">Technician</Label>
                                <input
                                    className="w-4 h-4 border-gray-300 rounded-full focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    id="technician"
                                    name="role"
                                    type="radio"
                                    value="technician"
                                    checked={role === "technician"}
                                    onChange={handleRadioChange}
                                />
                            </div>
                            <div className="flex items-center space-x-2">
                                <Label htmlFor="principal">Principal</Label>
                                <input
                                    className="w-4 h-4 border-gray-300 rounded-full focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    id="principal"
                                    name="role"
                                    type="radio"
                                    value="principal"
                                    checked={role === "principal"}
                                    onChange={handleRadioChange}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col space-y-2">
                    <div className="flex items-center space-x-2">
                        <Label className="text-gray-700" htmlFor="email">
                            Email
                        </Label>
                        <Input id="email" placeholder="m@example.com" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                    </div>
                </div>
                <Button className="w-full" type="submit">
                    Submit
                </Button>
            </CardContent>
        </form>
    )
}


