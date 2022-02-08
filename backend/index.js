const express = require('express');
const mongoose = require('mongoose');
const bodyparser = require('body-parser');
const cookieParser = require('cookie-parser');
const db = require('./config/config').get(process.env.NODE_ENV);

const User = require('./models/user');
const Project = require('./models/project');
const { auth } = require('./middlewares/auth');
const routes = require('./routes/projectRoutes')
//const run = require('nodemon/lib/monitor/run');

const app = express()
const port = process.env.PORT || 3000
// app use
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
app.use(cookieParser());

// database connection
mongoose.Promise = global.Promise;
mongoose.connect(db.DATABASE,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log("database is connected");
    }).catch((err) => {
        console.log("could not connect to the database", err);
        process.exit();
    })

run()
async function run(){
    try{
        //const project = await Project.findById('61f52ff03f9d15cd3a7cd9dc')
        //const project = await Project.find({name:'Hexa'})
        //const project = await Project.deleteOne({name:'Hexa'})
        //console.log("project:", project)
        // const project = await Project.create({
        //     name: 'Hexa',
        //     description: 'This is the desc for project',
        //     startDate: Date('1-2-2022'),
        //     endDate: Date('15-2-2022')
        // })
        // console.log("project created successfully", project)
    
        // const user = await User.create({
        //     firstname: "John",
        //     lastname: "D",
        //     email: "john3@yopmail.com",
        //     password: "12345abc",
        //     password2:"12345abc",
        //     address: {
        //         street: 'main Street', 
        //         city:'CA'
        //     },
        //     createdAt: Date('15-2-2022')
        // })
        // console.log("user created successfully", user)

    }catch(e){
        console.log(e.message)
    }
}













app.get('/', function (req, res) {
    //res.status(200).send(`Welcome to login , sign-up api`);
    res.sendFile('index.html', { root: __dirname });
})

// adding new user (sign-up route)
app.post('/api/register', function (req, res) {
    // taking a user
    const newuser = new User(req.body);

    if (newuser.password != newuser.password2) return res.status(400).json({ message: "password not match" });

    User.findOne({ email: newuser.email }, function (err, user) {
        if (user) return res.status(400).json({ auth: false, message: "email exits" });

        newuser.save((err, doc) => {
            if (err) {
                console.log(err);
                return res.status(400).json({ success: false });
            }
            res.status(200).json({
                succes: true,
                user: doc
            });
        });
    });
});

// login user
app.post('/api/login', function(req,res){
    let token = req.cookies.auth;
    User.findByToken(token,(err,user)=>{
        if(err) return  res(err);
        if(user) return res.status(400).json({
            error :true,
            message:"You are already logged in"
        });
    
        else{
            User.findOne({'email':req.body.email},function(err,user){
                if(!user) return res.json({isAuth : false, message : ' Auth failed ,email not found'});
        
                user.comparepassword(req.body.password,(err,isMatch)=>{
                    if(!isMatch) return res.json({ isAuth : false,message : "password doesn't match"});
        
                user.generateToken((err,user)=>{
                    if(err) return res.status(400).send(err);
                    res.cookie('auth',user.token).json({
                        isAuth : true,
                        id : user._id,
                        email : user.email
                    });
                });    
            });
          });
        }
    });
});

// get logged in user
app.get('/api/profile',auth,function(req,res){
    res.json({
        isAuth: true,
        id: req.user._id,
        email: req.user.email,
        name: req.user.firstname + req.user.lastname
        
    })
});

//logout user
app.get('/api/logout',auth,function(req,res){
    req.user.deleteToken(req.token,(err,user)=>{
        if(err) return res.status(400).send(err);
        res.sendStatus(200);
    });

}); 

//project routes
app.use(routes)

// listening port
app.listen(port, () => {
    console.log(`Now listening on port ${port}`);
}); 