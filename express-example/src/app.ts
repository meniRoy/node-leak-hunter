import express, { Express, Request, Response, Application } from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cron from 'node-cron';
import { writeHeapSnapshot, writeHeapSnapshotWithGC } from './mem-log';
import crypto from 'crypto';

// For env File 
dotenv.config();
const leak = [];

class Leak {
  someString = 'help i am leaking';
  constructor() {}
}

const app: Application = express();
const port = process.env.PORT || 8000;

// MongoDB setup
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/leakDb';
mongoose.connect(mongoURI)
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("Could not connect to MongoDB:", err));

// Define a simple schema and model for demonstration
const ItemSchema = new mongoose.Schema({
  name: String,
  description: String,
}, { timestamps: true });

const Item = mongoose.model('Item', ItemSchema);

// Middleware
app.use(express.json()); // Parse JSON requests

// Endpoints

app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to Express & TypeScript with MongoDB');
});

// Leak endpoints
app.get('/leak', (req: Request, res: Response) => {
  leak.push(new Leak());
  res.send('Memory leak added');
});

app.get('/leak-req', (req: Request, res: Response) => {
  leak.push(req);
  res.send('Request added to leak array');
});

app.get('/leak-hard', (req: Request, res: Response) => {
  (global as any)[generateRandomString(10)] = generateRandomString(100);
  res.send('Hard leak created');
});

app.get('/snap', (req: Request, res: Response) => {
  writeHeapSnapshot();
  res.send('Heap snapshot taken');
});

app.get('/snap-gc', (req: Request, res: Response) => {
  writeHeapSnapshotWithGC();
  res.send('Heap snapshot with GC taken');
});

// CRUD Endpoints for MongoDB

// Create a new item
app.post('/items', async (req: Request, res: Response) => {
  try {
    const newItem = new Item(req.body);
    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

// Read all items
app.get('/items', async (req: Request, res: Response) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// Background Job using node-cron
// This job runs every minute and logs a message
cron.schedule('*/10 * * * * *', async () => {
  console.log("Background job running every 10 seconds before");

  try {
    const newItem = new Item({ name: generateRandomString(50), description: generateRandomString(10) });
    const savedItem = await newItem.save();
    console.log("Background job running every 10 seconds after save", savedItem);
  } catch (error) {
    console.error("Error in background job:", error);
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

function generateRandomString(length:number) {
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    return Array.from(array, (byte) => 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'[byte % 62]).join('');
}
