import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface FraudReport {
  id: string;
  reporter_id: string;
  reporter_name: string;
  seller_id: string;
  seller_name: string;
  order_id?: string;
  type: 'fake_product' | 'wrong_delivery' | 'scam';
  description: string;
  status: 'pending' | 'investigating' | 'resolved' | 'dismissed';
  admin_action?: string;
  created_at: string;
}

export function useFraudReports() {
  return useQuery({
    queryKey: ['fraud-reports'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('fraud_reports')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data || []) as FraudReport[];
    },
  });
}

export function useSubmitFraudReport() {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (report: { seller_id: string; seller_name: string; order_id?: string; type: string; description: string }) => {
      if (!user) throw new Error('Not authenticated');
      const { error } = await supabase.from('fraud_reports').insert({
        reporter_id: user.id,
        reporter_name: user.name,
        seller_id: report.seller_id,
        seller_name: report.seller_name,
        order_id: report.order_id || null,
        type: report.type as any,
        description: report.description,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['fraud-reports'] });
      toast.success('Report submitted');
    },
  });
}

export function useUpdateFraudReport() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status, admin_action }: { id: string; status: string; admin_action?: string }) => {
      const { error } = await supabase
        .from('fraud_reports')
        .update({ status, admin_action, updated_at: new Date().toISOString() })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['fraud-reports'] });
    },
  });
}
