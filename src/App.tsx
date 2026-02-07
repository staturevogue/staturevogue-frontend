import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { Toaster } from 'sonner';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import ProductListing from './pages/ProductListing';
import Login from './pages/Login'; // New Page
import User from './pages/User'; // 👈 Import the User Page
import ScrollToTop from './components/ScrollToTop'; // New Component
import Checkout from "./pages/Checkout";
import Returns from "./pages/Returns";
import Shipping from "./pages/Shipping";

function App() {
  return (
    <CartProvider>
      <Router>
        <ScrollToTop /> {/* 👈 Fixes the scrolling issue */}
        <Header />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/products" element={<ProductListing />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} /> {/* 👈 New Login Route */}
          <Route path="/user" element={<User />} />
          {/* Helper routes for gender links */}
          <Route path="/men" element={<ProductListing />} />
          <Route path="/women" element={<ProductListing />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/returns" element={<Returns />} />
          <Route path="/shipping" element={<Shipping />} />
          
        </Routes>

        <Footer />
        <Toaster position="top-center" richColors />
      </Router>
    </CartProvider>
  );
}

export default App;