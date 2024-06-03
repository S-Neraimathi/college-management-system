"use client"
import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { useAuthStore } from '@/store/authStore'

export default function LoginDetails() {
    const { roleName, mail, logStatus, setLogStatus } = useAuthStore();
    return (
        <div className='flex items-center justify-end'>
            {logStatus ? (
                <Card className='max-w-sm'>
                    <CardHeader className="pb-4">
                        <CardTitle>Role: {roleName.substring(0, 1).toUpperCase() + roleName.substring(1)}</CardTitle>
                        <CardTitle>Email: {mail}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Button className="w-full" size="sm" onClick={() => setLogStatus(false)}>
                            Logout
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <h1>Login Is Not Done</h1>
            )}
        </div>
    )
}
