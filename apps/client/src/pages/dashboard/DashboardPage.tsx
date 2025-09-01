import React from 'react';
import { Link } from 'react-router-dom';
import { Package, Heart, Settings, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

function DashboardPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div 
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl font-bold text-foreground mb-4">Dashboard</h1>
        <p className="text-muted-foreground text-lg">
          Manage your account and view your activity
        </p>
      </motion.div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { title: 'Orders', value: '12', icon: Package, link: '/dashboard/orders' },
          { title: 'Wishlist', value: '8', icon: Heart, link: '/dashboard/wishlist' },
          { title: 'Spent', value: '$1,234', icon: TrendingUp, link: '/dashboard/orders' },
          { title: 'Settings', value: 'Profile', icon: Settings, link: '/dashboard' },
        ].map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <Link to={stat.link}>
              <Card className="hover:shadow-lg transition-all duration-200 hover:scale-105 cursor-pointer bg-card border-border">
                <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-card-foreground">{stat.title}</CardTitle>
                  <stat.icon className="h-4 w-4 ml-auto text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-card-foreground">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">Click to view details</p>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default DashboardPage;