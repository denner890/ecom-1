import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, User, Menu, Package } from 'lucide-react';
import { useAuthStore } from '@/store/auth';
import { useCartStore } from '@/store/cart';
import Button from '@/components/ui/Button';

function Navbar() {
  const { user, isAuthenticated } = useAuthStore();
  const { items } = useCartStore();

  const cartItemsCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 bg-primary rounded-md flex items-center justify-center">
              <Package className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">MerchApp</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/shop" className="text-muted-foreground hover:text-foreground transition-colors">
              Shop
            </Link>
            <Link to="/showcase" className="text-muted-foreground hover:text-foreground transition-colors">
              Showcase
            </Link>
            <Link to="/about" className="text-muted-foreground hover:text-foreground transition-colors">
              About
            </Link>
            <Link to="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
              Contact
            </Link>
            <Link to="/theme-preview" className="text-muted-foreground hover:text-foreground transition-colors">
              Theme
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <Link to="/cart" className="relative">
              <Button variant="ghost" size="sm" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                    {cartItemsCount}
                  </span>
                )}
              </Button>
            </Link>

            {isAuthenticated ? (
              <Link to="/dashboard">
                <Button variant="ghost" size="sm">
                  <User className="h-5 w-5 mr-2" />
                  {user?.displayName || 'Account'}
                </Button>
              </Link>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/auth/login">
                  <Button variant="ghost" size="sm">Login</Button>
                </Link>
                <Link to="/auth/register">
                  <Button size="sm">Sign Up</Button>
                </Link>
              </div>
            )}

            <Button variant="ghost" size="sm" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;