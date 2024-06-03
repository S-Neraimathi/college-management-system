"use client"
import React from 'react'
import AdminNavbar from './AdminNavBar';
import TechnicianNavBar from './TechnicianNavBar';
import HoDNavBar from './HoDNavBar';
import PrincipalNavBar from './PrincipalNavBar';

export default function NavBar() {
    const loginDataString = localStorage.getItem("login")!;
    const loginData = loginDataString ? JSON.parse(loginDataString) : null;
    return (
        <div className=' bg-black'>
            {!loginData && <div className='h-4 bg-black'></div>}
            {loginData && loginData.role === "admin" && <AdminNavbar />}
            {loginData && loginData.role === "technician" && <TechnicianNavBar />}
            {loginData && loginData.role === "hod" && <HoDNavBar />}
            {loginData && loginData.role === "principal" && <PrincipalNavBar />}
        </div>
    )
}
