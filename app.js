const express = require("express");
const ejs = require("ejs");
const bParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.set('view engine', 'ejs');

app.use(bParser.urlencoded({
    extended: true
}));

app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB");

const articleSchema = {
    title: String,
    content: String
}

const Article = mongoose.model("Article", articleSchema);

app.route("/articles")
    .get((req, res) => {
        Article.find().then((result, err) => {
            if (err) {
                res.send(err);
            } else {
                res.send(result);
            }
        });
    })
    .post((req, res) => {
        const title = req.body.title
        const content = req.body.content
        const newArticle = new Article({
            title: title,
            content: content
        });
        newArticle.save().then((result, err) => {
            if (err) {
                res.send(err);
            } else {
                res.send(result);
            }
        });
    })
    .delete((req, res) => {
        Article.deleteMany().then((result, err) => {
            if (err) {
                res.send(err);
            } else {
                res.send(result);
            }
        });
    });

app.route("/articles/:articleName")
    .get((req, res) => {
        const nameOfArticle = req.params.articleName
        Article.findOne({ title: nameOfArticle }).then((result, err) => {
            if (err) {
                res.send("Article not found")
            } else {
                res.send(result)
            }
        })
    })
    .put((req, res) => {
        const nameOfArticle = req.params.articleName
        const content = req.body.content
        const title = req.body.title
        Article.findOneAndUpdate(
            {title: nameOfArticle}, 
            {title: title, content: content}, 
            {overwrite: true})  
            .then((result, err)=>{
                if(!err){
                    res.send("Sccuessfully Updates")
                }
            })
    })
    .patch((req, res)=>{
        const nameOfArticle = req.params.articleName
        Article.findOneAndUpdate(
            {title: nameOfArticle},
            {$set: req.body},
        ).then((result, err)=>{
            if(!err){
                res.send("Sccuessfully Updates")
            }
        })
    });

app.listen(3000, () => {
    console.log("Server is running http://localhost:3000");
});