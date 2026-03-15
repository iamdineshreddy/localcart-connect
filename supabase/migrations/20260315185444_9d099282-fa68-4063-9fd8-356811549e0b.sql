CREATE OR REPLACE FUNCTION public.calculate_trust_score(_seller_id uuid)
 RETURNS integer
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  _kyc_score INTEGER := 0;
  _order_score INTEGER := 0;
  _rating_score INTEGER := 0;
  _complaint_penalty INTEGER := 0;
  _total INTEGER;
  _badge trust_badge;
  _kyc_verified BOOLEAN;
  _completion_rate NUMERIC;
  _avg_rating NUMERIC;
  _complaints INTEGER;
BEGIN
  -- KYC & License verification (40%)
  SELECT EXISTS(SELECT 1 FROM kyc_documents WHERE seller_id = _seller_id AND status = 'approved') INTO _kyc_verified;
  IF _kyc_verified THEN _kyc_score := 40; END IF;
  
  -- Order completion/delivery rate (30%)
  SELECT COALESCE(
    (COUNT(*) FILTER (WHERE status = 'delivered')::NUMERIC / NULLIF(COUNT(*), 0)) * 100, 0
  ) INTO _completion_rate
  FROM orders o
  JOIN order_items oi ON oi.order_id = o.id
  WHERE oi.seller_id = _seller_id;
  _order_score := ROUND(_completion_rate * 0.3);
  
  -- Buyer rating & reviews (30%)
  SELECT COALESCE(AVG(rating), 0) INTO _avg_rating FROM products WHERE seller_id = _seller_id AND rating > 0;
  _rating_score := ROUND((_avg_rating / 5.0) * 30);
  
  -- Complaints penalty
  SELECT COUNT(*) INTO _complaints FROM fraud_reports WHERE seller_id = _seller_id AND status != 'dismissed';
  _complaint_penalty := LEAST(_complaints * 3, 10);
  
  _total := GREATEST(_kyc_score + _order_score + _rating_score - _complaint_penalty, 0);
  _total := LEAST(_total, 100);
  
  IF _total >= 90 THEN _badge := 'diamond';
  ELSIF _total >= 75 THEN _badge := 'gold';
  ELSIF _total >= 50 THEN _badge := 'silver';
  ELSE _badge := 'bronze';
  END IF;
  
  UPDATE trust_scores SET 
    kyc_verified = _kyc_verified,
    order_completion_rate = _completion_rate,
    buyer_rating = _avg_rating,
    complaint_count = _complaints,
    total_score = _total,
    badge = _badge,
    updated_at = now()
  WHERE seller_id = _seller_id;
  
  RETURN _total;
END;
$function$;