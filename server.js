const { request } = require('express');
const express = require('express')
const app = express()


//database connection
var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'ProjectDB'
});
 try {
connection.connect();
console.log('connection successful');
 } catch (error) {
    console.log('error connecting');s
 };



app.get('/api/Flowers/', (req, res) => {
    connection.query("SELECT * FROM Flowers", function (err, result, fields) {
        if (err) throw err;
        console.log(result)
  res.json(result);
    });
});

// GET method route
app.get('/api/Flowers/', (req, res) => {
  res.send('GET request to the homepage')
})

// GET by id method route
app.get('/api/Flowers/:id', (req, res) => {
    const id = req.params.id
    console.log(id)
    connection.query("SELECT * FROM products WHERE id =?", [id], function (err, result, fields) {
        if (err) throw err;
        console.log(result);
  res.json(result); 
})
});

// POST method route
app.post('/api/Flowers/', (req, res) => {
    const prod = {
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        image: req.body.image,
        active: req.body.type
    }
    connection.query("INSERT Flowers SET ?", prod, function (err,result, fields) {
        if (err) throw err;
        console.log(result);
  res.json(prod);
})

})

// PATCH method route
app.patch('/api/Flowers/', (req, res) => {

  const id = req.body.id;
    const prod = { 
        id: req.body.id,
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        image: req.body.image,
        active: req.body.type
    }
    connection.query("UPDATE Flowers SET ? WHERE id=?",  [prod,id], function (err, result, fields) {
        if (err) throw err;
        console.log(result.affectedRows + "Updated");
        console.log(result);
  res.json(prod);
})
});

// DELETE method route
app.delete('/api/Flowers/:id', (req, res) => {
  res.send('DELETE request to the homepage')
})

app.use(express.json());
app.listen(8080);