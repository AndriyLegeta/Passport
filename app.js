// встановлюємо -   npm i passport passport-local
const express = require('express');
const path = require('path');
let session = require('express-session');
let mongoose = require('mongoose');
let User = require('./models/User');
require('./config/passport');  // відкриє файл passport.js  і почне його виконувати
let passport = require('passport'); // оскільки обєкти кешуються то passport прийде з кеша НАПОВНЕНИЙ (виконаний попередньою командою)

mongoose.connect('mongodb://localhost:27017/test', {useNewUrlParser: true});
const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(session({    // включаємо сесію
    secret: 'frir90gir0',
    saveUninitialized:false,  // saveUninitialized,  resave -  відповідають за те щоб перезаписувати сесію, ставимо false
    resave:false
}));

app.use(passport.initialize()); // після огололшення сесії треба включити паспорт
app.use(passport.session());   // після цього можна використовувати стратегії

app.get('/', (req, res)=>{
    res.render('idex',{
        user: req.user  //передаєм дані в файл idex
    })
});

app.post('/register', passport.authenticate('register'), async (req, res)=>{ // після назви стратегії можна передавати {} з опціями (шо станеться коли виконано і коли помилка)
    res.redirect('/');
});                            // passport.authenticate('register')  наша стратегія з passport.js

app.post('/login', passport.authenticate('register'), async (req, res)=>{
    res.redirect('/');
});

app.get('/logout', (req, res)=>{
    req.logout();
    res.redirect('/');
});

app.get('/admin', (req, res)=>{
    if(req.isAuthenticated()){ // isAuthenticated  - верне true  якщо юсер залогінений, захищаємо наші запити через строку
        res.render('admin')
    }else {
        res.redirect('/');
    }});

app.listen(8000, (err)=>{
    console.log('LISTENING !');
});
