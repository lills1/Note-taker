const { application } = require('express');
const express = require('express');
const PORT = process.env.PORT || 3001;
const app = express();
const fs = require('fs');
const path = require('path');
const db = require('./db/db.json');
//public becomes local host 
app.use(express.static('public'))
//parses the data from client through middleware back to original json form
app.use(express.urlencoded({
    extended: true
}))
//
app.use(express.json())

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, './public/index.html'))
})

app.get('/notes', function (req, res) {
    res.sendFile(path.join(__dirname, './public/notes.html'))
})

app.get('/api/notes', function (req, res) {
    res.json(db)
})

app.delete(`/api/notes/:id`, function (req, res) {
    //console.log(req);
    //extract the ID /index to delete from  req.params['id']
    console.log(`id is:${req.params['id']}`);
    console.log(`orig db is:${db}`);
    //check if index exists (if not do nothing)
    if (db.length > req.params['id']) {
        db.splice(req.params['id'], 1);
        fs.writeFileSync('./db/db.json', JSON.stringify(db, null, 2))
        res.json(db)
    }
})


app.post('/api/notes', function (req, res) {
    console.log(req.body)
    db.push(req.body)
    fs.writeFileSync('./db/db.json', JSON.stringify(db, null, 2))
    res.json(db)
})

app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, './public/index.html'))
})

app.listen(PORT, function () {
    console.log('app is listening on port', PORT)
})