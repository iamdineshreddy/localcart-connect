import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface KYCDocument {
  id: string;
  seller_id: string;
  full_name: string;
  phone: string;
  address: string;
  upi_id?: string;
  bank_account?: string;
  ifsc_code?: string;
  aadhaar_number: string;
  pan_number: string;
  aadhaar_front_url?: string;
  aadhaar_back_url?: string;
  pan_card_url?: string;
  shop_photo_url?: string;
  status: 'not_submitted' | 'pending' | 'approved' | 'rejected';
  rejection_reason?: string;
  submitted_at: string;
  reviewed_at?: string;
}

export function useMyKYC() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['kyc', user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from('kyc_documents')
        .select('*')
        .eq('seller_id', user.id)
        .maybeSingle();
      if (error) throw error;
      return data as KYCDocument | null;
    },
    enabled: !!user,
  });
}

export function useAllKYC() {
  return useQuery({
    queryKey: ['kyc-all'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('kyc_documents')
        .select('*')
        .order('submitted_at', { ascending: false });
      if (error) throw error;
      
      // Fetch seller profiles separately
      const sellerIds = (data || []).map((d: any) => d.seller_id);
      const { data: profiles } = await supabase.from('profiles').select('id, name, email').in('id', sellerIds);
      const profileMap = new Map((profiles || []).map((p: any) => [p.id, p]));
      
      return (data || []).map((d: any) => ({
        ...d,
        profiles: profileMap.get(d.seller_id) || { name: '', email: '' },
      })) as unknown as (KYCDocument & { profiles: { name: string; email: string } })[];
    },
  });
}

export function useSubmitKYC() {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (doc: Omit<KYCDocument, 'id' | 'seller_id' | 'status' | 'submitted_at' | 'reviewed_at' | 'rejection_reason'>) => {
      if (!user) throw new Error('Not authenticated');
      
      // Check if existing KYC doc
      const { data: existing } = await supabase
        .from('kyc_documents')
        .select('id')
        .eq('seller_id', user.id)
        .maybeSingle();

      if (existing) {
        const { error } = await supabase
          .from('kyc_documents')
          .update({ ...doc, status: 'pending', submitted_at: new Date().toISOString(), rejection_reason: null })
          .eq('id', existing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('kyc_documents')
          .insert({ ...doc, seller_id: user.id, status: 'pending' });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['kyc'] });
      toast.success('KYC submitted for review!');
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useUpdateKYCStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status, rejection_reason }: { id: string; status: string; rejection_reason?: string }) => {
      const { error } = await supabase
        .from('kyc_documents')
        .update({ status: status as any, rejection_reason, reviewed_at: new Date().toISOString() })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['kyc-all'] });
      qc.invalidateQueries({ queryKey: ['kyc'] });
    },
  });
}

export async function uploadKYCFile(userId: string, file: File, type: string): Promise<string> {
  const ext = file.name.split('.').pop();
  const path = `${userId}/${type}-${Date.now()}.${ext}`;
  const { error } = await supabase.storage.from('kyc-documents').upload(path, file);
  if (error) throw error;
  const { data } = supabase.storage.from('kyc-documents').getPublicUrl(path);
  return data.publicUrl;
}
