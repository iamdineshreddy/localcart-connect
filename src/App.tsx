import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, StoreProvider, useAuth } from "@/contexts/AppContext";
import NotFound from "./pages/NotFound.tsx";

// Auth
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";

// Buyer
import HomePage from "./pages/buyer/HomePage";
import ShopPage from "./pages/buyer/ShopPage";
import ProductDetailPage from "./pages/buyer/ProductDetailPage";
import CartPage from "./pages/buyer/CartPage";
import WishlistPage from "./pages/buyer/WishlistPage";
import OrdersPage from "./pages/buyer/OrdersPage";

// Seller
import SellerDashboard from "./pages/seller/SellerDashboard";
import AddProductPage from "./pages/seller/AddProductPage";
import SellerProductsPage from "./pages/seller/SellerProductsPage";
import SellerOrdersPage from "./pages/seller/SellerOrdersPage";
import EarningsPage from "./pages/seller/EarningsPage";
import KYCPage from "./pages/seller/KYCPage";

// Admin
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsersPage from "./pages/admin/AdminUsersPage";
import AdminProductsPage from "./pages/admin/AdminProductsPage";
import AdminKYCPage from "./pages/admin/AdminKYCPage";
import AdminFraudPage from "./pages/admin/AdminFraudPage";
import AdminAnalyticsPage from "./pages/admin/AdminAnalyticsPage";

const queryClient = new QueryClient();

function ProtectedRoute({ children, roles }: { children: React.ReactNode; roles?: string[] }) {
  const { user, isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (roles && user && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  const { isAuthenticated, user } = useAuth();

  return (
    <Routes>
      {/* Auth */}
      <Route path="/login" element={isAuthenticated ? <Navigate to={user?.role === 'admin' ? '/admin' : user?.role === 'seller' ? '/seller' : '/'} /> : <LoginPage />} />
      <Route path="/signup" element={isAuthenticated ? <Navigate to="/" /> : <SignupPage />} />

      {/* Buyer */}
      <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
      <Route path="/shop" element={<ProtectedRoute><ShopPage /></ProtectedRoute>} />
      <Route path="/product/:id" element={<ProtectedRoute><ProductDetailPage /></ProtectedRoute>} />
      <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
      <Route path="/wishlist" element={<ProtectedRoute><WishlistPage /></ProtectedRoute>} />
      <Route path="/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />

      {/* Seller */}
      <Route path="/seller" element={<ProtectedRoute roles={['seller']}><SellerDashboard /></ProtectedRoute>} />
      <Route path="/seller/products" element={<ProtectedRoute roles={['seller']}><SellerProductsPage /></ProtectedRoute>} />
      <Route path="/seller/add-product" element={<ProtectedRoute roles={['seller']}><AddProductPage /></ProtectedRoute>} />
      <Route path="/seller/orders" element={<ProtectedRoute roles={['seller']}><SellerOrdersPage /></ProtectedRoute>} />
      <Route path="/seller/earnings" element={<ProtectedRoute roles={['seller']}><EarningsPage /></ProtectedRoute>} />
      <Route path="/seller/kyc" element={<ProtectedRoute roles={['seller']}><KYCPage /></ProtectedRoute>} />

      {/* Admin */}
      <Route path="/admin" element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/users" element={<ProtectedRoute roles={['admin']}><AdminUsersPage /></ProtectedRoute>} />
      <Route path="/admin/products" element={<ProtectedRoute roles={['admin']}><AdminProductsPage /></ProtectedRoute>} />
      <Route path="/admin/kyc" element={<ProtectedRoute roles={['admin']}><AdminKYCPage /></ProtectedRoute>} />
      <Route path="/admin/fraud" element={<ProtectedRoute roles={['admin']}><AdminFraudPage /></ProtectedRoute>} />
      <Route path="/admin/analytics" element={<ProtectedRoute roles={['admin']}><AdminAnalyticsPage /></ProtectedRoute>} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <StoreProvider>
            <AppRoutes />
          </StoreProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
