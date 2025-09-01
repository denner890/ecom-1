import React from 'react';

function OrdersPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-4">Order History</h1>
        <p className="text-muted-foreground text-lg">
          View and track all your orders
        </p>
      </div>
      
      <div className="bg-card p-6 rounded-lg border border-border">
        <h3 className="font-semibold mb-4 text-card-foreground">Recent Orders</h3>
        <p className="text-muted-foreground">Orders list with status tracking will go here</p>
      </div>
    </div>
  );
}

export default OrdersPage;