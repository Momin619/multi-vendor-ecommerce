import ProductForm from "../../components/products/ProductForm";

const CreateProduct = () => {
  return (
    <div className="min-h-screen bg-paper p-4 sm:p-6">
      <div className="mx-auto max-w-2xl">
        <div className="rounded-md border border-border bg-surface p-5 sm:p-8">
          <h1 className="font-display text-2xl font-semibold text-ink">
            Create Product
          </h1>

          <p className="mt-2 text-sm text-ink-soft">
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