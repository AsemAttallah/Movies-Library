'use strict';
const express = require('express')
const movieData=require("./data.json");
const app = express()
const port = 3007


app.get('/',homeHandler)
function homeHandler(req,res){
    
    let movie1=new Movies(movieData.title,movieData.poster_path,movieData.overview);
    res.json(movie1);
}
function Movies(title,poster_path,overview){
    this.title=title;
    this.poster_path=poster_path;
    this.overview=overview;
}

app.get('/favorite',favoriteHandler)
function favoriteHandler(req,res){
    
    res.send('Welcome to Favorite Page');
}


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })

