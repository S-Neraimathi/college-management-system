import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import React from 'react'
import Staff from "./Staff"
import StaffDetail from "./StaffDetail"

export default function Popover({ name, designation, imageUrl, email, specialization, description }: PopOverProps) {
    return (
        <Dialog>
            <DialogTrigger>
                <Staff name={name} designation={designation} imageUrl={imageUrl} email={email} specialization={specialization} />
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogDescription>
                        <StaffDetail imageUrl={imageUrl} name={name} designation={designation} description={description!} />
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}
