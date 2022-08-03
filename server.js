const express = require('express'); // Used to create the server
const app = express();
const path = require('path'); // File locations
const bodyParser = require('body-parser'); // Send and recieve data
const knex = require('knex'); // Database access
const bcrypt = require('bcryptjs'); // Encription for passwords
const session = require('express-session');
//const { rejects } = require('assert');
const knexSessionStore = require('connect-session-knex')(session);

// Creates reference to database 
const db = knex({
    client: 'pg',
    connection: {
        host: '127.0.0.1', // loopback address if online would be the server host ip
        user: 'postgres', // user that the database is stored on
        password: 'Amiga109', // db password
        database: 'istlogins' // define what data base to parse to
    }
});

// Pre-emptively creates store to contain database connection info 
const store = new knexSessionStore({
    knex: db,
    tablename: 'sessions', 
    sidfieldname: 'sid',
    createtable: true,
});

// Handels url pathing
let initialPath = path.join(__dirname, "public");
app.use(bodyParser.json());
app.use(express.static(initialPath));

// Creates session cookie
app.use(
    session({
        secret: 'key that will sign cookie',
        resave: false,
        saveUninitialized: false,
        store: store,
    }
));

const isAuth = (req, res, next) => {
    if(req.session.isAuth) {
        next();
    } else {
        res.redirect('/login');
    }
}

// =========== { Web Pages } =========== \\

app.get('/', (req, res) => {
    res.sendFile(path.join(initialPath, "./html/index.html"));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(initialPath, "./html/login.html"));
});

app.get('/signup', (req, res) => {
    res.sendFile(path.join(initialPath, "./html/signup.html"));
});

app.get('/forgor', (req, res) => {
    res.sendFile(path.join(initialPath, "./html/forgor.html"));
});

app.get('/dashboard', isAuth, (req, res) => {
    res.sendFile(path.join(initialPath, "./html/dashboard.html"));
});

// =========== { Database referencing } =========== \\

app.post('/signup-user', async (req, res) => {
    const { username, password } = req.body;
    // Inserts data in the database
    if (!username.length || !password.length) {
        res.json("All fields must be filled");
    } else {
        const hashedPsw = await bcrypt.hash(password, 12);
        db("users").insert({
            name: username,
            password: hashedPsw
        }).returning("name").then(data =>{
            res.json(data[0]);
        }).catch(err => {
            if (err.detail.includes('already exists')) {
                res.json('Username already exists');
            }
        });
    }
});

app.post('/login-user', (req, res) => {
    const { username, password } = req.body;
    
    if (!username.length || !password.length) {
        res.json("All fields must be filled");
    } else {
        db.select('password').from('users').where({ name:username, }).then(async data => {

            const isMatch = await bcrypt.compare(password, data[0].password);

            if(isMatch && data.length) {
                req.session.isAuth = true;
                res.redirect('/dashboard');
            } else {
                res.json('Email or password is incorrect');
            }
        });
    }
});

app.post('/logout-user', (req, res) => {
    req.session.destroy((err => {
        if(err) throw err;
        res.redirect('/login');
    }));
});

app.post('/add-password', (req, res) => {
    const { id, url, username, password } = req.body;

    if (!username.length || !password.length && !url.length) {
        res.json("All fields must be filled");
    } else {
        db("userdata").insert({
            id: id, 
            url: url,
            username: username,
            password: password
        }).returning("name").then(data =>{
            res.json(data[0]);
        }).catch(err => {
            if (err.detail.includes('already exists')) {
                res.json('Username already exists');
            }
        });
    }
});

// Starts local server on port 3000
app.listen(3000, (req, res) => {
    console.log('listening on port 3000');
});






//------Bibliography------
//https://www.youtube.com/watch?v=lkDrG7G77Fg
//https://www.npmjs.com/package/connect-pg-simple
//https://www.youtube.com/watch?v=TDe7DRYK8vU
//https://www.youtube.com/watch?v=I3ZNqmPBOPQ
//https://www.youtube.com/watch?v=RAFZleZYxsc
//https://www.youtube.com/watch?v=0EBkVzIBnoc