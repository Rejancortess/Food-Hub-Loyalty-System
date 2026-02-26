import { LayoutDashboard, Users } from 'lucide-react';
import logo1 from "../../assets/logo1.png";

const Sidebar = () => (
    <aside className="w-64 bg-white shadow-xl z-20 flex flex-col">
        <div className="flex items-center">
            <img className="rounded-full w-12 h-12 ml-7 mt-5" src={logo1} alt='Food logo' />
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
);

export default Sidebar;