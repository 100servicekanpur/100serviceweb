const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://100admin:VaibhavKatiyar@cluster0.4mt12gk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

async function testConnection() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log("✅ Successfully connected to MongoDB Atlas!");
    
    const db = client.db('100service');
    const collections = await db.listCollections().toArray();
    console.log("📁 Collections:", collections.map(c => c.name));
    
    // Test a simple operation
    const testCollection = db.collection('test');
    await testCollection.insertOne({ test: true, timestamp: new Date() });
    console.log("✅ Test document inserted successfully!");
    
  } catch (error) {
    console.error("❌ Connection failed:", error.message);
  } finally {
    await client.close();
  }
}

testConnection();