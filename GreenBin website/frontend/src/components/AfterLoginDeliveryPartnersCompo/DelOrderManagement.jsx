import React, { useEffect, useState } from 'react';
import { Grid, Typography, Modal, Box, Button, Card, CardContent } from '@mui/material';
 // Ensure the path is correct
import axios from 'axios';
import { RxCross2 } from "react-icons/rx";

const DelOrderManagement = () => {

  const [orders, setOrders] = useState([]);

  const getOrders = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/order/getAllOrders`,
        {
          withCredentials: true,
        }
      );
      console.log(response.data);
      setOrders(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getOrders();
  }, []);



  const handleAccept = async (orderId) => {
    try {

      const response = await axios.put(`http://localhost:3000/api/order/assignDeliveryMan/${orderId}`, {
        withCredentials: true,
      });
      if (response.status !== 200) {
        throw new Error(`HTTP error! Status: ${response.status}`);

      }
      getOrders();
    } catch (error) {
      console.log(error);
    }

  };





  return (
    <div  className='bg-gray-100 ml-60 mt-[78px] min-h-screen pt-4 w-full font-poppins'>
      <div className=' flex justify-center items-center font-semibold text-lg'>
        Your Orders        
      </div>
      {
        orders?.map((order) => (


          <div className='flex flex-col bg-white shadow-md rounded-md font-poppins mx-8 my-6 pt-4'>

            <div className=' flex justify-center items-center font-semibold text-lg'>
              ID : {order?.paymentId?.orderId}
              {/* //Change this to payment order id */}
            </div>

            <div className='flex justify-between px-4 '>

              {/* //Customer details */}
              <div className='flex flex-col m-4 p-2 gap-y-3'>
                <div>
                  Customer's Name : {order?.user?.ownerName}
                </div>
                <div>
                  Customer's Phone : {order?.user?.phone}
                </div>
                <div className=' flex  items-center'>
                  <p>Customer's Address : </p>
                  {<p className=" p-3 text-wrap ">
                    {order?.deliveryAddress?.address}, {order?.deliveryAddress?.city}, {order?.deliveryAddress?.state},{order?.deliveryAddress?.country}
                  </p>}
                </div>
              </div>

              {/* //Restaurant details */}
              <div className='flex flex-col m-4 p-2 gap-y-3'>
                <div>
                EcoArtisans Hub Name : {order?.restaurant?.restaurantName}
                </div>
                <div>
                EcoArtisans Hub Phone : {order?.restaurant?.phone}
                </div>
                <div className=' flex  items-center'>
                  <p>EcoArtisans Hub Address : </p>
                  {<p className=" p-3 text-wrap ">
                    {order?.restaurant?.address}, {order?.restaurant?.city}, {order?.restaurant?.stateName},{order?.restaurant?.countryName}
                  </p>}
                </div>
              </div>

              {/* //Order details */}
              <div className='flex flex-col justify-between  m-4 p-2 '>
                {
                  order?.orderItems?.map((item) => (
                    <>
                      <div className='flex justify-between w-60 px-2'>
                        <span className='flex gap-x-1 items-center '>
                          {item?.quantity}
                          <RxCross2 size={14} />
                          {item?.item?.dishName}
                        </span>

                      </div>
                    </>
                  ))
                }

                <div>
                  <button className='bg-green-500 text-white rounded-md p-2 mb-2' onClick={() => handleAccept(order._id)}>Accept Order</button>
                </div>

              </div>


            </div>

          </div>


        )
        )
      }
    </div>
  );
};

export default DelOrderManagement;