import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { initializeApp, getApps } from "firebase/app";
import { getDatabase, ref, set } from "firebase/database";
var productName;
// Firebase configuration
const firebaseConfig = {
  databaseURL: "https://hireharvest-default-rtdb.firebaseio.com/",
  apiKey: "AIzaSyBnTqP_TpVQJEaTwkZPPk4nRuQuiGYChn8",
  authDomain: "hireharvest.firebaseapp.com",
  projectId: "hireharvest",
  storageBucket: "hireharvest.appspot.com",
  messagingSenderId: "1095355415030",
  appId: "1:1095355415030:web:763fd3668fc06ac027efd7",
  measurementId: "G-EPR14D8SSD"
};

// Initialize Firebase if it hasn't been initialized already
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

const db = getDatabase(app);

const RentNow = () => {
  const [searchParams] = useSearchParams();
  const [productDetails, setProductDetails] = useState({
    name: "",
    address: "",
    email: "",
    phone: "",
    productName: "",
  });

  useEffect(() => {
     productName = searchParams.get('k');
    console.log("Product Name from URL:", productName); // Log the product name
    if (productName) {
      setProductDetails(prevDetails => ({
        ...prevDetails,
        productName: productName
      }));
    }
  }, [searchParams]);

  const handleSubmit = () => {
    const newRef = ref(db, 'rent/' + productDetails.email.split('@')[0]);
    set(newRef, productDetails)
      .then(() => {
        alert('Details submitted successfully!');
        // Clear the form after submission
        setProductDetails({
          name: "",
          address: "",
          email: "",
          phone: "",
          productName: "",
        });
      })
      .catch((error) => {
        console.error('Error writing to database: ', error);
      });
  };

  return (
    <div className="pt-16">
      <div className="my-2">
        <h1 className="font-semibold text-2xl text-dark-green text-center">
          Provide your details for {productDetails.productName}
        </h1>
        <div className="bg-white border border-green w-1/4 m-auto rounded-xl p-2 mt-20 flex-col flex items-center">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR8TooAFSc9BmItp4K8LDt5TXM3Znf1-4G2iw7Xmj_KcQ&usqp=CAU&ec=48600112"
            alt=""
            className="w-5/12 border border-green rounded-full -mt-20"
          />
          <input
            type="text"
            value={productDetails.name}
            onChange={(e) => {
              setProductDetails({ ...productDetails, name: e.target.value });
            }}
            placeholder="Enter your name"
            className="my-2 w-11/12 outline-none border border-gray-light rounded-md block px-2 py-0.5 m-auto"
          />
          <input
            type="email"
            placeholder="Enter your email"
            value={productDetails.email}
            onChange={(e) => {
              setProductDetails({ ...productDetails, email: e.target.value });
            }}
            className="my-2 w-11/12 outline-none border border-gray-light rounded-md block px-2 py-0.5 m-auto"
          />
          <input
            type="number"
            placeholder="Enter your number"
            value={productDetails.phone}
            onChange={(e) => {
              setProductDetails({ ...productDetails, phone: e.target.value });
            }}
            className="my-2 w-11/12 outline-none border border-gray-light rounded-md block px-2 py-0.5 m-auto"
          />
          <input
            type="text"
            placeholder="Enter your address"
            value={productDetails.address}
            onChange={(e) => {
              setProductDetails({ ...productDetails, address: e.target.value });
            }}
            className="my-2 w-11/12 outline-none border border-gray-light rounded-md block px-2 py-0.5 m-auto"
          />
          <input
            type="hidden"
            value={productDetails.productName}
          />
          <button className="transition-all m-auto" onClick={handleSubmit}>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default RentNow;