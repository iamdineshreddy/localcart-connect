
-- Allow sellers to read orders that contain their products (via order_items)
CREATE POLICY "Sellers read orders with their items"
ON public.orders
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.order_items
    WHERE order_items.order_id = orders.id
    AND order_items.seller_id = auth.uid()
  )
);

-- Create a function to decrement stock after order placement
CREATE OR REPLACE FUNCTION public.decrement_stock(_product_id uuid, _quantity integer)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  UPDATE products
  SET stock = GREATEST(stock - _quantity, 0),
      updated_at = now()
  WHERE id = _product_id;
END;
$$;
