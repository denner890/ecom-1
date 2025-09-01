import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AppShell from './components/layout/AppShell';

// Page imports
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import OrdersPage from './pages/dashboard/OrdersPage';
import WishlistPage from './pages/dashboard/WishlistPage';
import AdminPage from './pages/admin/AdminPage';
import AdminProductsPage from './pages/admin/AdminProductsPage';
import AdminOrdersPage from './pages/admin/AdminOrdersPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import ShowcasePage from './pages/ShowcasePage';
import ThemePreviewPage from './pages/ThemePreviewPage';

function App() {
  return (
    <Router>
      <AppShell>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/product/:slug" element={<ProductPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/auth/login" element={<LoginPage />} />
          <Route path="/auth/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/dashboard/orders" element={<OrdersPage />} />
          <Route path="/dashboard/wishlist" element={<WishlistPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/admin/products" element={<AdminProductsPage />} />
          <Route path="/admin/orders" element={<AdminOrdersPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/showcase" element={<ShowcasePage />} />
          <Route path="/theme-preview" element={<ThemePreviewPage />} />
        </Routes>
      </AppShell>
    </Router>
  );
}

export default App;