import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface UserLocation {
  latitude: number | null;
  longitude: number | null;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

export function useUserLocation(userId?: string) {
  const { user } = useAuth();
  const id = userId || user?.id;

  return useQuery({
    queryKey: ['user-location', id],
    queryFn: async (): Promise<UserLocation | null> => {
      if (!id) return null;
      const { data, error } = await supabase
        .from('profiles')
        .select('latitude, longitude, address, city, state, pincode')
        .eq('id', id)
        .single();
      if (error || !data) return null;
      return data as unknown as UserLocation;
    },
    enabled: !!id,
  });
}

/**
 * Fetch seller location by seller_id
 */
export function useSellerLocation(sellerId?: string) {
  return useQuery({
    queryKey: ['seller-location', sellerId],
    queryFn: async (): Promise<UserLocation | null> => {
      if (!sellerId) return null;
      const { data, error } = await supabase
        .from('profiles')
        .select('latitude, longitude, address, city, state, pincode')
        .eq('id', sellerId)
        .single();
      if (error || !data) return null;
      return data as unknown as UserLocation;
    },
    enabled: !!sellerId,
  });
}
