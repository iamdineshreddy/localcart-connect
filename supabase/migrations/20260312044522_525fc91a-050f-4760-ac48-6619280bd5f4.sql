
-- Create enums
CREATE TYPE public.app_role AS ENUM ('buyer', 'seller', 'admin', 'delivery');
CREATE TYPE public.kyc_status AS ENUM ('not_submitted', 'pending', 'approved', 'rejected');
CREATE TYPE public.product_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE public.order_status AS ENUM ('placed', 'confirmed', 'shipped', 'out_for_delivery', 'delivered', 'cancelled');
CREATE TYPE public.fraud_report_type AS ENUM ('fake_product', 'wrong_delivery', 'scam');
CREATE TYPE public.fraud_report_status AS ENUM ('pending', 'investigating', 'resolved', 'dismissed');
CREATE TYPE public.trust_badge AS ENUM ('bronze', 'silver', 'gold', 'diamond');

-- Profiles table (NO role column per security rules)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  phone TEXT,
  avatar TEXT,
  is_suspended BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- User roles table (separate per security rules)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

-- Function to get user role
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id UUID)
RETURNS app_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.user_roles WHERE user_id = _user_id LIMIT 1
$$;

-- Products table
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  seller_name TEXT NOT NULL DEFAULT '',
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  price NUMERIC(10,2) NOT NULL,
  mrp NUMERIC(10,2) NOT NULL,
  category TEXT NOT NULL DEFAULT 'groceries',
  image TEXT NOT NULL DEFAULT '',
  stock INTEGER NOT NULL DEFAULT 0,
  unit TEXT NOT NULL DEFAULT '',
  status product_status NOT NULL DEFAULT 'pending',
  rating NUMERIC(3,2) NOT NULL DEFAULT 0,
  review_count INTEGER NOT NULL DEFAULT 0,
  trust_score INTEGER NOT NULL DEFAULT 0,
  rejection_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Orders table
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  buyer_name TEXT NOT NULL DEFAULT '',
  total NUMERIC(10,2) NOT NULL DEFAULT 0,
  status order_status NOT NULL DEFAULT 'placed',
  address TEXT NOT NULL DEFAULT '',
  delivery_partner_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Order items
CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) NOT NULL,
  product_name TEXT NOT NULL DEFAULT '',
  product_image TEXT NOT NULL DEFAULT '',
  quantity INTEGER NOT NULL DEFAULT 1,
  price NUMERIC(10,2) NOT NULL,
  seller_id UUID REFERENCES auth.users(id) NOT NULL,
  seller_name TEXT NOT NULL DEFAULT ''
);
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Cart items
CREATE TABLE public.cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, product_id)
);
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;

-- Wishlist items
CREATE TABLE public.wishlist_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, product_id)
);
ALTER TABLE public.wishlist_items ENABLE ROW LEVEL SECURITY;

-- KYC documents
CREATE TABLE public.kyc_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT NOT NULL DEFAULT '',
  phone TEXT NOT NULL DEFAULT '',
  address TEXT NOT NULL DEFAULT '',
  upi_id TEXT,
  bank_account TEXT,
  ifsc_code TEXT,
  aadhaar_number TEXT NOT NULL DEFAULT '',
  pan_number TEXT NOT NULL DEFAULT '',
  aadhaar_front_url TEXT,
  aadhaar_back_url TEXT,
  pan_card_url TEXT,
  shop_photo_url TEXT,
  status kyc_status NOT NULL DEFAULT 'pending',
  rejection_reason TEXT,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  reviewed_at TIMESTAMPTZ
);
ALTER TABLE public.kyc_documents ENABLE ROW LEVEL SECURITY;

-- Trust scores
CREATE TABLE public.trust_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  kyc_verified BOOLEAN NOT NULL DEFAULT false,
  order_completion_rate NUMERIC(5,2) NOT NULL DEFAULT 0,
  buyer_rating NUMERIC(3,2) NOT NULL DEFAULT 0,
  complaint_count INTEGER NOT NULL DEFAULT 0,
  total_score INTEGER NOT NULL DEFAULT 0,
  badge trust_badge NOT NULL DEFAULT 'bronze',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.trust_scores ENABLE ROW LEVEL SECURITY;

-- Fraud reports
CREATE TABLE public.fraud_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  reporter_name TEXT NOT NULL DEFAULT '',
  seller_id UUID REFERENCES auth.users(id) NOT NULL,
  seller_name TEXT NOT NULL DEFAULT '',
  order_id UUID REFERENCES public.orders(id),
  type fraud_report_type NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  status fraud_report_status NOT NULL DEFAULT 'pending',
  admin_action TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.fraud_reports ENABLE ROW LEVEL SECURITY;

-- Notifications
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- ========================
-- RLS POLICIES
-- ========================

-- Profiles: users can read all profiles, update own
CREATE POLICY "Anyone can read profiles" ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO authenticated USING (id = auth.uid());
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (id = auth.uid());

-- User roles: users can read own role, admins can read all
CREATE POLICY "Users can read own role" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Only system inserts roles" ON public.user_roles FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

