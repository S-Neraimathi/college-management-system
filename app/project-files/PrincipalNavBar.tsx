import Link from 'next/link';

export default function PrincipalNavBar() {
    return (
        <nav className="flex justify-between items-center bg-gray-800 text-white p-4">
            <div className="flex items-center space-x-4">
                <Link href="/">
                    <a className="hover:text-gray-300">Home</a>
                </Link>
                <Link href="/reports">
                    <a className="hover:text-gray-300">Reports</a>
                </Link>
                {/* Add additional Principal links here if needed */}
            </div>
            <div>
                {/* Add Principal specific actions or links here */}
            </div>
        </nav>
    );
}
