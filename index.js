require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
// const date = require(__dirname+"/date.js");
const mongoose = require("mongoose");

const app = express();
const _ = require("lodash");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.set('view engine', 'ejs');

// mongoose.connect("mongodb://localhost:27017/todolistDB");
mongoose.set('strictQuery', false);
const connectDB = async ()=>{
    try{
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB Connected");
    } catch(error){
        console.log(error);
    }
}

const itemsSchema = mongoose.Schema({
    name: String
});

const Item = mongoose.model("Item", itemsSchema); 

const listSchema = mongoose.Schema({
    name: String,
    items: [itemsSchema]
});
const List = mongoose.model("List", listSchema);

// var inputs = [];
// var workInputs = [];
const item1 = new Item({ name: "Watering plants"});

const item2 = new Item({name: "Studying"});

const item3 = new Item({name: "Eating"});

const defaultItems = [item1, item2, item3];

// Item.insertMany(defaultItems);

// app.get("/", function(req, res){
//     Item.find({}, function(err, foundItems){
//         res.render("list", {kindOfDay: "Today", newItem: foundItems});
//     });
    
// })

app.get("/", function(req, res){
    Item.find({}).then(function(foundItems){
        if(foundItems.length===0){
            Item.insertMany(defaultItems);
            res.redirect("/");
        }
        else{
            res.render("list", {kindOfDay: "Today", newItem: foundItems});

        }
    }).catch(function(err){
        console.log(err);
    })
})

app.get("/:customListName", function(req, res){
    const customListName = _.capitalize(req.params.customListName);
    List.findOne({name: customListName}).then(function(foundItem){
        if(!foundItem){
            const list = new List({
                name: customListName,
                items: defaultItems
            });
            list.save();
            res.redirect("/"+customListName);
        }
        else{
            res.render("list", {kindOfDay: customListName, newItem: foundItem.items});
        }
    })
    
})

// app.get("/work", function(reqq, ress){
//     var title = "Work List";
//     ress.render("list", {kindOfDay: title, newItem: items});
// })

// app.get("/about", function(req, res){
//     res.render("about");
// })

app.post("/", function(request, response){
    var input = request.body.t1;
    const listName = request.body.button;

    const item = new Item({name: input});
    if(listName === "Today"){
        item.save().then(() => {
            response.redirect("/");
        }).catch((err) => {
            console.log(err);
        });
    }
    else{
        List.findOne({name: listName}).then(function(foundList){
            foundList.items.push(item);
            foundList.save();
            response.redirect("/"+listName);
        }).catch(function(err){
            console.log(err);
        })
    }

    
   
})
app.post("/delete", function(req, res){
    const checkedItemId = req.body.checkbox;
    const listName = req.body.hidden;

    if(listName === "Today"){
        Item.deleteOne({_id: checkedItemId}).then(function(){
            console.log("Item successfully deleted");
            res.redirect("/");
        }).catch(function(err){
            console.log(err);
        });
    }
    else{
        List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemId}}}).then(function(foundList){
            res.redirect("/" + listName);
        }).catch(function(err){
            console.log(err);
        })
    }
    

})
// app.post("/work", function(req, res){
//     var workInput = req.body.t1;
//     workInputs.push(workInput);
//     res.redirect("/work");
    
// })
let port = process.env.PORT;
if(port == null || port ==""){
    port = 3000;
}

connectDB().then(() => {
    app.listen(port, function(){
        console.log("Server running on port 3000");
    })
});