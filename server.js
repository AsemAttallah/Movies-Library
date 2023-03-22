'use strict';
const express = require('express')
const cors = require('cors')
const axios = require('axios');
require('dotenv').config();
const movieData=require("./data.json");
const app = express()
app.use(cors());
const port = process.env.PORT
const apikey = process.env.API_KEY

// routs
app.get('/',homeHandler)
app.get('/favorite',favoriteHandler)
app.get('/trending',trendingHandler)
app.get('/search',searchHandler)
app.get('/discover',discoverHandler)
app.get('/genre',genreHandler)

app.get('*',handleError)

function homeHandler(req,res){
    
    let movie1=new Movies(movieData.title,movieData.poster_path,movieData.overview);
    res.json(movie1);
}


function favoriteHandler(req,res){
    
    res.send('Welcome to Favorite Page');
}

function trendingHandler(req,res){
    let url=`https://api.themoviedb.org/3/trending/all/week?api_key=${apikey}&language=en-US`;
  axios.get(url)
  .then((result)=>{
    let dataTrending=result.data.results.map((results)=>{
        return new Trending(results.id,results.title,results.release_date,results.poster_path,results.overview)
    })
    res.json(dataTrending);
  })
  .catch((err)=>{
    console.log(err);
  })

}

function searchHandler(req,res){
  let movieName=req.query.name
  let url=`https://api.themoviedb.org/3/search/movie?api_key=${apikey}&query=${movieName}`;
  axios.get(url)
    .then((result)=>{
        let response=result.data.results;
        res.json(response);
        })
      
    .catch((err)=>{
      console.log(err);
   })
}

function discoverHandler(req,res){
  let url=`https://api.themoviedb.org/3/discover/movie?api_key=${apikey}`;
axios.get(url)
.then((result)=>{
  let dataDiscover=result.data.results.map((results)=>{
      return new Discover(results.title,results.release_date,results.overview)
  })
  res.json(dataDiscover);
})
.catch((err)=>{
  console.log(err);
})

}

function genreHandler(req,res){
  let url=`https://api.themoviedb.org/3/genre/movie/list?api_key=${apikey}&language=en-US`;
axios.get(url)
.then((result)=>{
  let dataGenre=result.data.genres.map((results)=>{
      return new Genre(results.id,results.name)
  })
  res.json(dataGenre);
})
.catch((err)=>{
  console.log(err);
})

}


function handleError(req,res){
    
    res.status(404).send('Not found');
}

// constructor
function Movies(title,poster_path,overview){
    this.title=title;
    this.poster_path=poster_path;
    this.overview=overview;
}

function Trending(id,title,release_date,poster_path,overview){
    this.id=id;
    this.title=title;
    this.release_date=release_date;
    this.poster_path=poster_path;
    this.overview=overview;
}

function Discover(title,release_date,overview){
  this.title=title;
  this.release_date=release_date;
  this.overview=overview;
}

function Genre(id,name){
  this.id=id;
  this.name=name;
}

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })

