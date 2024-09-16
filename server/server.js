const express = require('express');
const { MongoClient } = require('mongodb');
const app = express();
const port = process.env.PORT || 3000;
const cors = require('cors');

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017";
const client = new MongoClient(uri);

app.use(cors());
app.use(express.json());

async function connectToMongo() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Could not connect to MongoDB", error);
  }
}

connectToMongo();

app.get('/api', (req, res) => {
  res.json({ message: 'Welcome to the Recipe Sharing API' });
});

app.get('/api/recipes', async (req, res) => {
  try {
    const database = client.db('recipe_sharing');
    const recipes = database.collection('recipes');
    const result = await recipes.find({}).toArray();
    res.json(result);
  } catch (error) {
    console.error('Error fetching recipes:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

process.on('SIGINT', async () => {
  await client.close();
  console.log('MongoDB connection closed');
  process.exit(0);
});
