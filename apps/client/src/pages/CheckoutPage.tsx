import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { CreditCard, Lock } from 'lucide-react';
import { useCartStore } from '@/store/cart';
import { useAuthStore } from '@/store/auth';
import { orderApi } from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

const checkoutSchema = z.object({
  shippingAddress: z.object({
    name: z.string().min(1, 'Name is required'),
    street: z.string().min(1, 'Street address is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    zip: z.string().min(1, 'ZIP code is required'),
    country: z.string().default('US'),
  }),
  paymentMethod: z.object({
    cardNumber: z.string().min(16, 'Card number is required'),
    expiryDate: z.string().min(5, 'Expiry date is required'),
    cvv: z.string().min(3, 'CVV is required'),
    cardholderName: z.string().min(1, 'Cardholder name is required'),
  }),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

function CheckoutPage() {
  const navigate = useNavigate();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const [isProcessing, setIsProcessing] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
  });

  const createOrderMutation = useMutation({
    mutationFn: orderApi.create,
    onSuccess: (data) => {
      clearCart();
      navigate('/dashboard/orders');
      alert('Order placed successfully!');
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || 'Failed to place order');
    },
  });

  const onSubmit = async (data: CheckoutFormData) => {
    if (!isAuthenticated) {
      navigate('/auth/login');
      return;
    }

    setIsProcessing(true);
    
    try {
      // In a real app, you'd process payment here
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate payment processing
      
      await createOrderMutation.mutateAsync({
        shippingAddress: data.shippingAddress,
        paymentRef: `payment_${Date.now()}`, // Mock payment reference
      });
    } catch (error) {
      console.error('Checkout error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const subtotal = getTotalPrice();
  const shipping = subtotal >= 50 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Your cart is empty</h1>
          <p className="text-muted-foreground mb-8">Add some items to your cart before checking out.</p>
          <Button onClick={() => navigate('/shop')}>Continue Shopping</Button>
        </div>
      </div>
    );
  }
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-foreground mb-4">Checkout</h1>
        <p className="text-muted-foreground text-lg">
          Complete your purchase securely
        </p>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            {/* Shipping Address */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-card-foreground">Shipping Address</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="Full Name"
                  {...register('shippingAddress.name')}
                  error={errors.shippingAddress?.name?.message}
                />
                <Input
                  placeholder="Street Address"
                  {...register('shippingAddress.street')}
                  error={errors.shippingAddress?.street?.message}
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    placeholder="City"
                    {...register('shippingAddress.city')}
                    error={errors.shippingAddress?.city?.message}
                  />
                  <Input
                    placeholder="State"
                    {...register('shippingAddress.state')}
                    error={errors.shippingAddress?.state?.message}
                  />
                </div>
                <Input
                  placeholder="ZIP Code"
                  {...register('shippingAddress.zip')}
                  error={errors.shippingAddress?.zip?.message}
                />
              </CardContent>
            </Card>

            {/* Payment Information */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-card-foreground flex items-center">
                  <CreditCard className="w-5 h-5 mr-2" />
                  Payment Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="Cardholder Name"
                  {...register('paymentMethod.cardholderName')}
                  error={errors.paymentMethod?.cardholderName?.message}
                />
                <Input
                  placeholder="Card Number"
                  {...register('paymentMethod.cardNumber')}
                  error={errors.paymentMethod?.cardNumber?.message}
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    placeholder="MM/YY"
                    {...register('paymentMethod.expiryDate')}
                    error={errors.paymentMethod?.expiryDate?.message}
                  />
                  <Input
                    placeholder="CVV"
                    {...register('paymentMethod.cvv')}
                    error={errors.paymentMethod?.cvv?.message}
                  />
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Lock className="w-4 h-4 mr-2" />
                  Your payment information is secure and encrypted
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Order Summary */}
          <div>
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-card-foreground">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Order Items */}
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-3">
                      <div className="w-12 h-12 overflow-hidden rounded border border-border">
                        <img 
                          src={item.image || 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg'} 
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-card-foreground">{item.name}</p>
                        <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-medium text-card-foreground">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>
                
                <div className="border-t border-border pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="text-card-foreground">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="text-card-foreground">
                      {shipping === 0 ? 'Free' : formatPrice(shipping)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax</span>
                    <span className="text-card-foreground">{formatPrice(tax)}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg border-t border-border pt-2">
                    <span className="text-card-foreground">Total</span>
                    <span className="text-card-foreground">{formatPrice(total)}</span>
                  </div>
                </div>
                
                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={isProcessing || createOrderMutation.isPending}
                >
                  {isProcessing || createOrderMutation.isPending ? 'Processing...' : `Place Order - ${formatPrice(total)}`}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}

export default CheckoutPage;