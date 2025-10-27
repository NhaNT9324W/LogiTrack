import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// --- Icons ---
const DashboardIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h12M3.75 3h16.5v11.25c0 1.242-.988 2.25-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 14.25V3Z" />
    </svg>
);

const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
    </svg>
);

const OrderIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.125-.504 1.125-1.125V14.25m-17.25 4.5h14.875M16.5 4.5h-9a4.5 4.5 0 0 0-4.5 4.5v7.5" />
    </svg>
);

const TrackingIcon = () => ( // Icon này vẫn được dùng cho Dispatcher
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
    </svg>
);
// --- End Icons ---


function Sidebar() {
    const { user } = useAuth();
    const location = useLocation();

    // --- Dữ liệu Menu ---
    const adminMenu = [
        { name: 'Dashboard', icon: <DashboardIcon />, path: '/admin' },
        { name: 'Quản lý Users', icon: <UserIcon />, path: '/admin/users' },
        { name: 'Báo cáo', icon: <OrderIcon />, path: '/admin/reports' },
    ];

    const dispatcherMenu = [
        { name: 'Dashboard', icon: <DashboardIcon />, path: '/dispatcher' },
        { name: 'Đơn chờ duyệt', icon: <OrderIcon />, path: '/dispatcher/pending' },
        { name: 'Đơn đang giao', icon: <TrackingIcon />, path: '/dispatcher/tracking' }, // <<< SỬA LỖI TRƯỚC: Trang này chưa tạo
    ];

    const shipperMenu = [
        // --- THAY ĐỔI DÒNG NÀY ---
        { name: 'Đơn của tôi', icon: <OrderIcon />, path: '/shipper/my-orders' },
        // -----------------------
        { name: 'Bản đồ giao hàng', icon: <TrackingIcon />, path: '/shipper/map' },
    ];

    const customerMenu = [
        { name: 'Dashboard', icon: <DashboardIcon />, path: '/customer' },
        { name: 'Tạo đơn hàng', icon: <OrderIcon />, path: '/customer/create' },
        { name: 'Đơn hàng của tôi', icon: <OrderIcon />, path: '/customer/orders' },
        // { name: 'Theo dõi đơn', icon: <TrackingIcon />, path: '/customer/tracking' }, // <<< ĐÃ XÓA DÒNG NÀY
    ];
    // --- End Dữ liệu Menu ---

    let menuItems = [];
    let menuTitle = "Menu";
    if (user) {
        switch (user.role) {
            case 'ADMIN':
                menuItems = adminMenu;
                menuTitle = "Menu (Admin)";
                break;
            case 'DISPATCHER':
                menuItems = dispatcherMenu;
                menuTitle = "Menu (Dispatcher)";
                break;
            case 'SHIPPER':
                menuItems = shipperMenu;
                menuTitle = "Menu (Shipper)";
                break;
            case 'CUSTOMER':
                menuItems = customerMenu;
                menuTitle = "Menu (Customer)";
                break;
            default:
                menuItems = [];
        }
    }

    if (!user) {
        return null;
    }

    return (
        <aside className="w-64 bg-white shadow-lg h-full flex-shrink-0">
            <div className="p-4 border-b">
                <h2 className="text-lg font-semibold text-gray-700">{menuTitle}</h2>
            </div>
            <nav className="mt-4">
                <ul>
                    {menuItems.map((item) => {
                        // Kiểm tra xem link có active không (dùng startsWith để highlight cả trang con)
                        const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
                        return (
                            <li key={item.name} className="px-4 py-1">
                                <Link
                                    to={item.path}
                                    className={`flex items-center space-x-3 p-2 rounded-md transition-colors ${isActive
                                        ? 'bg-blue-100 text-blue-700 font-semibold'
                                        : 'text-gray-600 hover:text-blue-600 hover:bg-gray-100'
                                        }`}
                                >
                                    {item.icon}
                                    <span>{item.name}</span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>
        </aside>
    );
}

export default Sidebar;