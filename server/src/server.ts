import express, { Express, Request, Response } from 'express';
import { MongoClient, Db } from 'mongodb';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app: Express = express();
const port: number = parseInt(process.env.PORT || '3000', 10);

const uri: string = process.env.MONGODB_URI || "mongodb://localhost:27017";
const client: MongoClient = new MongoClient(uri);

app.use(cors());
app.use(express.json());

async function connectToMongo(): Promise<void> {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Could not connect to MongoDB", error);
  }
}

connectToMongo();

app.get('/api', (req: Request, res: Response) => {
  res.json({ message: 'Welcome to the Recipe Sharing API' });
});

app.get('/api/recipes', async (req: Request, res: Response) => {
  try {
    const database: Db = client.db('recipe_sharing');
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
