import express from 'express';

const app = express();
const port = 3000;


app.get('/',(req,res) => {
    res.send('Name: James Santillan\nSection: IT4B\nCourse: BSIT');
});

//app.get('/:id',(req,res) => {
  //  const id = req.params.id;
    //console.log(`Recevied ID: ${id}`);
//});

//app.get('/foo',(req,res) => {
   /// console.log(req.query);
//});

//app.get('/hello/:name',(req,res) => {
  //  const name = req.params.name;
    //res.send(`Hello ${name.name}!`);
//});

app.get('IT',(req,res) => {
    const body = req.body.superhero;
    console.log(body);
}) 


app.listen(port, () => console.log(`Server is running at http://localhost:${port}`));

