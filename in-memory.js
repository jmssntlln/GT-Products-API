import express from 'express';

//PART 1
const app = express();
const port = 3000;

app.use(express.json());

let products = [
    {"id": 1, "name": "Phone", "price": 10000},
    {"id": 2, "name": "Tablet", "price": 2000},
    {"id": 3, "name": "Car", "price": 25000}
]

//PART 2 POST
//Endpoint to create a product
app.post('/products', (req, res) => {
    const newId = Math.max(...products.map(p => p.id)) + 1;

    const newProduct = {
        id: newId,
        name: req.body.name,
        price: req.body.price
    };

    products.push(newProduct);  
    res.status(201).json(newProduct);
});

app.get('/products', (req, res) => {
      res.status(200).json(products);
});

// app.get('/products/:id', (req, res) => {
//     const id = parseInt(req.params.id);
//     const searchProduct = products.find(product => product.id === id);
//     console.log(searchProduct);
//     // res.send(searchProduct.name); get name of the product
//     if (!searchProduct){
//         return res.status(404).json({message: "product not found"});
// } else {
// return res.status(200).json(searchProduct); // all the array
// }
//  });

//PART 3 PUT
app.put('/products/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const productIndex = products.findIndex(p => p.id === id);

    if (productIndex === -1){
        return res.status(404).json({message: "Product not found"})
    }

    products[productIndex].name = req.body.name;
    products[productIndex].price = req.body.price;

    res.status(200).json(products[productIndex]);
});

//PART 4 DELETE
app.delete('/products/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const productIndex = products.findIndex(p => p.id === id);

    if (productIndex === -1){
        return res.status(404).json({message: "Product not found"});
    }

    products.splice(productIndex, 1);
    res.status(204).send();
});

app.listen(port, () => console.log(`Server is running at http://localhost:${port}`));