'use strict';
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const axios = require('axios');
require('dotenv').config();
const movieData=require("./data.json");
const app = express()
app.use(cors());
const port = process.env.PORT
const apikey = process.env.API_KEY
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
const { Client } = require('pg')
let url=process.env.URL
const client = new Client(url)

// routs
app.get('/',homeHandler)
app.get('/favorite',favoriteHandler)
app.get('/trending',trendingHandler)
app.get('/search',searchHandler)
app.get('/discover',discoverHandler)
app.get('/genre',genreHandler)
app.post('/addMovie',addMovieHandler)
app.get('/getMovies',getMoviesHandler)

app.get('*',handleError)

//functions
function homeHandler(req,res){
    
  res.send('Welcome to home page');
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

function addMovieHandler (req,res){
  let name=req.body.name;
  let year=req.body.year;
  let comment=req.body.comment;
  
  let sql=`INSERT INTO movies (name,year,comment)
  VALUES ($1,$2,$3) RETURNING *;`
  let values=[name,year,comment]
  client.query(sql,values).then((myResult)=>{
    res.status(201).json(myResult.rows)

  }
    
  ).catch()
}

function getMoviesHandler(req,res){
  let sql =`SELECT * FROM movies;`
  client.query(sql).then((result)=>{
    res.json(result.rows)
  }).catch()

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

client.connect().then(()=>{
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })
})
.catch()



