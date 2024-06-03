import Link from 'next/link';

export default function AdminNavbar() {
    return (
        <nav className="flex justify-between items-center bg-gray-800 text-white p-4">
            <div className="flex items-center space-x-4">
                <Link href="/changeRequest">
                    Change Request
                </Link>
                <Link href="/department">
                    Department Details
                </Link>
                <Link href="/register">
                    Add Users
                </Link>
                <Link href="/approved">
                    Approved Requests
                </Link>
                <Link href="/ticketadd">
                    Add Ticket
                </Link>
                <Link href="/showTicket">
                    View Tickets
                </Link>

            </div>

        </nav>
    );
}