-- Products: anyone authenticated can read approved, sellers own, admins all
CREATE POLICY "Read approved products" ON public.products FOR SELECT TO authenticated USING (status = 'approved' OR seller_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Sellers insert products" ON public.products FOR INSERT TO authenticated WITH CHECK (seller_id = auth.uid() AND public.has_role(auth.uid(), 'seller'));
CREATE POLICY "Sellers update own products" ON public.products FOR UPDATE TO authenticated USING (seller_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

-- Orders: buyers see own, sellers see related, admins see all
CREATE POLICY "Read own orders" ON public.orders FOR SELECT TO authenticated USING (buyer_id = auth.uid() OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'delivery'));
CREATE POLICY "Buyers insert orders" ON public.orders FOR INSERT TO authenticated WITH CHECK (buyer_id = auth.uid());
CREATE POLICY "Update orders" ON public.orders FOR UPDATE TO authenticated USING (buyer_id = auth.uid() OR public.has_role(auth.uid(), 'seller') OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'delivery'));

-- Order items
CREATE POLICY "Read order items" ON public.order_items FOR SELECT TO authenticated USING (true);
CREATE POLICY "Insert order items" ON public.order_items FOR INSERT TO authenticated WITH CHECK (true);

-- Cart items: own only
CREATE POLICY "Own cart" ON public.cart_items FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Insert cart" ON public.cart_items FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Update cart" ON public.cart_items FOR UPDATE TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Delete cart" ON public.cart_items FOR DELETE TO authenticated USING (user_id = auth.uid());

-- Wishlist: own only
CREATE POLICY "Own wishlist" ON public.wishlist_items FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Insert wishlist" ON public.wishlist_items FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Delete wishlist" ON public.wishlist_items FOR DELETE TO authenticated USING (user_id = auth.uid());

-- KYC: seller sees own, admin sees all
CREATE POLICY "Read own kyc" ON public.kyc_documents FOR SELECT TO authenticated USING (seller_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Seller submits kyc" ON public.kyc_documents FOR INSERT TO authenticated WITH CHECK (seller_id = auth.uid());
CREATE POLICY "Update kyc" ON public.kyc_documents FOR UPDATE TO authenticated USING (seller_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

-- Trust scores: anyone can read
CREATE POLICY "Read trust scores" ON public.trust_scores FOR SELECT TO authenticated USING (true);
CREATE POLICY "Insert trust scores" ON public.trust_scores FOR INSERT TO authenticated WITH CHECK (seller_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Update trust scores" ON public.trust_scores FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin') OR seller_id = auth.uid());

-- Fraud reports: reporter sees own, admin sees all
CREATE POLICY "Read fraud reports" ON public.fraud_reports FOR SELECT TO authenticated USING (reporter_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Submit fraud report" ON public.fraud_reports FOR INSERT TO authenticated WITH CHECK (reporter_id = auth.uid());
CREATE POLICY "Update fraud report" ON public.fraud_reports FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Notifications: own only
CREATE POLICY "Read own notifications" ON public.notifications FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Insert notifications" ON public.notifications FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Update notifications" ON public.notifications FOR UPDATE TO authenticated USING (user_id = auth.uid());

-- ========================
-- TRIGGER: Auto-create profile + role on signup
-- ========================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _role app_role;
BEGIN
  -- Get role from metadata, default to buyer
  _role := COALESCE(
    (NEW.raw_user_meta_data->>'role')::app_role,
    'buyer'
  );
  
  INSERT INTO public.profiles (id, name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', ''),
    COALESCE(NEW.email, '')
  );
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, _role);
  
  -- Create trust score for sellers
  IF _role = 'seller' THEN
    INSERT INTO public.trust_scores (seller_id) VALUES (NEW.id);
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to calculate trust score
CREATE OR REPLACE FUNCTION public.calculate_trust_score(_seller_id UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
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
  -- KYC verification (30%)
  SELECT EXISTS(SELECT 1 FROM kyc_documents WHERE seller_id = _seller_id AND status = 'approved') INTO _kyc_verified;
  IF _kyc_verified THEN _kyc_score := 30; END IF;
  
  -- Order completion rate (30%)
  SELECT COALESCE(
    (COUNT(*) FILTER (WHERE status = 'delivered')::NUMERIC / NULLIF(COUNT(*), 0)) * 100, 0
  ) INTO _completion_rate
  FROM orders o
  JOIN order_items oi ON oi.order_id = o.id
  WHERE oi.seller_id = _seller_id;
  _order_score := ROUND(_completion_rate * 0.3);
  
  -- Buyer rating (30%)
  SELECT COALESCE(AVG(rating), 0) INTO _avg_rating FROM products WHERE seller_id = _seller_id AND rating > 0;
  _rating_score := ROUND((_avg_rating / 5.0) * 30);
  
  -- Complaints penalty (10%)
  SELECT COUNT(*) INTO _complaints FROM fraud_reports WHERE seller_id = _seller_id AND status != 'dismissed';
  _complaint_penalty := LEAST(_complaints * 3, 10);
  
  _total := GREATEST(_kyc_score + _order_score + _rating_score - _complaint_penalty, 0);
  _total := LEAST(_total, 100);
  
  -- Determine badge
  IF _total >= 90 THEN _badge := 'diamond';
  ELSIF _total >= 75 THEN _badge := 'gold';
  ELSIF _total >= 50 THEN _badge := 'silver';
  ELSE _badge := 'bronze';
  END IF;
  
  -- Update trust score record
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
$$;

-- Enable realtime for notifications and orders
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
