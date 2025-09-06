import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Package, Clock, Truck, CheckCircle, XCircle } from 'lucide-react';
import { orderApi } from '@/lib/api';
import { formatPrice, formatDate } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

function OrdersPage() {
  const { data: ordersData, isLoading } = useQuery({
    queryKey: ['orders', 'my'],
    queryFn: () => orderApi.getAll(),
  });

  const orders = ordersData?.data?.items || [];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'paid':
        return <Package className="w-4 h-4 text-blue-600" />;
      case 'shipped':
        return <Truck className="w-4 h-4 text-purple-600" />;
      case 'delivered':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'paid':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-4">Order History</h1>
        <p className="text-muted-foreground text-lg">
          View and track all your orders
        </p>
      </div>
      
      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading orders...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">No orders yet</h2>
          <p className="text-muted-foreground">When you place orders, they'll appear here.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <Card key={order.id} className="bg-card border-border">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-card-foreground">
                    Order #{order.orderNumber || order.id.slice(-8)}
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(order.status)}
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Placed on {formatDate(order.createdAt)}
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Order Items */}
                  <div className="space-y-2">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center justify-between py-2 border-b border-border last:border-b-0">
                        <div>
                          <p className="font-medium text-card-foreground">{item.title || item.productName}</p>
                          <p className="text-sm text-muted-foreground">
                            Qty: {item.qty || item.quantity} × {formatPrice(item.priceAtPurchase || item.price)}
                          </p>
                        </div>
                        <p className="font-medium text-card-foreground">
                          {formatPrice((item.priceAtPurchase || item.price) * (item.qty || item.quantity))}
                        </p>
                      </div>
                    ))}
                  </div>
                  
                  {/* Order Total */}
                  <div className="flex justify-between items-center pt-4 border-t border-border">
                    <span className="font-semibold text-card-foreground">Total</span>
                    <span className="font-semibold text-lg text-card-foreground">
                      {formatPrice(order.grandTotal || order.total)}
                    </span>
                  </div>
                  
                  {/* Shipping Address */}
                  {order.shippingAddress && (
                    <div className="pt-4 border-t border-border">
                      <h4 className="font-medium text-card-foreground mb-2">Shipping Address</h4>
                      <div className="text-sm text-muted-foreground">
                        <p>{order.shippingAddress.name}</p>
                        <p>{order.shippingAddress.street}</p>
                        <p>
                          {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}
                        </p>
                        <p>{order.shippingAddress.country}</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default OrdersPage;