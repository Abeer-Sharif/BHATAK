if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const express = require('express')
const app = express()
const mongoose = require('mongoose')
const path=require('path')
const methodOverride = require("method-override")
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/error.js');
const listingRouter = require('./routes/listing.js');
const reviewRouter = require('./routes/review.js');
const userRouter = require('./routes/user.js');
const session = require('express-session');
const {MongoStore} = require("connect-mongo");
const flash = require('connect-flash');
const cookieParser = require("cookie-parser");
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user.js');
const dbUrl = process.env.MONGO_URL;





app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret:  process.env.SECRET
    },
    touchAfter: 24 * 3600,
});

store.on('error', () => {
    console.log("Error in Mongo Store.", err);
});

app.use(session({
    store: store,
    secret: process.env.SECRET ,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly:true
    }
}));


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(flash());
app.use((req, res, next) => {
    //  console.log("CURRENT USER:", req.user);
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})
// app.use((req, res, next) => {
//     console.log(req.method, req.originalUrl);
//     next();
// });

// app.get('/', (req, res) => {
//     res.send('root page')
// });
app.get("/", (req, res) => {
    res.redirect("/listings");
});
app.use("/listings", listingRouter);
app.use('/listings/:id/reviews', reviewRouter);
app.use('/',userRouter)




app.all('/*splat',(req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
})

app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong" } = err;
    res.status(statusCode).render('error.ejs',{err})
    //res.status(statusCode).send(message);
});

async function startServer() {
    try {
        await mongoose.connect(dbUrl);
        console.log("connected to db");
        app.listen(8080, () => {
        console.log("server is running on port 8080")
});
    }catch (error) {
        console.log("error connecting to database:", error);
    }
};
startServer();
    




