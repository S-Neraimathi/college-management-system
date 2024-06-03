"use client"
import LoginDetails from '@/components/LoginDetails';
import { TicketAdd } from '@/components/component/ticket-add';
import TicketDetails from '@/components/component/ticket-details';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthStore } from '@/store/authStore'
import Link from 'next/link';
import React from 'react'
import AdminNavbar from '../project-files/AdminNavBar';

export default function DashBoard() {
    const loginDataString = localStorage.getItem("login");
    const loginData = loginDataString ? JSON.parse(loginDataString) : null;
    return (
        <div>

        </div>
    )
}
