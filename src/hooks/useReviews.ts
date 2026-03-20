import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface ProductReview {
  id: string;
  product_id: string;
  buyer_id: string;
  buyer_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

export function useProductReviews(productId: string) {
  return useQuery({
    queryKey: ['reviews', productId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('product_reviews')
        .select('*')
        .eq('product_id', productId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data || []) as ProductReview[];
    },
    enabled: !!productId,
  });
}

export function useMyReview(productId: string) {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['my-review', productId, user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from('product_reviews')
        .select('*')
        .eq('product_id', productId)
        .eq('buyer_id', user.id)
        .maybeSingle();
      if (error) throw error;
      return data as ProductReview | null;
    },
    enabled: !!productId && !!user?.id,
  });
}

export function useSubmitReview() {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async ({ productId, rating, comment }: { productId: string; rating: number; comment: string }) => {
      if (!user) throw new Error('Not authenticated');
      const { error } = await supabase
        .from('product_reviews')
        .upsert({
          product_id: productId,
          buyer_id: user.id,
          buyer_name: user.name || user.email || '',
          rating,
          comment,
        }, { onConflict: 'product_id,buyer_id' });
      if (error) throw error;
    },
    onSuccess: (_, vars) => {
      toast.success('Review submitted!');
      qc.invalidateQueries({ queryKey: ['reviews', vars.productId] });
      qc.invalidateQueries({ queryKey: ['my-review', vars.productId] });
      qc.invalidateQueries({ queryKey: ['product', vars.productId] });
    },
    onError: (e: any) => toast.error(e.message || 'Failed to submit review'),
  });
}
