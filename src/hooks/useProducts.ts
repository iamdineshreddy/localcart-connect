import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Product {
  id: string;
  seller_id: string;
  seller_name: string;
  name: string;
  description: string;
  price: number;
  mrp: number;
  category: string;
  image: string;
  stock: number;
  unit: string;
  status: 'pending' | 'approved' | 'rejected';
  rating: number;
  review_count: number;
  trust_score: number;
  rejection_reason?: string;
  created_at: string;
}

export function useProducts(filters?: { status?: string; sellerId?: string; category?: string }) {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: async () => {
      let query = supabase.from('products').select('*').order('created_at', { ascending: false });
      if (filters?.status) query = query.eq('status', filters.status as any);
      if (filters?.sellerId) query = query.eq('seller_id', filters.sellerId);
      if (filters?.category) query = query.eq('category', filters.category);
      const { data, error } = await query;
      if (error) throw error;
      return (data || []) as unknown as Product[];
    },
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const { data, error } = await supabase.from('products').select('*').eq('id', id).single();
      if (error) throw error;
      return data as Product;
    },
    enabled: !!id,
  });
}

export function useAddProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (product: Omit<Product, 'id' | 'created_at' | 'status' | 'rating' | 'review_count'>) => {
      const { data, error } = await supabase.from('products').insert({
        seller_id: product.seller_id,
        seller_name: product.seller_name,
        name: product.name,
        description: product.description,
        price: product.price,
        mrp: product.mrp,
        category: product.category,
        image: product.image,
        stock: product.stock,
        unit: product.unit,
        trust_score: product.trust_score,
      }).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['products'] });
      toast.success('Product added! Awaiting admin approval.');
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useUpdateProductStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status, rejection_reason }: { id: string; status: string; rejection_reason?: string }) => {
      const { error } = await supabase.from('products').update({ 
        status, 
        rejection_reason,
        updated_at: new Date().toISOString() 
      }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['products'] }),
  });
}
