const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname+"/date.js");

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.set('view engine', 'ejs');
var inputs = [];
var workInputs = [];

app.get("/", function(req, res){
    //let day = date();
    let day = date.getDate();
    //let day = date.getDay();
    res.render("list", {kindOfDay: day, newItem: inputs});
})

app.get("/work", function(reqq, ress){
    var title = "Work List";
    ress.render("list", {kindOfDay: title, newItem: workInputs});
})

app.get("/about", function(req, res){
    res.render("about");
})

app.post("/", function(request, response){
    var input = request.body.t1;
    if(request.body.button === "Work"){
        workInputs.push(input);
        response.redirect("/work");
    }
    else{
        inputs.push(input);
        // response.render("list", {newItem: input});
        response.redirect("/");
    }
   
})

app.post("/work", function(req, res){
    var workInput = req.body.t1;
    workInputs.push(workInput);
    res.redirect("/work");
    
})

app.listen(3000, function(){
    console.log("Server running on port 3000");
})