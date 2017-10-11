const express= require('express');
const bodyParser=require('body-parser');
const path=require('path');
var cors =require('cors');
const route=require('./routes/route')
const port =3000;
const passport = require('passport');
const mongoose = require('mongoose');
const config = require('./config/database');
const app=express();
const users = require('./routes/users');

var i = -1;
// const mongoose=require('mongoose');

//database connection
mongoose.Promise = global.Promise;
mongoose.connect(config.database);

//connect to mongodb
mongoose.connect('mongodb://localhost:27017/toybox');


//on mongo connection
mongoose.connection.on('connected',()=>{
    console.log('connected to mongodb');
})

mongoose.connection.on('error',(err) =>{
    if(err){
        console.log('error in connection is :'+err)
    }
});

app.use(express.static(path.join(__dirname,'dist')));

app.use(bodyParser.urlencoded({extended:true}));
//set static folder 
app.use(express.static(path.join(__dirname , 'public')));
app.use(bodyParser.json());
app.use(cors());
//Body parser middleware 
// parses / grabs incoming form data etc ...
app.use(bodyParser.json());
app.use('/users',users);

//Passport middleware
app.use(passport.initialize());
app.use(passport.session());


require('./config/passport')(passport);

app.use('/api',route);

app.get('/',(req,res) =>{
    res.sendFile(path.join(__dirname,'dist/index.html'));
});




app.listen(port,function(){
    console.log("server running on localhost:"+port);
});

//index route
app.get('/', (req,res)=> {
res.send('Invalid Endpoint !');
});


