var express         = require("express"),
    app             = express(),
    mongoose        = require("mongoose"),
    bodyParser      = require("body-parser"),
    methodOverride  = require("method-override");

var Category    = require("./models/category"),
    User        = require("./models/user"),
    Post        = require("./models/post"),
    Comment     = require("./models/comment");

var passport        = require("passport"),
    LocalStrategy   = require("passport-local");

/*
Connecting to Database local Server - MongoDB
    cd C:/Program\ Files/MongoDB/Server/3.6/bin
    mongod --dbpath C:/Users/arun/mongo-data
    
Starting App Server
    node app.js

*/

mongoose.connect("mongodb://localhost/forum_v2");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");    
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));

//PASSPORT CONFIG
app.use(require("express-session")({
    secret: "Once again Rusty wins cutest dog!, Because for some random text",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser  = req.user;
    res.locals.error        = req.flash("error");
    res.locals.success      = req.flash("success");
    next();
});

//page having all category + 3 post of that category,.
app.get("/", function(req, res){
    res.render("index");
});

//=============
// USER
//=============
//Sign Up: page creating new user
app.get("/signup", function(req, res){
    res.render("signup");
});

app.post("/signup", function(req, res){
    res.send("Signup Post route");
});

//Log In: page creating new user
app.get("/login", function(req, res){
    res.render("login");
});

//all post related to that individual category
app.get("/category", function(req, res){
    Post.find({}, function(err, foundPosts){
        if(err){
            console.log(err);
        } else {
            res.render("category", { post: foundPosts });
        }
    });
});



//=============
// CATEGORY
//=============
//page creating new category
app.get("/category/new", function(req, res){
    res.render("new-category");
});

//sending newly created category name to database
app.post("/category", function(req, res){
    var category = req.body.category;
    Category.create(category, function(err, createdCategory){
        if(err){
            console.log(err);
        } else {
            res.redirect("category");
        }
    });
});

//=============
// POST
//=============
//New Post: page creating new post 
app.get("/post/new", function(req, res){
    Category.find({}, function(err, foundCategory){
        if(err){
            console.log(err);
        } else {
            res.render("post/new", { category: foundCategory });
        }
    });
});

//Create Post: sending newly created post to database
app.post("/post", function(req, res){
    var title       = req.body.title;
    var content     = req.body.content;
    var category    =  req.body.category;
    var vote        = 0;
    var newPost = { title: title, content: content, categories: category, vote: vote };

    Post.create(newPost, function(err, createdPost){
        if(err){
            console.log(err);
        } else {
            res.redirect("category");
        }
    });
});


//Show Post: page displaying post, their details, along with the comments
app.get("/post/:id", function(req, res){
    Post.findById(req.params.id, function(err, foundPost){
        if(err){
            console.log(err);
        } else {
            res.render("post/show", { post: foundPost });
        }
    });
});

//Edit Post
app.get("/post/:id/edit", function(req, res){

    Post.findById(req.params.id).populate("categories").exec(function(err, foundPost){
        if(err){
            console.log(err);
        } else {
            Category.find({}, function(err, foundCategory){
                if(err){
                    console.log(err);
                } else {
                    res.render("post/edit", { post: foundPost, category: foundCategory });
                }
            });
        }
    });
    // Post.findById(req.params.id, function(err, foundPost){
    //     if(err){
    //         console.log(err);
    //     } else {
    //         res.render("post/edit", { post: foundPost });
    //     }
    // });
});

app.put("/post/:id", function(req, res){
    var title       = req.body.title;
    var content     = req.body.content;
    var category    = req.body.category;
    var editedPost = { title: title, content: content, categories: category };
    // console.log(editedPost);
    // console.log("============================");
    Post.findByIdAndUpdate(req.params.id, editedPost, function(err, updatedPost){
        if(err){
            console.log(err);
        } else {
            // console.log(updatedPost);
            res.redirect("/post/" + req.params.id);
        }
    });
});


app.listen(process.env.PORT || 3000, function(){
    console.log("App running on PORT 3000");
});