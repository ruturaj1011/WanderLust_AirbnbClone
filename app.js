const express = require("express");
const app = express();

const mongoose = require("mongoose");
const mongoURL = "mongodb://127.0.0.1:27017/wanderlust";
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingRouter = require("./routes/listings.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

async function main(){
    await mongoose.connect(mongoURL);
}

main()
.then( () => {
    console.log("Connected to DB");
})
.catch( (err) => {
    console.log(err);
});


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded( {extended : true} ));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

const sessionOptions = {
    secret : "mysupersecretcode",
    resave : false,
    saveUninitialized : true,
    cookie : {
        expires : Date.now() + 7 * 24 * 60 * 60 * 1000, //age in mili secs
        maxAge : 7 * 24 * 60 * 60 * 1000,
        httpOnly : true,
    },
}


app.get("/", (req, res) => {
    res.send("Hi, i am root");
});


app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});


// listing routes
app.use("/listings", listingRouter);

// review routes
app.use("/listings/:id/reviews", reviewRouter);

//user routes
app.use("/user", userRouter);


app.all("*", (req,res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
});


app.use( (err, req,res, next) => {
    
    let {status = 404, message = "Something went WRONG!"} = err;

    // res.status(status).send(message);
    res.status(status).render("listings/error.ejs", {message});
});


app.listen(8080, () => {
    console.log("server is listening to port 8080");
});