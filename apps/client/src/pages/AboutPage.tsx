import React from 'react';

function AboutPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-foreground mb-4">About Us</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Learn about our story, mission, and commitment to quality
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="bg-card p-6 rounded-lg border border-border">
          <h3 className="font-semibold mb-4 text-card-foreground">Our Story</h3>
          <p className="text-muted-foreground">Company story and background will go here</p>
        </div>
        
        <div className="bg-card p-6 rounded-lg border border-border">
          <h3 className="font-semibold mb-4 text-card-foreground">Our Mission</h3>
          <p className="text-muted-foreground">Mission statement and values will go here</p>
        </div>
      </div>
    </div>
  );
}

export default AboutPage;