
CREATE OR REPLACE FUNCTION public.recalculate_seller_trust_on_order()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  _seller_id uuid;
BEGIN
  -- Recalculate trust scores for all sellers involved in this order
  FOR _seller_id IN
    SELECT DISTINCT oi.seller_id
    FROM order_items oi
    WHERE oi.order_id = NEW.id
  LOOP
    PERFORM calculate_trust_score(_seller_id);
  END LOOP;
  
  RETURN NEW;
END;
$function$;

CREATE TRIGGER recalculate_trust_on_order_update
  AFTER UPDATE OF status ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.recalculate_seller_trust_on_order();
