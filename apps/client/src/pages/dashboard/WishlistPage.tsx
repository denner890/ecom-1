import React from 'react';

function WishlistPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-4">Wishlist</h1>
        <p className="text-muted-foreground text-lg">
          Items you've saved for later
        </p>
      </div>
      
      <div className="bg-card p-6 rounded-lg border border-border">
        <h3 className="font-semibold mb-4 text-card-foreground">Saved Items</h3>
        <p className="text-muted-foreground">Wishlist items grid will go here</p>
      </div>
    </div>
  );
}

export default WishlistPage;