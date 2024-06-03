import Link from 'next/link';

export default function TechnicianNavBar() {
    return (
        <nav className="flex justify-between items-center bg-gray-800 text-white p-4">
            <div className="flex items-center space-x-4">
                <Link href="/approve" className='hover:text-gray-300'>
                    Approve Requests
                </Link>
                <Link href="/department" className='hover:text-gray-300'>
                    Department Details
                </Link>
                <Link href="/ticketupdate" className='hover:text-gray-300'>
                    Update Tickets
                </Link>
                <Link href="/ticketstart" className='hover:text-gray-300'>
                    Start Repair
                </Link>
                <Link href="/ticketcomplete" className='hover:text-gray-300'>
                    End Repair
                </Link>
                <Link href="/showTicket" className='hover:text-gray-300'>
                    View Tickets
                </Link>
            </div>

        </nav>
    );
}
