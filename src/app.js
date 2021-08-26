const express = require('express');
const hbs = require("hbs");
const path = require('path');

const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/akshitdynamic', {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology:true
}).then(() =>{
    console.log("connection successful");
}).catch((error) =>{
    console.log(error);
})


const validator = require("validator")

const userSchema = mongoose.Schema({
    name:{
        type:String,
        required:true,
        minlength:3
    },

    email:{
       type:String,
       required:true,
    },
    phone:{
        type:Number,
        required:true,
        min:10
    },

    message:{
        type:String,
        required:true,
        minlength:3
    }
})

// we need a collection

const User = mongoose.model("User", userSchema);

const port = process.env.PORT || 8000;
const app = express();

const staticpath = path.join(__dirname, "../public")
const templatespath = path.join(__dirname, "../templates/views")
const partialpath = path.join(__dirname, "../templates/partial")

app.use('/css', express.static(path.join(__dirname, "../node_modules/bootstrap/dist/css")))
app.use('/js', express.static(path.join(__dirname, "../node_modules/bootstrap/dist/js")))
app.use('/jq', express.static(path.join(__dirname, "../node_modules/jquery/dist")))

app.use(express.urlencoded({extended:false}))
app.use(express.static(staticpath))

app.set('view engine', 'hbs')
app.set("views", templatespath)
hbs.registerPartials(partialpath)


//routing

app.get('/', (req, res) =>{
    res.render("index")
})


app.post('/contact', async(req, res) =>{
    try{
        console.log(req.body)
        // res.send(req.body);
        const userData = new User(req.body);
         await userData.save();
         res.status(201).render('index');
    } catch (error){
        res.status(500).send(error);
    }

})

app.listen(port, () =>{
    console.log(`server is running at ${port}`)
})