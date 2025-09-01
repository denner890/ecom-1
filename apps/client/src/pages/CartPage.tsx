import React from 'react';

function CartPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-foreground mb-4">Shopping Cart</h1>
        <p className="text-muted-foreground text-lg">
          Review your items and proceed to checkout
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-card p-6 rounded-lg border border-border">
            <h3 className="font-semibold mb-4 text-card-foreground">Cart Items</h3>
            <p className="text-muted-foreground">Cart items list will go here</p>
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <div className="bg-card p-6 rounded-lg border border-border">
            <h3 className="font-semibold mb-4 text-card-foreground">Order Summary</h3>
            <p className="text-muted-foreground">Price breakdown and checkout button will go here</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartPage;