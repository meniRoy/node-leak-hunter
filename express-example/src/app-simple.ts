// import express, { Express, Request, Response , Application } from 'express';
// import dotenv from 'dotenv';
// import { writeHeapSnapshot, writeHeapSnapshotWithGC } from './mem-log';

// //For env File 
// dotenv.config();
// const leak =[]
// class Leak {
//   someString ='help i am leaking'
// constructor(){
  
// }
// }

// const app: Application = express();
// const port = process.env.PORT || 8000;

// app.get('/', (req: Request, res: Response) => {
//   res.send('Welcome to Express & TypeScript ');
// });

// app.get('/leak', (req: Request, res: Response) => {
//   leak.push(new Leak())
//   res.send('Welcome to Express & TypeScript ');
// });

// app.get('/leak-req', (req: Request, res: Response) => {
//   leak.push(req)
//   res.send('Welcome to Express & TypeScript ');
// });

// app.get('/leak-hard', (req: Request, res: Response) => {
//   global[generateRandomString(10)] = generateRandomString(100)
//   res.send('Welcome to Express & TypeScript ');
// });


// app.get('/snap', (req: Request, res: Response) => {
//   writeHeapSnapshot()
//   res.send('Welcome to Express & TypeScript ');
// });

// app.get('/snap-gc', (req: Request, res: Response) => {
//   writeHeapSnapshotWithGC()
//   res.send('Welcome to Express & TypeScript ');
// });


// app.listen(port, () => {
//   console.log(`Server is Fire at http://localhost:${port}`);
// });

// function generateRandomString(length:number) {
//     const array = new Uint8Array(length);
//     crypto.getRandomValues(array);
//     return Array.from(array, (byte) => 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'[byte % 62]).join('');
// }
