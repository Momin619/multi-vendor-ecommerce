import { z } from "zod";

export const productSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Product name must contain at least 2 characters")
    .max(150, "Product name cannot exceed 150 characters"),

  description: z
    .string()
    .trim()
    .max(2000, "Description cannot exceed 2000 characters")
    .optional(),

  price: z
    .number()
    .min(0, "Price cannot be negative"),

  stock: z
    .number()
    .int("Stock must be a whole number")
    .min(0, "Stock cannot be negative"),

  category: z
    .string()
    .trim()
    .min(2, "Category must contain at least 2 characters")
    .max(100, "Category cannot exceed 100 characters"),

  imageUrl: z
    .string()
    .url("Image URL must be valid")
    .optional(),
});

export const productIdSchema = z.object({
  id: z.uuid("Invalid product ID"),
});

export const updateProductSchema = productSchema.partial();

export type CreateProductInput =
  z.infer<typeof productSchema>;

export type UpdateProductInput =
  z.infer<typeof updateProductSchema>;