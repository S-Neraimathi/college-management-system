import { ScrollArea } from '@/components/ui/scroll-area';
import Image from 'next/image';
import React from 'react';

export default function StaffDetail({ name, designation, description, imageUrl }: StaffDetail) {
    console.log(description);

    return (
        <main className='flex h-96'>
            <div className='flex-1'>
                <div className='w-3/4 space-y-1'>
                    <Image
                        src={imageUrl}
                        alt=''
                        width={1920}
                        height={1080}
                    />
                    <h1 className='font-bold text-lg text-[#13294d] text-nowrap'>{name}</h1>
                    <h1 className='text-[#878787] text-sm font-semibold text-nowrap'>{designation}</h1>
                </div>
            </div>
            <div className='flex-1'>
                <ScrollArea className='scrollbar-hide text-justify p-0.5 h-full overflow-y-scroll'>
                    <p className='px-2 pr-3 py-4'>{description}</p>
                </ScrollArea>
            </div>
        </main>
    );
}
