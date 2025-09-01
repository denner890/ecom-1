import React from 'react';
import { Link } from 'react-router-dom';
import { Package } from 'lucide-react';

function Footer() {
  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="h-6 w-6 bg-primary rounded-md flex items-center justify-center">
                <Package className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-bold text-lg text-foreground">MerchApp</span>
            </div>
            <p className="text-muted-foreground text-sm">
              Premium merchandise for your lifestyle. Quality products, exceptional service.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-foreground">Shop</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/shop" className="text-muted-foreground hover:text-foreground transition-colors">All Products</Link></li>
              <li><Link to="/shop?category=apparel" className="text-muted-foreground hover:text-foreground transition-colors">Apparel</Link></li>
              <li><Link to="/shop?category=accessories" className="text-muted-foreground hover:text-foreground transition-colors">Accessories</Link></li>
              <li><Link to="/showcase" className="text-muted-foreground hover:text-foreground transition-colors">Showcase</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-foreground">Account</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">Dashboard</Link></li>
              <li><Link to="/dashboard/orders" className="text-muted-foreground hover:text-foreground transition-colors">Orders</Link></li>
              <li><Link to="/dashboard/wishlist" className="text-muted-foreground hover:text-foreground transition-colors">Wishlist</Link></li>
              <li><Link to="/auth/login" className="text-muted-foreground hover:text-foreground transition-colors">Login</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-foreground">Support</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="text-muted-foreground hover:text-foreground transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="text-muted-foreground hover:text-foreground transition-colors">Contact</Link></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">FAQ</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Returns</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm">
            © 2025 MerchApp. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Privacy</a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;