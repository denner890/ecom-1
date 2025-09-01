import React from 'react';
import { motion } from 'framer-motion';
import { Star, Heart, ShoppingCart, Package, User, Settings } from 'lucide-react';
import Button from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import ImageUpload from '@/components/ui/ImageUpload';

function ThemePreviewPage() {
  const handleImageUpload = (urls: string[]) => {
    console.log('Demo upload:', urls);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/10 to-accent/5">
      {/* Abstract background pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl"></div>
        <div className="absolute top-3/4 left-1/2 w-64 h-64 bg-secondary/5 rounded-full blur-2xl"></div>
      </div>

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl font-bold text-foreground mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
            Dark-First Design System
          </h1>
          <p className="text-muted-foreground text-xl max-w-2xl mx-auto">
            A comprehensive preview of our modern, accessible component library with beautiful dark aesthetics.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {/* Buttons Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-card-foreground">Button Variants</CardTitle>
                <CardDescription>Different button styles and states</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Button>Primary</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="destructive">Destructive</Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button size="sm">Small</Button>
                  <Button size="default">Default</Button>
                  <Button size="lg">Large</Button>
                  <Button size="icon"><Star className="h-4 w-4" /></Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Cards Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-card-foreground">Interactive Cards</CardTitle>
                <CardDescription>Hover effects and micro-interactions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Card className="hover:shadow-lg transition-all duration-200 hover:scale-105 cursor-pointer bg-muted/20 border-border">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <Heart className="h-5 w-5 text-red-500" />
                      <span className="text-card-foreground">Wishlist Item</span>
                    </div>
                  </CardContent>
                </Card>
                <Card className="hover:shadow-lg transition-all duration-200 hover:scale-105 cursor-pointer bg-muted/20 border-border">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <ShoppingCart className="h-5 w-5 text-green-500" />
                      <span className="text-card-foreground">Cart Item</span>
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </motion.div>

          {/* Form Elements */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-card-foreground">Form Elements</CardTitle>
                <CardDescription>Input fields and form controls</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input placeholder="Email address" type="email" />
                <Input placeholder="Password" type="password" />
                <Input placeholder="Search products..." />
                <div className="flex space-x-2">
                  <Input placeholder="Quantity" type="number" className="w-20" />
                  <Button className="flex-1">Add to Cart</Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-card-foreground">Dashboard Stats</CardTitle>
                <CardDescription>Key metrics and performance indicators</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { label: 'Total Sales', value: '$24,567', icon: Package, color: 'text-green-500' },
                  { label: 'Active Users', value: '1,234', icon: User, color: 'text-blue-500' },
                  { label: 'Orders', value: '89', icon: ShoppingCart, color: 'text-purple-500' },
                ].map((stat, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <stat.icon className={`h-5 w-5 ${stat.color}`} />
                      <span className="text-sm text-muted-foreground">{stat.label}</span>
                    </div>
                    <span className="font-semibold text-card-foreground">{stat.value}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Image Upload Demo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-card-foreground">Image Upload</CardTitle>
                <CardDescription>Cloudinary integration with preview</CardDescription>
              </CardHeader>
              <CardContent>
                <ImageUpload 
                  onUpload={handleImageUpload}
                  maxFiles={3}
                />
              </CardContent>
            </Card>
          </motion.div>

          {/* Color Palette */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-card-foreground">Color System</CardTitle>
                <CardDescription>Dark-first design tokens</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <div className="h-12 bg-primary rounded-md flex items-center justify-center">
                    <span className="text-primary-foreground text-xs font-medium">Primary</span>
                  </div>
                  <div className="h-12 bg-secondary rounded-md flex items-center justify-center">
                    <span className="text-secondary-foreground text-xs font-medium">Secondary</span>
                  </div>
                  <div className="h-12 bg-accent rounded-md flex items-center justify-center">
                    <span className="text-accent-foreground text-xs font-medium">Accent</span>
                  </div>
                  <div className="h-12 bg-muted rounded-md flex items-center justify-center">
                    <span className="text-muted-foreground text-xs font-medium">Muted</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Typography Section */}
        <motion.div
          className="mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-card-foreground">Typography Scale</CardTitle>
              <CardDescription>Consistent text hierarchy with Inter font</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h1 className="text-4xl font-bold text-foreground">Heading 1 - Hero Title</h1>
                <h2 className="text-3xl font-bold text-foreground">Heading 2 - Section Title</h2>
                <h3 className="text-2xl font-semibold text-foreground">Heading 3 - Subsection</h3>
                <h4 className="text-xl font-semibold text-foreground">Heading 4 - Card Title</h4>
                <p className="text-base text-foreground">Body text - Regular paragraph content with good readability.</p>
                <p className="text-sm text-muted-foreground">Small text - Captions and secondary information.</p>
                <p className="text-xs text-muted-foreground">Extra small - Fine print and metadata.</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

export default ThemePreviewPage;