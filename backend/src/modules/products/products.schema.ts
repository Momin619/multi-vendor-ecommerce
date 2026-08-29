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

  price: z.coerce
    .number()
    .min(0, "Price cannot be negative"),

  stock: z.coerce
    .number()
    .int("Stock must be a whole number")
    .min(0, "Stock cannot be negative"),

  category: z
    .string()
    .trim()
    .min(2, "Category must contain at least 2 characters")
    .max(100, "Category cannot exceed 100 characters"),
});

export const productIdSchema = z.object({
  id: z.uuid("Invalid product ID"),
});

export const productsPaginationSchema = z.object({
  limit: z.coerce
    .number()
    .int()
    .positive()
    .default(20)
    .transform((value) => Math.min(value, 100)),

  cursor: z.string().optional(),
});

export const productCursorSchema = z.object({
  createdAt: z.string().datetime(),
  id: z.string().uuid(),
});

export const updateProductSchema = productSchema.partial();

export type CreateProductInput =
  z.infer<typeof productSchema>;

export type UpdateProductInput =
  z.infer<typeof updateProductSchema>;