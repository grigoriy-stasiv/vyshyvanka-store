import { Routes, Route } from "react-router-dom";

import Header from "./components/Header/Header";
import Hero from "./components/Hero/Hero";
import Categories from "./components/Categories/Categories";
import PopularProducts from "./components/PopularProducts/PopularProducts";
import AboutBrand from "./components/AboutBrand/AboutBrand";
import Benefits from "./components/Benefits/Benefits";
import Reviews from "./components/Reviews/Reviews";
import Newsletter from "./components/Newsletter/Newsletter";
import Footer from "./components/Footer/Footer";
import Catalog from "./pages/Catalog/Catalog";
import ProductDetails from "./pages/ProductDetails/ProductDetails";
import About from "./pages/About/About";
import Contacts from "./pages/Contacts/Contacts";
import Cart from "./pages/Cart/Cart";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Admin from "./pages/Admin/Admin";
import MyOrders from "./pages/MyOrders/MyOrders";
import Profile from './pages/Profile/Profile';

const HomePage = () => {
  return (
    <>
      <Header />
      <Hero />
      <Categories />
      <PopularProducts />
      <AboutBrand />
      <Benefits />
      <Reviews />
      <Newsletter />
      <Footer />
    </>
  );
};

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />

      <Route path="/catalog" element={<Catalog />} />

      <Route path="/products/:id" element={<ProductDetails />} />

      <Route path="/about" element={<About />} />

      <Route path="/contacts" element={<Contacts />} />

      <Route path="/cart" element={<Cart />} />

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      <Route path="/admin" element={<Admin />} />

      <Route path="/my-orders" element={<MyOrders />} />

      <Route path="/profile" element={<Profile />} />
    </Routes>
  );
};

export default App;