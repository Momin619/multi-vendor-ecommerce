import ProductForm from "../../components/products/ProductForm";

const CreateProduct = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
      <div className="mx-auto max-w-2xl">
        <div className="rounded-xl bg-white p-5 shadow sm:p-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Create Product
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Add a new product to your store.
          </p>

          <div className="mt-6">
            <ProductForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateProduct;