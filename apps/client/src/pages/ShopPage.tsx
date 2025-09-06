import React from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Search, Filter } from 'lucide-react';
import { productApi } from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Card, CardContent } from '@/components/ui/Card';

function ShopPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState('-createdAt');

  const { data: productsData, isLoading } = useQuery({
    queryKey: ['products', { page, search, category, sort }],
    queryFn: () => productApi.getAll({ page, limit: 12, search, category, sort }),
  });

  const products = productsData?.data?.items || [];
  const pagination = productsData?.data?.pagination;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1); // Reset to first page when searching
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-foreground mb-4">Shop</h1>
        <p className="text-muted-foreground text-lg">
          Browse our complete collection of premium merchandise
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <aside className="md:col-span-1">
          <div className="bg-card p-6 rounded-lg border border-border">
            <h3 className="font-semibold mb-4 text-card-foreground">Filters</h3>
            <p className="text-muted-foreground">Filter components will go here</p>
          </div>
        </aside>
        
        <main className="md:col-span-3">
          <div className="bg-card p-6 rounded-lg border border-border">
            <h3 className="font-semibold mb-4 text-card-foreground">Products</h3>
            <p className="text-muted-foreground">Product grid will go here</p>
          </div>
        </main>
      </div>
    </div>
  );
}

export default ShopPage;