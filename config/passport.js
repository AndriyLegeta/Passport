let passport = require('passport');
let User = require('../models/User');
let LocalStrategy = require('passport-local').Strategy;

passport.serializeUser(function (user, done) {  // як записувати дані в сесію, done як return  завершує
    return done(null, user._id); // done(1(аргумент) - помилка, 2(аргумент) - обєкт що записуємо - ! краще записувати одну властивість обєкта)
});

passport.deserializeUser(async function (id, done) { // як зчитувати дані з сесії
    try {
        let user = await User.findById(id);
        if(user){
            return done(null, user);
        }else {
            return done(null, false);  // якщо нема юзера і помилки то передаємо false
        }
    }catch (e) {
        return done(e);            // передаєм помилку яка сталася
    }
});

passport.use('register', new LocalStrategy(
    {                               // обєкт з настройками, добуває вказані нами дані і передає в функцію
        userNameField: 'login',
        passwordField: 'password',
        passReqToCallback: true  // якщо треба req.body , тоді перший аргумент - req
    },
    async function (req, login, password, done) {//по login  який прийшов шукаємо скільки в нас є юзерів
        try {
            let alreadyExist = await User.count({login});
            if(alreadyExist){
                return done(null, false);    // помилки нема але і юзера неможна реєструвати
            }else {
                let user = await User.create({login, password}); // створюємо юзера передаємо йому login, password
                return done(null, user);
            }
        }catch (e) {
            return done(e);            // передаєм помилку яка сталася
        }
    }
));



passport.use('login', new LocalStrategy(
    {                               // обєкт з настройками, добуває вказані нами дані і передає в функцію
        userNameField: 'login',
        passwordField: 'password',
        passReqToCallback: true  // якщо треба req.body , тоді перший аргумент - req
    },
    async function (req, login, password, done) {//по login  який прийшов шукаємо скільки в нас є юзерів
        try {
            let user = await User.findOne({login, password});
            if(user){
                return done(null, user);
            }else{
                return done(null, false);
            }
        }catch (e) {
            return done(e);            // передаєм помилку яка сталася
        }
    }
));