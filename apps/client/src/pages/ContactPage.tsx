import React from 'react';

function ContactPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-foreground mb-4">Contact Us</h1>
        <p className="text-muted-foreground text-lg">
          Get in touch with our team
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="bg-card p-6 rounded-lg border border-border">
          <h3 className="font-semibold mb-4 text-card-foreground">Send us a Message</h3>
          <p className="text-muted-foreground">Contact form will go here</p>
        </div>
        
        <div className="bg-card p-6 rounded-lg border border-border">
          <h3 className="font-semibold mb-4 text-card-foreground">Contact Information</h3>
          <p className="text-muted-foreground">Contact details and location will go here</p>
        </div>
      </div>
    </div>
  );
}

export default ContactPage;