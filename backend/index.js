const express = require('express');
const mongoose= require('mongoose');
const bodyparser=require('body-parser');
const cookieParser=require('cookie-parser');
const db=require('./config/config').get(process.env.NODE_ENV);

const app = express()
const port = process.env.PORT||5000
// app use
app.use(bodyparser.urlencoded({extended : false}));
app.use(bodyparser.json());
app.use(cookieParser());

// database connection
mongoose.Promise=global.Promise;
mongoose.connect(db.DATABASE,
    { 
        useNewUrlParser: true,
        useUnifiedTopology:true 
    })
.then(()=>{
    console.log("database is connected");
}).catch((err)=>{
    console.log("could not connect to the database", err);
    process.exit();
})


app.get('/', function (req, res) {
    //res.status(200).send(`Welcome to login , sign-up api`);
    res.sendFile('index.html', {root: __dirname});
  })

  // listening port
  app.listen(port, () => {
    console.log(`Now listening on port ${port}`);
}); 