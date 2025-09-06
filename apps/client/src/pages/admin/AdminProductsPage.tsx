import React from 'react';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { productApi } from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import ImageUpload from '@/components/ui/ImageUpload';

const productSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.number().min(0, 'Price must be positive'),
  compareAtPrice: z.number().optional(),
  category: z.string().min(1, 'Category is required'),
  stock: z.number().min(0, 'Stock must be non-negative'),
  images: z.array(z.string()).min(1, 'At least one image is required'),
});

type ProductFormData = z.infer<typeof productSchema>;

function AdminProductsPage() {
  const queryClient = useQueryClient();
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);
  const [images, setImages] = useState<string[]>([]);

  const { data: productsData, isLoading } = useQuery({
    queryKey: ['products', 'admin'],
    queryFn: () => productApi.getAll({ limit: 100 }),
  });

  const products = productsData?.data?.items || [];

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
  });

  const createMutation = useMutation({
    mutationFn: productApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      resetForm();
      alert('Product created successfully!');
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || 'Failed to create product');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => productApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      resetForm();
      alert('Product updated successfully!');
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || 'Failed to update product');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: productApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      alert('Product deleted successfully!');
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || 'Failed to delete product');
    },
  });

  const handleImageUpload = (urls: string[]) => {
    setImages(urls);
    setValue('images', urls);
  };

  const resetForm = () => {
    reset();
    setImages([]);
    setEditingProduct(null);
    setShowForm(false);
  };

  const startEdit = (product: any) => {
    setEditingProduct(product);
    setShowForm(true);
    setImages(product.images || []);
    
    // Populate form with product data
    reset({
      title: product.title,
      description: product.description,
      price: product.price,
      compareAtPrice: product.compareAtPrice,
      category: product.category,
      stock: product.stock,
      images: product.images || [],
    });
  };

  const onSubmit = async (data: ProductFormData) => {
    const productData = {
      ...data,
      images,
    };

    if (editingProduct) {
      await updateMutation.mutateAsync({ id: editingProduct.id, data: productData });
    } else {
      await createMutation.mutateAsync(productData);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      await deleteMutation.mutateAsync(id);
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-4">Manage Products</h1>
            <p className="text-muted-foreground text-lg">
              Add, edit, and organize your product catalog
            </p>
          </div>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </div>
      </div>
      
      {showForm && (
        <Card className="bg-card border-border mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-card-foreground">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={resetForm}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <Input
                    placeholder="Product Title"
                    {...register('title')}
                    error={errors.title?.message}
                  />
                  
                  <div>
                    <textarea
                      placeholder="Product Description"
                      {...register('description')}
                      className="w-full p-3 border border-border rounded-md bg-background text-foreground min-h-[100px]"
                    />
                    {errors.description && (
                      <p className="text-sm text-red-600 mt-1">{errors.description.message}</p>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="Price"
                      {...register('price', { valueAsNumber: true })}
                      error={errors.price?.message}
                    />
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="Compare At Price (Optional)"
                      {...register('compareAtPrice', { valueAsNumber: true })}
                      error={errors.compareAtPrice?.message}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <select
                      {...register('category')}
                      className="w-full p-2 border border-border rounded-md bg-background text-foreground"
                    >
                      <option value="">Select Category</option>
                      <option value="apparel">Apparel</option>
                      <option value="accessories">Accessories</option>
                      <option value="electronics">Electronics</option>
                      <option value="home">Home & Living</option>
                    </select>
                    <Input
                      type="number"
                      placeholder="Stock Quantity"
                      {...register('stock', { valueAsNumber: true })}
                      error={errors.stock?.message}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-card-foreground mb-2">
                    Product Images
                  </label>
                  <ImageUpload 
                    onUpload={handleImageUpload}
                    maxFiles={5}
                    existingImages={images}
                  />
                  {errors.images && (
                    <p className="text-sm text-red-600 mt-1">{errors.images.message}</p>
                  )}
                </div>
              </div>
              
              <div className="flex space-x-4">
                <Button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                >
                  <Save className="w-4 h-4 mr-2" />
                  {editingProduct ? 'Update Product' : 'Create Product'}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
      
      {/* Products List */}
      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading products...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="bg-card border-border">
              <div className="aspect-square overflow-hidden rounded-t-lg">
                <img 
                  src={product.images[0] || 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg'} 
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-card-foreground mb-2 line-clamp-2">{product.title}</h3>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{product.description}</p>
                
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold text-primary">{formatPrice(product.price)}</span>
                    {product.compareAtPrice && (
                      <span className="text-sm text-muted-foreground line-through">
                        {formatPrice(product.compareAtPrice)}
                      </span>
                    )}
                  </div>
                  <span className="text-sm text-muted-foreground">Stock: {product.stock}</span>
                </div>
                
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => startEdit(product)}
                    className="flex-1"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(product.id)}
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminProductsPage;