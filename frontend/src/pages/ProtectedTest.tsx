import { useState } from "react";
import { getMyProducts } from "../api/product.api";

const ProtectedTest = () => {
  const [message, setMessage] = useState("");

  const handleRequest = async () => {
    try {
      const response = await getMyProducts();

      setMessage(response.message);
    } catch (error) {
      console.error(error);
      setMessage("Request failed");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">
        Protected Request Test
      </h1>

      <button
        onClick={handleRequest}
        className="mt-4 rounded bg-blue-600 px-4 py-2 text-white"
      >
        Make Protected Request
      </button>

      {message && (
        <p className="mt-4">
          {message}
        </p>
      )}
    </div>
  );
};

export default ProtectedTest;