import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

import Button from "../ui/Button";
import Input from "../ui/Input";
import LoadingSpinner from "../ui/LoadingSpinner";

import { getErrorMessage } from "../../api/error.utils";
import { useRedirect } from "../../hooks/useRedirect";
import TextArea from "../ui/TextArea.tsx";
import {
  createProduct,
  updateProduct,
} from "../../api/product.api";

import type {
  CreateProductInput,
  Product,
} from "../../types/products.types.ts";

interface ProductFormProps {
  product?: Product;
}

const ProductForm = ({
  product,
}: ProductFormProps) => {
  const { redirectTo } = useRedirect();

  const isEditMode = Boolean(product);

  const {
    register,
    handleSubmit,
    setError,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<CreateProductInput>({
    defaultValues: {
      name: product?.name ?? "",
      description: product?.description ?? "",
      price: product?.price ?? undefined,
      stock: product?.stock ?? undefined,
      category: product?.category ?? "",
      imageUrl: product?.imageUrl ?? "",
    },
  });

  const onSubmit = async (
    data: CreateProductInput,
  ) => {
    try {
      if (isEditMode && product) {
        await updateProduct(product.id, data);

        toast.success(
          "Product updated successfully.",
        );
      } else {
        await createProduct(data);

        toast.success(
          "Product created successfully.",
        );
      }

      redirectTo("/seller/products", true);
    } catch (error) {
      

      toast.error(
        getErrorMessage(error),
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5"
    >
      <Input
        id="name"
        label="Product Name"
        type="text"
        placeholder="Enter product name"
        {...register("name", {
          required: "Product name is required",

          minLength: {
            value: 2,
            message:
              "Product name must contain at least 2 characters",
          },

          maxLength: {
            value: 150,
            message:
              "Product name cannot exceed 150 characters",
          },
        })}
        error={errors.name?.message}
      />
<TextArea
  id="description"
  label="Description"
  rows={4}
  placeholder="Enter product description"
  {...register("description", {
    maxLength: {
      value: 2000,
      message: "Description cannot exceed 2000 characters",
    },
  })}
  error={errors.description?.message}
/>
     

      <Input
        id="price"
        label="Price"
        type="number"
        step="0.01"
        placeholder="0.00"
        {...register("price", {
          required: "Price is required",

          valueAsNumber: true,

          min: {
            value: 0,
            message: "Price cannot be negative",
          },

          validate: (value) =>
            !Number.isNaN(value) ||
            "Price must be a valid number",
        })}
        error={errors.price?.message}
      />

      <Input
        id="stock"
        label="Stock"
        type="number"
        placeholder="0"
        {...register("stock", {
          required: "Stock is required",

          valueAsNumber: true,

          min: {
            value: 0,
            message: "Stock cannot be negative",
          },

          validate: (value) =>
            Number.isInteger(value) ||
            "Stock must be a whole number",
        })}
        error={errors.stock?.message}
      />

      <Input
        id="category"
        label="Category"
        type="text"
        placeholder="Electronics"
        {...register("category", {
          required: "Category is required",

          minLength: {
            value: 2,
            message:
              "Category must contain at least 2 characters",
          },

          maxLength: {
            value: 100,
            message:
              "Category cannot exceed 100 characters",
          },
        })}
        error={errors.category?.message}
      />

      <Input
        id="imageUrl"
        label="Image URL"
        type="url"
        placeholder="https://example.com/image.jpg"
        {...register("imageUrl", {
          validate: (value) => {
            if (!value) return true;

            try {
              new URL(value);
              return true;
            } catch {
              return "Image URL must be valid";
            }
          },
        })}
        error={errors.imageUrl?.message}
      />

      {errors.root?.message && (
        <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {errors.root.message}
        </p>
      )}

     <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
  <Button
    type="submit"
    isLoading={isSubmitting}
  >
    {isEditMode ? "Update Product" : "Create Product"}
  </Button>
</div>

      {isSubmitting && (
        <LoadingSpinner />
      )}
    </form>
  );
};

export default ProductForm;