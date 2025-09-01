import React from 'react';

function AdminOrdersPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-4">Manage Orders</h1>
        <p className="text-muted-foreground text-lg">
          Process orders and update shipping status
        </p>
      </div>
      
      <div className="bg-card p-6 rounded-lg border border-border">
        <h3 className="font-semibold mb-4 text-card-foreground">Order Management</h3>
        <p className="text-muted-foreground">Order management interface will go here</p>
      </div>
    </div>
  );
}

export default AdminOrdersPage;