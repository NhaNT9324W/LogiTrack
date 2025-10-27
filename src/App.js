import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

// Import Pages
import LoginPage from './pages/auth/LoginPage';
// Admin
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageUsersPage from './pages/admin/ManageUsersPage';
import ReportPage from './pages/admin/ReportPage';
// Customer
import CustomerDashboard from './pages/customer/CustomerDashboard';
import CreateOrderPage from './pages/customer/CreateOrderPage';
import MyOrdersPage from './pages/customer/MyOrdersPage';
import TrackingPage from './pages/customer/TrackingPage';
// Dispatcher
import DispatcherDashboard from './pages/dispatcher/DispatcherDashboard';
import AssignOrderPage from './pages/dispatcher/AssignOrderPage';
import DispatcherTrackingPage from './pages/dispatcher/DispatcherTrackingPage'; // <-- IMPORT MỚI
// Shipper
import ShipperDashboard from './pages/shipper/ShipperDashboard';
// import ShipperMyOrdersPage from './pages/shipper/MyOrdersPage'; // Sẽ thêm sau

// Import Layouts
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';

function App() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/' || location.pathname === '/register';

  return (
    <div className="flex h-screen bg-gray-100">
      {!isAuthPage && <Sidebar />}
      <div className="flex-1 flex flex-col">
        {!isAuthPage && <Navbar />}
        <main className="flex-1 p-6 overflow-y-auto">
          <Routes>
            {/* Auth Routes */}
            <Route path="/" element={<LoginPage />} />
            <Route path="/login" element={<LoginPage />} />

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<ManageUsersPage />} />
            <Route path="/admin/reports" element={<ReportPage />} />

            {/* Customer Routes */}
            <Route path="/customer" element={<CustomerDashboard />} />
            <Route path="/customer/create" element={<CreateOrderPage />} />
            <Route path="/customer/orders" element={<MyOrdersPage />} />
            <Route path="/customer/tracking/:orderId" element={<TrackingPage />} />

            {/* Dispatcher Routes */}
            <Route path="/dispatcher" element={<DispatcherDashboard />} />
            <Route path="/dispatcher/pending" element={<AssignOrderPage />} />
            <Route path="/dispatcher/tracking" element={<DispatcherTrackingPage />} /> {/* <-- ROUTE MỚI */}

            {/* Shipper Routes */}
            <Route path="/shipper" element={<ShipperDashboard />} />
            {/* <Route path="/shipper/my-orders" element={<ShipperMyOrdersPage />} /> */} {/* Sẽ thêm sau */}

          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;