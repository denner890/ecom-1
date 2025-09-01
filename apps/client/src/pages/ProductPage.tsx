import React from 'react';
import { useParams } from 'react-router-dom';

function ProductPage() {
  const { slug } = useParams<{ slug: string }>();

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-foreground mb-4">Product: {slug}</h1>
        <p className="text-muted-foreground text-lg">
          Product details and purchase options will be displayed here
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="bg-card p-6 rounded-lg border border-border">
          <h3 className="font-semibold mb-4 text-card-foreground">Product Images</h3>
          <p className="text-muted-foreground">Image gallery will go here</p>
        </div>
        
        <div className="bg-card p-6 rounded-lg border border-border">
          <h3 className="font-semibold mb-4 text-card-foreground">Product Information</h3>
          <p className="text-muted-foreground">Product details and purchase form will go here</p>
        </div>
      </div>
    </div>
  );
}

export default ProductPage;