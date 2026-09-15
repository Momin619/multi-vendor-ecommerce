import ProductList from "../../components/products/ProductList";

const SellerProducts = () => {
  return (
    <div className="min-h-screen bg-paper px-3 py-4 sm:px-6 sm:py-6">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-6">
          <h1 className="font-display text-2xl font-semibold text-ink sm:text-3xl">
            My Products
          </h1>

          <p className="mt-1 text-sm text-ink-soft sm:text-base">
            Manage your products.
          </p>
        </div>

        <ProductList />
      </div>
    </div>
  );
};

export default SellerProducts;