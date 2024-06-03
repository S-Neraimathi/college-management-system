"use client"
import Image from 'next/image'
import React from 'react'
import logo from '@/public/logo.png'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
export default function Header() {
    const loginDataString = localStorage.getItem("login")!;
    const loginData = loginDataString ? JSON.parse(loginDataString) : null;
    const router = useRouter();
    const handleLogout = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        localStorage.removeItem("login");
        router.push("/");
        setTimeout(() => {
            window.location.reload();
        }, 1000);

    }
    return (
        <div className='flex items-center justify-between p-2'>
            <Image
                src={logo}
                alt=''
                width={1920}
                height={1080}
                className='w-64 md:w-[30%]'
            /> {
                loginData && (<div className='flex flex-col bg-gray-400 p-2 rounded-xl space-y-2 w30
                 h-30'>
                    <h1 className='text-nowrap truncate'>Usermail: {loginData.email}</h1>
                    <h1 className='text-nowrap'>Usertype: {loginData.role}</h1>
                    <Button onClick={handleLogout}>Logout</Button>
                </div>)
            }
        </div>
    )
}
