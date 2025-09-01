import React from 'react';
import { Link } from 'react-router-dom';
import { Package, ShoppingCart, Users, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

function AdminPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div 
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl font-bold text-foreground mb-4">Admin Dashboard</h1>
        <p className="text-muted-foreground text-lg">
          Manage your store and monitor performance
        </p>
      </motion.div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { title: 'Total Products', value: '124', change: '+12%', icon: Package },
          { title: 'Orders', value: '89', change: '+8%', icon: ShoppingCart },
          { title: 'Customers', value: '456', change: '+15%', icon: Users },
          { title: 'Revenue', value: '$12,543', change: '+22%', icon: BarChart3 },
        ].map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-card-foreground">{stat.title}</CardTitle>
                <stat.icon className="h-4 w-4 ml-auto text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-card-foreground">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.change} from last month</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link to="/admin/products">
          <Card className="hover:shadow-lg transition-all duration-200 hover:scale-105 cursor-pointer bg-card border-border">
            <CardHeader>
              <CardTitle className="text-card-foreground">Manage Products</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Add, edit, and organize your product catalog</p>
            </CardContent>
          </Card>
        </Link>

        <Link to="/admin/orders">
          <Card className="hover:shadow-lg transition-all duration-200 hover:scale-105 cursor-pointer bg-card border-border">
            <CardHeader>
              <CardTitle className="text-card-foreground">Manage Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Process orders and update shipping status</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}

export default AdminPage;