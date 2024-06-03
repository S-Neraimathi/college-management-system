import Image from 'next/image';
import React from 'react';

export default function Staff({ name, designation, imageUrl, email, specialization }: PopOverProps) {
    return (
        <div className="staff-card">
            <div className="rounded-lg shadow-lg bg-white flex items-center"> {/* Added 'items-center' class */}
                <div className="md:flex-shrink-0 w-56 h-64"> {/* Set fixed width and height */}
                    <Image
                        src={imageUrl}
                        alt=''
                        width={1920}
                        height={1080}
                        className='h-full w-full object-cover'
                    />
                </div>
                <div className="p-8 bg-gray-100 flex-1 text-left">
                    <div className="font-bold text-xl text-[#13294d]">
                        {name}
                    </div>
                    <div className="">
                        <h1 className="text-[#878787] text-lg font-medium">{designation}</h1>
                    </div>
                    <div className="mt-4">
                        <h1 className="text-[#13294d] font-semibold">Specialization</h1>
                        <h1 className="text-[#878787] text-xl font-semibold">
                            {specialization}
                        </h1>
                    </div>
                    <div className="mt-4">
                        <h1 className="text-[#13294d] font-semibold">Email id</h1>
                        <h1 className="text-[#878787] font-medium">{email}</h1>
                    </div>
                </div>
            </div>
        </div>
    );
}
