import React, { useEffect, useState } from "react";
import { AiFillStar } from "react-icons/ai";
import { useParams, useNavigate } from "react-router";
import { data } from "../../data";

const Product = () => {
  const params = useParams();
  const [product, setProduct] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handlerent = () => {
    if (product) {
      navigate(`/profile/rentnow?k=${product.name}`); // Navigate to RentNow component with product name parameter
    } else {
      console.error('Product is undefined');
    }
  };

  useEffect(() => {
    window.scroll(0, 0);
  }, []);

  useEffect(() => {
    console.log('Params:', params.name);
    const e = data.filter((e) => e.name === params.name);
    console.log('Filtered Data:', e);
    if (e.length > 0) {
      setProduct(e[0]);
    } else {
      setError("Product not found");
    }
    setLoading(false);
  }, [params.name]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="md:w-9/12 mx-auto py-20">
      <div className="md:flex md:border rounded-md p-6">
        <div className="flex flex-col md:w-1/2">
          <div className="flex flex-row gap-6">
            <img
              src={product?.url}
              className="w-full h-full object-cover object-center mr-4 rounded-xl"
              alt={product?.name}
            />
          </div>
        </div>
        <div className="flex flex-col gap-4 md:w-1/2">
          <p className="text-xl font-semibold">{product?.name}</p>
          <span className="flex bg-[#fcf403] w-min px-2 rounded-md">
            {Math.floor(Math.random() * (5 - 2 + 1)) + 2}{" "}
            <AiFillStar className="mt-1" />
          </span>
          <p className="text-base">{product?.description}</p>
          <p className="text-lg font-bold">
            Rs. {product?.price}{" "}
            <span className="line-through text-gray-dark">
              {product?.price * 1.25}
            </span>
          </p>
          <div className="flex gap-6 text-base whitespace-nowrap md:text-lg">
            <button onClick={handlerent} className="py-2 px-4 bg-green-500 text-white rounded-md">
              Rent
            </button>
            <button className="py-2 px-4 bg-gray-300 rounded-md">Add to Rentlist</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;