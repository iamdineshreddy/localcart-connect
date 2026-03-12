import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface TrustScore {
  id: string;
  seller_id: string;
  kyc_verified: boolean;
  order_completion_rate: number;
  buyer_rating: number;
  complaint_count: number;
  total_score: number;
  badge: 'bronze' | 'silver' | 'gold' | 'diamond';
  updated_at: string;
}

export function useTrustScore(sellerId: string) {
  return useQuery({
    queryKey: ['trust-score', sellerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('trust_scores')
        .select('*')
        .eq('seller_id', sellerId)
        .maybeSingle();
      if (error) throw error;
      return data as TrustScore | null;
    },
    enabled: !!sellerId,
  });
}

export function useAllTrustScores() {
  return useQuery({
    queryKey: ['trust-scores'],
    queryFn: async () => {
      const { data, error } = await supabase.from('trust_scores').select('*');
      if (error) throw error;
      return (data || []) as TrustScore[];
    },
  });
}

export function getBadgeInfo(badge: string) {
  const badges: Record<string, { label: string; emoji: string; color: string }> = {
    bronze: { label: 'Bronze', emoji: '🥉', color: 'bg-amber-700/10 text-amber-700' },
    silver: { label: 'Silver', emoji: '🥈', color: 'bg-slate-400/10 text-slate-500' },
    gold: { label: 'Gold', emoji: '🥇', color: 'bg-amber-500/10 text-amber-500' },
    diamond: { label: 'Diamond', emoji: '💎', color: 'bg-info/10 text-info' },
  };
  return badges[badge] || badges.bronze;
}
