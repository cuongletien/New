// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express");
const shortid = require('shortid')
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const app = express();
const adapter = new FileSync('db.json')
const db = low(adapter)
db.defaults({ books: [] }).write()

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'pug');
app.set('views', './views');

app.get('/', (req, res) => res.render('index', { books: db.get('books').value() }));

app.get('/add', (req, res) => {
    res.render('add');
});
app.post('/add', (req, res) => {
    let name = req.body.name;
    let description = req.body.description;
    db.get('books').push({ id: shortid.generate(), name: name, description: description}).write();
    res.redirect('/')
});
app.get('/update/:id', (req, res) => {
    let id = req.params.id;
    let book = db.get('books').find({ id: id }).value();
    res.render('update', {
        book
    });
});

app.put('/update/:id', (req, res) => {
    let id = req.body.id;
    let name = req.body.name;
    let description = req.body.description;
    let book = db.get('books').find({ id: id }).value();
    db.get('books')
    .find({ id: id })
    .assign({ name:name })
    .write()
    res.redirect('/books')
});

app.get('/:id', (req, res) => {
    let id = req.params.id;
    let todo = db.get('books').find({ id: id }).value();
    db.get('books').remove({id: id}).write();
    res.redirect('/')
});

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
