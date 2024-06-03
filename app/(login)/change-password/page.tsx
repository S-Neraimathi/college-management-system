"use client"
import { CardTitle, CardDescription, CardHeader, CardContent, CardFooter, Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { FormEvent, use, useState } from "react"
import EyeIcon from "@/components/component/EyeIcon"
import { addDoc, collection, getDocs, query, updateDoc, where } from "firebase/firestore"
import firebase from "firebase/compat/app"
import { firestore } from "@/firebase"
import { useSearchParams } from "next/navigation"
import { useChangePasswordStore } from "@/store/changePasswordStore"
import { useAuthStore } from "@/store/authStore"
import { useRouter } from "next/navigation"

export default function ChangePassword() {
    const { password, confirmPassword, showPassword, showConfirmPassword, setPassword, setConfirmPassword, setShowPassword, setShowConfirmPassword } = useChangePasswordStore();
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get("email");
    const role = searchParams.get("role");
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert("Enter same passwords...");
            return;
        }
        try {
            const loginRef = collection(firestore, "login");
            const newUser = {
                email,
                password,
                role
            }
            const userRef = collection(firestore, "users");
            const q = query(
                userRef,
                where("email", "==", email),
            );
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
                const doc = querySnapshot.docs[0];
                const docRef = doc.ref;
                try {
                    await updateDoc(docRef, { firstTimeLogin: false });
                } catch (error) {
                    alert("Not Updated The firstTimeLogin")
                }
            }
            try {
                const docRef = await addDoc(loginRef, newUser);
                const user = {
                    email: newUser.email,
                    role: newUser.role,
                }
                alert("Saved the password!");
                localStorage.setItem("login", JSON.stringify(user))
                router.push("/");
                router.refresh();
            } catch (error) {
                alert("Not Saved the password")
            }
        } catch (error) {
            console.log("Couldn't Save Password");
        }
    }
    return (
        <form className="w-full max-w-sm mx-auto" onSubmit={handleSubmit}>
            <CardHeader>
                <CardTitle className="text-2xl">Set your password</CardTitle>
                <CardDescription>Please enter your new password below.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="relative space-y-2">
                    <div className="flex items-center">
                        <Label htmlFor="password">Password</Label>
                    </div>
                    <Input id="password" required type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} />
                    <Button onClick={() => setShowPassword(!showPassword)} className="absolute bottom-1 right-1 h-7 w-7" size="icon" variant="ghost">
                        <EyeIcon className="h-4 w-4" />
                        <span className="sr-only">Toggle password visibility</span>
                    </Button>
                </div>
                <div className="relative space-y-2">
                    <div className="flex items-center">
                        <Label htmlFor="confirm-password">Confirm Password</Label>
                    </div>
                    <Input id="confirm-password" required type={showConfirmPassword ? "text" : "password"} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
                    <Button onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute bottom-1 right-1 h-7 w-7" size="icon" variant="ghost">
                        <EyeIcon className="h-4 w-4" />
                        <span className="sr-only">Toggle password visibility</span>
                    </Button>
                </div>
            </CardContent>
            <CardFooter>
                <Button className="w-full" type="submit">Save password</Button>
            </CardFooter>
        </form>
    )
}
