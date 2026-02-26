import { LayoutDashboard, Search, Users } from 'lucide-react';
import logo1 from '../../../assets/logo1.png';

const Dashboard = () => {
    return (
    <>
        <div className="flex h-screen bg-gray-50 font-sans flex-1">
            <aside className="w-64 bg-white shadow-xl z-20 flex flex-col">
                <div className="flex items-center">
                    <img className="rounded-full w-12 h-12 ml-7 mt-5" src={logo1} alt='Food logo'></img>
                    <h3 className="text-base text-gray-800 font-bold mt-6 ml-4 leading-5">K-warriors<span className='block text-xs font-medium text-green-500'>Admin Hub</span></h3>
                </div>

        <nav className="mt-5 flex-1">
        <div className="flex flex-col px-6 py-4">
            <ul className="space-y-5">
                <li>
                    <button className="flex items-center space-x-3 text-gray-700 hover:text-green-600 cursor-pointer">
                        <LayoutDashboard className="w-6 h-6 ml-2" />
                        <span className="text-base font-medium">Dashboard</span>
                    </button>
                </li>
                <li>
                    <button className="flex items-center space-x-3 text-gray-700 hover:text-green-600 cursor-pointer">
                        <Users className="w-6 h-6 ml-2" />
                        <span className="text-base font-medium">Customers</span>
                    </button>
                </li>
            </ul>
        </div>
        </nav>
            </aside>

            <main className="flex-1 flex flex-col overflow-hidden">
                <header className="h-20 bg-white flex items-center justify-between px-8 shadow-md">
                    <div className="flex items-center space-x-4">
                        <h2 className="text-2xl font-bold text-gray-800">Customer Management</h2>
                        <div className="relative w-96 mt-1 ml-4">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="w-3 h-3 text-gray-500" />
                            </div>
                            <input type="text" placeholder="Search by name, email, or ID..." className="w-xl bg-emerald-50 border border-gray-300 rounded-md px-4 py-2 pl-10"/>
                        </div>
                    </div>
                </header>
            </main>
        </div>
    </>
    );
};

export default Dashboard;