import React from 'react';
import ImageUpload from '@/components/ui/ImageUpload';

function AdminProductsPage() {
  const handleImageUpload = (urls: string[]) => {
    console.log('Uploaded images:', urls);
    // Handle the uploaded image URLs
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-4">Manage Products</h1>
        <p className="text-muted-foreground text-lg">
          Add, edit, and organize your product catalog
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-card p-6 rounded-lg border border-border">
          <h3 className="font-semibold mb-4 text-card-foreground">Product Form</h3>
          <p className="text-muted-foreground mb-6">Product creation/editing form will go here</p>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-card-foreground mb-2">
                Product Images
              </label>
              <ImageUpload 
                onUpload={handleImageUpload}
                maxFiles={5}
              />
            </div>
          </div>
        </div>
        
        <div className="bg-card p-6 rounded-lg border border-border">
          <h3 className="font-semibold mb-4 text-card-foreground">Product List</h3>
          <p className="text-muted-foreground">Existing products table will go here</p>
        </div>
      </div>
    </div>
  );
}

export default AdminProductsPage;