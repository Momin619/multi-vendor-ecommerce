CREATE INDEX idx_products_seller_created_id
ON products (seller_id, created_at DESC, id DESC);