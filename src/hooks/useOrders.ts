import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  product_image: string;
  quantity: number;
  price: number;
  seller_id: string;
  seller_name: string;
}

export interface Order {
  id: string;
  buyer_id: string;
  buyer_name: string;
  total: number;
  status: string;
  address: string;
  delivery_partner_id?: string;
  created_at: string;
  updated_at: string;
  items: OrderItem[];
}

export function useOrders(role?: 'buyer' | 'seller' | 'admin' | 'delivery') {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['orders', user?.id, role],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('orders')
        .select('*, order_items(*)')
        .order('created_at', { ascending: false });
      if (error) throw error;
      
      let orders = (data || []).map((o: any) => ({
        ...o,
        items: o.order_items || [],
      }));

      // Filter based on role
      if (role === 'buyer') {
        orders = orders.filter((o: Order) => o.buyer_id === user.id);
      } else if (role === 'seller') {
        orders = orders.filter((o: Order) => o.items.some((i: OrderItem) => i.seller_id === user.id));
      } else if (role === 'delivery') {
        orders = orders.filter((o: Order) => o.delivery_partner_id === user.id);
      }
      
      return orders as Order[];
    },
    enabled: !!user,
  });
}

export function usePlaceOrder() {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async ({ items, total, address, payment_method, payment_id }: { items: Omit<OrderItem, 'id' | 'order_id'>[]; total: number; address: string; payment_method?: string; payment_id?: string }) => {
      if (!user) throw new Error('Not authenticated');
      
      // Create order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          buyer_id: user.id,
          buyer_name: user.name,
          total,
          address,
          payment_method: payment_method || 'cod',
          payment_id: payment_id || null,
        } as any)
        .select()
        .single();
      if (orderError) throw orderError;

      // Create order items
      const orderItems = items.map(item => ({
        order_id: order.id,
        product_id: item.product_id,
        product_name: item.product_name,
        product_image: item.product_image,
        quantity: item.quantity,
        price: item.price,
        seller_id: item.seller_id,
        seller_name: item.seller_name,
      }));
      
      const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
      if (itemsError) throw itemsError;

      // Decrement stock for each product
      for (const item of items) {
        await supabase.rpc('decrement_stock', {
          _product_id: item.product_id,
          _quantity: item.quantity,
        });
      }

      // Clear cart
      await supabase.from('cart_items').delete().eq('user_id', user.id);
      
      return order;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['orders'] });
      qc.invalidateQueries({ queryKey: ['cart'] });
      qc.invalidateQueries({ queryKey: ['products'] });
      toast.success('Order placed successfully!');
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useUpdateOrderStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: string }) => {
      const { error } = await supabase
        .from('orders')
        .update({ status: status as any, updated_at: new Date().toISOString() })
        .eq('id', orderId);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['orders'] });
      toast.success('Order status updated');
    },
  });
}
