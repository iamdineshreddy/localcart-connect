import { useState } from 'react';
import { useStore, useAuth } from '@/contexts/AppContext';
import SellerLayout from '@/components/layout/SellerLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CATEGORIES, ProductCategory } from '@/types';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export default function AddProductPage() {
  const { addProduct } = useStore();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [mrp, setMrp] = useState('');
  const [category, setCategory] = useState<ProductCategory>('groceries');
  const [stock, setStock] = useState('');
  const [unit, setUnit] = useState('');
  const [image, setImage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addProduct({
      sellerId: user?.id || 'seller1',
      sellerName: user?.name || 'Test Seller',
      name,
      description,
      price: Number(price),
      mrp: Number(mrp) || Number(price),
      category,
      image: image || 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=300&h=300&fit=crop',
      stock: Number(stock),
      unit,
      trustScore: 75,
    });
    toast.success('Product added! Awaiting admin approval.');
    navigate('/seller/products');
  };

  return (
    <SellerLayout>
      <div className="max-w-2xl">
        <h2 className="font-display text-2xl font-bold mb-6">Add New Product</h2>
        <form onSubmit={handleSubmit} className="space-y-4 bg-card border rounded-xl p-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Product Name</Label>
              <Input value={name} onChange={e => setName(e.target.value)} placeholder="e.g., Fresh Tomatoes" required />
            </div>
            <div>
              <Label>Category</Label>
              <Select value={category} onValueChange={v => setCategory(v as ProductCategory)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map(c => <SelectItem key={c.value} value={c.value}>{c.emoji} {c.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label>Description</Label>
            <Textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Describe your product" required />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div><Label>Price (₹)</Label><Input type="number" value={price} onChange={e => setPrice(e.target.value)} required /></div>
            <div><Label>MRP (₹)</Label><Input type="number" value={mrp} onChange={e => setMrp(e.target.value)} /></div>
            <div><Label>Stock</Label><Input type="number" value={stock} onChange={e => setStock(e.target.value)} required /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><Label>Unit</Label><Input value={unit} onChange={e => setUnit(e.target.value)} placeholder="e.g., 1 kg" required /></div>
            <div><Label>Image URL</Label><Input value={image} onChange={e => setImage(e.target.value)} placeholder="https://..." /></div>
          </div>
          <Button type="submit" className="w-full">Add Product for Review</Button>
        </form>
      </div>
    </SellerLayout>
  );
}
