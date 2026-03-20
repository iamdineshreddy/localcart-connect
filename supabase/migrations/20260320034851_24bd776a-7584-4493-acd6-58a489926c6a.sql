
-- Create product reviews table
CREATE TABLE public.product_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  buyer_id uuid NOT NULL,
  buyer_name text NOT NULL DEFAULT '',
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(product_id, buyer_id)
);

ALTER TABLE public.product_reviews ENABLE ROW LEVEL SECURITY;

-- Anyone authenticated can read reviews
CREATE POLICY "Read reviews" ON public.product_reviews
  FOR SELECT TO authenticated USING (true);

-- Buyers can insert their own reviews
CREATE POLICY "Insert own review" ON public.product_reviews
  FOR INSERT TO authenticated WITH CHECK (buyer_id = auth.uid());

-- Buyers can update their own reviews
CREATE POLICY "Update own review" ON public.product_reviews
  FOR UPDATE TO authenticated USING (buyer_id = auth.uid());

-- After a review is inserted/updated, recalculate avg rating on products table
CREATE OR REPLACE FUNCTION public.update_product_rating()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  _avg numeric;
  _count integer;
  _product_id uuid;
BEGIN
  _product_id := COALESCE(NEW.product_id, OLD.product_id);
  
  SELECT COALESCE(AVG(rating), 0), COUNT(*) 
  INTO _avg, _count
  FROM product_reviews WHERE product_id = _product_id;
  
  UPDATE products 
  SET rating = ROUND(_avg, 1), review_count = _count, updated_at = now()
  WHERE id = _product_id;
  
  -- Also recalculate seller trust score
  PERFORM calculate_trust_score(
    (SELECT seller_id FROM products WHERE id = _product_id)
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

CREATE TRIGGER on_review_change
  AFTER INSERT OR UPDATE OR DELETE ON public.product_reviews
  FOR EACH ROW EXECUTE FUNCTION public.update_product_rating();
