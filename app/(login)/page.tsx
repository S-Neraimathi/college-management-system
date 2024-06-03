"use client"
import { CardTitle, CardDescription, CardHeader, CardContent, Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FormEvent, useEffect, useState } from "react"
import { collection, getDoc, getDocs, getFirestore, query, where } from "firebase/firestore"
import EyeIcon from "@/components/component/EyeIcon"
import { useRouter } from "next/navigation"
import { firestore } from "@/firebase"
import { useLoginStore } from "@/store/loginStore"
import { useAuthStore } from "@/store/authStore"

export default function Login() {
    const isLoggedIn = localStorage.getItem("login");
    const { email, setEmail, password, setPassword, showPassword, setShowPassword } = useLoginStore();
    const router = useRouter();
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const userRef = collection(firestore, "users");
            const q = query(
                userRef,
                where("email", "==", email),
                where("firstTimeLogin", "==", true)
            );
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                const q = query(userRef, where("email", "==", email));
                if (!email || !password) {
                    alert("Enter all fields");
                    return;
                }
                const foundEmail = await getDocs(q);
                if (foundEmail) {
                    try {
                        const loginRef = collection(firestore, "login");
                        const q = query(
                            loginRef,
                            where("email", "==", email),
                            where("password", "==", password)
                        );
                        const querySnapshot = await getDocs(q);

                        if (querySnapshot.empty) {
                            alert("Invalid user credentials");
                            return;
                        } else {
                            alert("User logged in successfully!");
                            const doc = querySnapshot.docs[0];
                            const role = doc.data().role;
                            const email = doc.data().email;
                            const user = {
                                role,
                                email
                            }
                            setEmail('');
                            setPassword('');
                            localStorage.setItem("login", JSON.stringify(user));
                            router.refresh();
                            return;
                        }
                    } catch (error) {
                        console.log("Error occured while checking for login data");
                        return;
                    }
                }
                alert("Email not found. Type the correct email...");
                return;
            } else {
                // Get password and Save
                const doc = querySnapshot.docs[0];
                const role = doc.data().role;
                router.push(`/change-password?email=${email}&role=${role}`);
                return;
            }
        } catch (error) {
            console.error(error);
            return;
        }
    };


    return (
        <div>
            {isLoggedIn ? (<></>) : (<form className="mx-auto max-w-sm" onSubmit={handleSubmit}>
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold">Login</CardTitle>
                    <CardDescription>Enter your email below to login to your account</CardDescription>
                </CardHeader >
                <CardContent>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" placeholder="m@example.com" required type="email" value={email} onChange={e => setEmail(e.target.value)} />
                        </div>
                        <div className="relative space-y-2">
                            <div className="flex items-center">
                                <Label htmlFor="password">Password</Label>
                            </div>
                            <Input id="password" type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} />
                            <Button onClick={() => setShowPassword(!showPassword)} className="absolute bottom-1 right-1 h-7 w-7" size="icon" variant="ghost">
                                <EyeIcon className="h-4 w-4" />
                                <span className="sr-only">Toggle password visibility</span>
                            </Button>
                        </div>
                        <Button className="w-full" type="submit">
                            Login
                        </Button>
                    </div>
                </CardContent>
            </form >
            )
            }
        </div >
    )
}
