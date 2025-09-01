import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Truck, Shield, HeadphonesIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';

function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-background via-muted/20 to-accent/10 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 relative">
          <motion.div 
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Premium Merchandise
              <span className="block text-primary">For Your Lifestyle</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Discover our curated collection of high-quality products designed for those who appreciate excellence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/shop">
                <Button size="lg" className="w-full sm:w-auto group">
                  Shop Now
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/showcase">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  View Showcase
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-card/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Why Choose MerchApp?</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              We're committed to delivering exceptional quality and service in every interaction.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Star className="h-8 w-8 text-yellow-500" />,
                title: 'Premium Quality',
                description: 'Only the finest materials and craftsmanship in every product.'
              },
              {
                icon: <Truck className="h-8 w-8 text-green-500" />,
                title: 'Fast Shipping',
                description: 'Quick delivery to your doorstep with tracking included.'
              },
              {
                icon: <Shield className="h-8 w-8 text-blue-500" />,
                title: 'Secure Payment',
                description: 'Your transactions are protected with enterprise-grade security.'
              },
              {
                icon: <HeadphonesIcon className="h-8 w-8 text-purple-500" />,
                title: '24/7 Support',
                description: 'Our dedicated team is here to help whenever you need us.'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="text-center p-6 h-full hover:shadow-lg transition-shadow bg-card border-border">
                  <CardContent className="pt-6">
                    <div className="flex justify-center mb-4">
                      {feature.icon}
                    </div>
                    <h3 className="font-semibold text-lg mb-2 text-card-foreground">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary-foreground/10 via-transparent to-transparent"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Join thousands of satisfied customers who trust MerchApp for their merchandise needs.
            </p>
            <Link to="/shop">
              <Button size="lg" variant="secondary" className="group">
                Explore Products
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;