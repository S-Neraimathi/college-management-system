import Link from 'next/link';

export default function HoDNavBar() {
    return (
        <nav className="flex justify-between items-center bg-gray-800 text-white p-4">
            <div className="flex items-center space-x-4">
                <Link href="/department" className="hover:text-gray-300">
                    Department Details
                </Link>
                <Link href="/change-request" className="hover:text-gray-300">
                    View Request
                </Link>
            </div>
        </nav>
    );
}
