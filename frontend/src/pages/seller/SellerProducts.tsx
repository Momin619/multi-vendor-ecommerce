import ProductList from "../../components/products/ProductList";

const SellerProducts = () => {
  return (
    <div className="min-h-screen bg-gray-100 px-3 py-4 sm:px-6 sm:py-6">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            My Products
          </h1>

          <p className="mt-1 text-sm text-gray-500 sm:text-base">
            Manage your products.
          </p>
        </div>

        <ProductList />
      </div>
    </div>
  );
};

export default SellerProducts;