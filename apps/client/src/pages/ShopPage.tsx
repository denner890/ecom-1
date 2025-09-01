import React from 'react';

function ShopPage() {
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