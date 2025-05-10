import express from 'express'

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (_req:any, res:any) => {
  res.send('Hello ADDED CHANGES from TypeScript + Node.js on Render!');
});
 
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// function express() {
//     throw new Error("Function not implemented.");
// }

