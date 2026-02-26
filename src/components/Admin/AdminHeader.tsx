import { Search } from 'lucide-react';

const AdminHeader = () => (
    <header className="h-20 bg-white flex items-center justify-between px-8 shadow-md">
        <div className="flex items-center space-x-4">
            <h2 className="text-2xl font-bold text-gray-800">Customer Management</h2>
            <div className="relative w-96 mt-1 ml-4">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="w-3 h-3 text-gray-500" />
                </div>
                <input 
                    type="text" 
                    placeholder="Search by name, email, or ID..." 
                    className="w-xl bg-emerald-50 border border-gray-300 rounded-md px-4 py-2 pl-10"
                />
            </div>
        </div>
    </header>
);

export default AdminHeader;