import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, LogOut, UserRound, ShoppingCart, ChevronDown, Eye } from 'lucide-react'; // Import Eye icon
import axios from 'axios';
import { useSelector } from 'react-redux';
import logo from "../../assets/logo.png";

const Navbar = ({ likedCount }) => {
  const [User, setUser] = useState([]);
  const userId = localStorage.getItem('userId');
  const navigate = useNavigate();
  const cartCount = useSelector(state => state.cart.cartItems.filter(cartItem => cartItem.userId === userId).reduce((total, item) => total + item.quantity, 0));

  const callUserDashboard = async () => {
    try {
      const res = await fetch('http://localhost:3000/auth/UsersRestaurant', {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        credentials: "include"
      });

      if (res.status !== 200) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }

      const textData = await res.text();
      console.log("Response text:", textData);

      if (!textData) {
        throw new Error("No data received");
      }

      try {
        const data = JSON.parse(textData);
        console.log(data);
        localStorage.setItem('userId', data._id);
        console.log(data._id);
        setUser(data);
      } catch (jsonError) {
        console.error("Failed to parse JSON:", jsonError);
        navigate('/UserLogin');
      }
    } catch (err) {
      console.log(err);
      navigate('/UserLogin');
    }
  };

  useEffect(() => {
    callUserDashboard();
  }, []);

  const handleLogout = () => {
    axios.get('http://localhost:3000/auth/UserLogout')
      .then(res => {
        if (res.data.status) {
          localStorage.removeItem("userId");
          navigate('/UserLogin');
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  return (
    <nav className="bg-white shadow-md h-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex justify-between items-center h-full">
          {/* Left side - Title */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/UsersRestaurant" className="flex items-center">
              <div className="flex justify-center items-center ml-12">
                <img src={logo} alt="Logo" className="h-10 w-10 mr-3" />
                <h1 className="font-poppins md:text-3xl font-extrabold tracking-wide flex">
                  <span className="text-green-600">Green</span>
                  <span className="text-black">Bin</span>
                </h1>
              </div>
            </Link>
          </div>

          {/* Center - Navigation Links */}
          {/* ... (your center navigation links code here) */}

          {/* Right side - Search, Cart, Likes, Profile */}
          <div className="hidden md:block mr-8">
            <div className="ml-4 flex items-center md:ml-6">
              <Link to="/UsersCart">
                <button className="ml-3 p-1 relative">
                  <ShoppingCart className="h-6 w-6" />
                  {cartCount > 0 && (
                    <span className="absolute -top-3 -right-2 bg-red-400 text-white rounded-full px-2 text-sm font-bold">
                      {cartCount}
                    </span>
                  )}
                </button>
              </Link>

              {/* Self-awareness button */}
              <Link to="/Usersawareness">
              <button className="ml-3 p-1 flex items-center bg-green-500 text-white rounded-full hover:bg-green-600 transition duration-200">
                <Eye className="h-6 w-6" />
              </button>
</Link>
              <div className="relative group flex items-center">
                <button className="ml-3 p-1 flex items-center">
                  <UserRound className="h-6 w-6" />
                  <ChevronDown className="h-4 w-4 ml-1" />
                </button>
                <span className="inline-block ml-4 text-gray-700 font-semibold text-lg bg-white p-2 rounded shadow">{User.ownerName}</span>
                <div className="absolute left-0 mt-32 w-48 bg-white rounded-md shadow-lg py-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <Link to="/UsersOrders" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <ShoppingBag className="mr-2" />My orders
                  </Link>
                  <button 
                    onClick={handleLogout} 
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  >
                    <LogOut className="mr-2" />Log out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
