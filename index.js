const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const passport = require('passport');
const cookieSession = require('cookie-session')
require('./passport-setup');
//const mongoose = require('mongoose');
const path = require('path');



// mongoose.connect('mongodb://localhost:27017/api', { useNewUrlParser: true, useUnifiedTopology: true })
//     .then(() => {
//         console.log('Mongo Connection Open');
//     })
//     .catch(err => {
//         console.log("oh no error")
//         console.log(err)
//     })

app.set('view engine', 'ejs');
app.use(express.json())
app.use('/java', express.static(path.resolve(__dirname, 'java/')))
app.use('/views', express.static(path.resolve(__dirname, 'views/')))

app.use(cors())

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// For an actual app you should configure this with an experation time, better keys, proxy and secure
app.use(cookieSession({
    name: 'tuto-session',
    keys: ['key1', 'key2']
}))

// Auth middleware that checks if the user is logged in
const isLoggedIn = (req, res, next) => {
    if (req.user) {
        next();
    } else {
        res.sendStatus(401);
    }
}

// Initializes passport and passport sessions
app.use(passport.initialize());
app.use(passport.session());

// Example protected and unprotected routes
app.get('/', (req, res) => {
    res.render('home')
})
app.get('/failed', (req, res) => res.send('You Failed to log in!'))

// In this route you can see that if the user is logged in u can acess his info in: req.user
app.get('/connect', isLoggedIn, (req, res) => {
    res.render('connect')
})

app.get('/main', isLoggedIn, (req, res) => {
    res.render('main')
})
app.get('/video', isLoggedIn, (req, res) => {
    res.render('video')
})
// Auth Routes
app.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] })),

    app.get('/google/callback', passport.authenticate('google', { failureRedirect: '/failed' }),
        function (req, res) {
            // Successful authentication, redirect home.
            res.redirect('/connect');
        }
    );

app.get('/logout', (req, res) => {
    req.session = null;
    req.logout();
    res.redirect('/');
})

app.listen(3000, () => console.log(`Example app listening on port ${3000}!`))