const express = require('express'); // Used to create the server
const path = require('path'); // File locations
const bodyParser = require('body-parser'); // Send and recieve data
const knex = require('knex'); // Database access
const session = require('express-session');

const db = knex({
    client: 'pg',
    connection: {
        host: '127.0.0.1', // loopback address if online would be the server host ip
        user: 'postgres', // user that the database is stored on
        password: 'Amiga109', // db password
        database: 'istlogins' // define what data base to parse to
    }
});

const app = express();

let initialPath = path.join(__dirname, "public");
app.use(bodyParser.json());
app.use(express.static(initialPath));

app.use(session({
    secret: 'key that will sign cookie',
    resave: false,
    saveUninitialized: false,
}));

app.get("/", (req, res) => {
    res.sendFile(path.join(initialPath, "main.html"));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(initialPath, "login.html"));
});

app.get('/signup', (req, res) => {
    res.sendFile(path.join(initialPath, "signup.html"));
});

app.get('/forgor', (req, res) => {
    res.sendFile(path.join(initialPath, "forgor.html"));
});

app.post('/signup-user', (req, res) => {
    const { username, password } = req.body;

    // Inserts data in the database
    if (!username.length || !password.length) {
        res.json("All fields must be filled");
    } else {
        db("users").insert({
            name: username,
            password: password
        }).returning("name").then(data =>{
            res.json(data[0]);
        }).catch(err => {
            if (err.detail.includes('already exists')) {
                res.json('Username already exists');
            }
        })
    }
});

app.post('/login-user', (req, res) => {
    const { username, password } = req.body;

    db.select('name').from('users').where({
        name:username,
        password:password
    }).then(data => {
        if(data.length) {
            res.json(data[0]);
        } else {
            res.json('Email or password is incorrect');
        }
    })
});

app.listen(3000, (req, res) => {
    console.log('listening on port 3000');
});






//------Bibliograph------
//https://www.npmjs.com/package/connect-pg-simple
//https://www.youtube.com/watch?v=TDe7DRYK8vU
//https://www.youtube.com/watch?v=I3ZNqmPBOPQ
//https://www.youtube.com/watch?v=RAFZleZYxsc
//https://www.youtube.com/watch?v=0EBkVzIBnoc