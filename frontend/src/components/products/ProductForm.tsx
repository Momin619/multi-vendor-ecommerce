import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { FiUploadCloud, FiX } from "react-icons/fi";

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

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

const ProductForm = ({
  product,
}: ProductFormProps) => {
  const { redirectTo } = useRedirect();

  const isEditMode = Boolean(product);

  // Holds the actual file object the user picked (react-hook-form
  // can't manage File objects the same way it manages text inputs).
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Shown in the UI. Starts as the product's existing image (edit mode)
  // or nothing (create mode). Replaced with a local preview once the
  // user picks a new file.
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    product?.imageUrl ?? null,
  );

  const [imageError, setImageError] = useState<string | null>(null);

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
    },
  });

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      setImageError("Only JPG, PNG, or WEBP images are allowed.");
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      setImageError("Image must be smaller than 5MB.");
      return;
    }

    setImageError(null);
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setImageError(null);
  };

  const onSubmit = async (data: CreateProductInput) => {
    if (!isEditMode && !selectedFile) {
      setImageError("Product image is required.");
      return;
    }

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("price", String(data.price));
    formData.append("stock", String(data.stock));
    formData.append("category", data.category);

   
      formData.append("description", data.description ?? "");
    

    if (selectedFile) {
      formData.append("image", selectedFile);
    }

    try {
      if (isEditMode && product) {
        await updateProduct(product.id, formData);

        toast.success("Product updated successfully.");
      } else {
        await createProduct(formData);

        toast.success("Product created successfully.");
      }

      redirectTo("/seller/products", true);
    } catch (error) {
      setError("root", {
        message: getErrorMessage(error),
      });

      toast.error(getErrorMessage(error));
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

      {/* Product image upload */}
      <div>
        <label className="mb-2 block text-sm font-medium text-ink">
          Product Image
        </label>

        {previewUrl ? (
          <div className="relative inline-block">
            <img
              src={previewUrl}
              alt="Product preview"
              className="h-40 w-40 rounded-md object-cover ring-1 ring-border"
            />

            <button
              type="button"
              onClick={handleRemoveImage}
              aria-label="Remove image"
              className="
                absolute
                -right-2
                -top-2
                flex
                h-7
                w-7
                items-center
                justify-center
                rounded-full
                bg-ink
                text-paper
                shadow
                transition
                hover:bg-danger
              "
            >
              <FiX className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <label
            htmlFor="image-upload"
            className="
              flex
              h-40
              w-full
              cursor-pointer
              flex-col
              items-center
              justify-center
              gap-2
              rounded-md
              border-2
              border-dashed
              border-border
              bg-paper
              text-ink-soft
              transition
              hover:border-accent
              hover:bg-accent-soft
              hover:text-accent-ink
              sm:w-64
            "
          >
            <FiUploadCloud className="h-6 w-6" />
            <span className="text-sm font-medium">
              Click to upload an image
            </span>
            <span className="text-xs text-ink-soft">
              JPG, PNG, or WEBP — up to 5MB
            </span>

            <input
              id="image-upload"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
        )}

        {imageError && (
          <p className="mt-2 text-sm text-danger">
            {imageError}
          </p>
        )}
      </div>

      {errors.root?.message && (
        <p className="rounded-md bg-danger-soft p-3 text-sm text-danger">
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

  
    </form>
  );
};

export default ProductForm;