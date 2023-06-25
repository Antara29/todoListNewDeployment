const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.set('view engine', 'ejs');
var inputs = [];
var workInputs = [];

app.get("/", function(req, res){
    var today = new Date();
    const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    // day = "";
    // if(today.getDay()===6 || today.getDay() === 0)
    // {
    //     day = "weekend";
    // }
    // else
    // {
    //     day = "weekday";
    // }

    //day = weekday[today.getDay()];
    var options = {
        weekday: "long",
        day: "numeric",
        month: "long"
    }
    var day = today.toLocaleDateString("en-US", options);
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