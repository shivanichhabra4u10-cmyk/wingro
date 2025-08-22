// Script to initialize products collection in MongoDB
const { MongoClient } = require('mongodb');
require('dotenv').config();

// MongoDB connection string
const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/wingrox";

// Sample products data
const sampleProducts = [
  {
    name: "Market Validation Toolkit",
    description: "Comprehensive tools to validate your product-market fit with data-driven insights.",
    price: 299.99,
    oldPrice: 399.99,
    badge: "Best Seller",
    category: "digital",
    productType: "individual",
    images: [
      "https://placehold.co/600x400/94a3b8/FFFFFF?text=Market+Validation+Dashboard",
      "https://placehold.co/600x400/a1a1aa/FFFFFF?text=PMF+Analysis+Tool",
      "https://placehold.co/600x400/94a3b8/FFFFFF?text=Customer+Insights+Portal"
    ],
    features: [
      "Market sizing tools",
      "Customer interview framework",
      "Competitive analysis templates",
      "Product-market fit surveys",
      "Data visualization dashboards"
    ],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Growth Strategy Blueprint",
    description: "Actionable go-to-market strategy templates for ambitious founders and growth leaders.",
    price: 499.99,
    oldPrice: 599.99,
    badge: "Popular",
    category: "digital",
    productType: "individual",
    images: [
      "https://placehold.co/600x400/a3e635/FFFFFF?text=GTM+Strategy+Framework", 
      "https://placehold.co/600x400/bef264/FFFFFF?text=Pricing+Model+Calculator",
      "https://placehold.co/600x400/a3e635/FFFFFF?text=Launch+Timeline+Planner"
    ],
    features: [
      "Channel strategy planner",
      "Pricing calculator",
      "Conversion funnel templates",
      "Customer journey maps",
      "GTM roadmap builder"
    ],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Navigator Platform Basic",
    description: "The essential platform for mapping your company's growth journey and identifying blockers.",
    price: 99.99,
    oldPrice: null,
    badge: "New",
    category: "platform",
    productType: "enterprise",
    images: [
      "https://placehold.co/600x400/fca5a5/FFFFFF?text=Navigator+Dashboard", 
      "https://placehold.co/600x400/fecdd3/FFFFFF?text=Assessment+Interface",
      "https://placehold.co/600x400/fca5a5/FFFFFF?text=Blocker+Identification+Tool"
    ],
    features: [
      "Interactive growth map",
      "Basic assessments",
      "Blocker identification",
      "Growth metrics dashboard",
      "Team collaboration tools"
    ],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

async function initializeProducts() {
  const client = new MongoClient(uri);
  
  try {
    // Connect to MongoDB
    await client.connect();
    console.log("Connected to MongoDB");
    
    // Get the database
    const db = client.db();
    
    // Check if products collection exists and has data
    const productCount = await db.collection("products").countDocuments();
    console.log(`Found ${productCount} existing products in the database.`);
    
    if (productCount === 0) {
      console.log("Initializing products collection with sample data...");
      
      // Insert sample products
      const result = await db.collection("products").insertMany(sampleProducts);
      console.log(`${result.insertedCount} products successfully inserted into database.`);
    } else {
      console.log("Products collection already has data. Skipping initialization.");
    }
    
    // Display all products
    console.log("\nAll Products in Database:");
    const products = await db.collection("products").find().toArray();
    products.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name} (${product.productType}) - $${product.price}`);
    });
    
  } catch (err) {
    console.error("Error initializing products:", err);
  } finally {
    await client.close();
    console.log("MongoDB connection closed");
  }
}

// Run the initialization function
initializeProducts();
