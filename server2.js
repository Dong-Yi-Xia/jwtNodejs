require('dotenv').config()

const express = require('express')
const app = express()
const jwt = require('jsonwebtoken')

app.use(express.json())

const posts = [
  {
    username: 'Player1',
    title: 'Post 1'
  },
  {
    username: 'Player2',
    title: 'Post 2'
  }
]

//Endpoints

//pass in the authenticateToken middleware
app.get('/posts', authenticateToken, (req, res) => {
  res.json(posts.filter(post => post.username === req.user.name))
})

app.post('/login', (req, res) => {
  // Authenticate User

  const username = req.body.username
  const user = { name: username}

  //payload, secert
  const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
  //pass accessToken value
  res.json({accessToken: accessToken})
})

//Middlewares
function authenticateToken(req, res, next) {
  // Authorization: Bearer TOKEN
  const authHeader = req.headers['authorization']
  // By splitting and grabbing the TOKEN
  // if authHeader then authHeader.split
  // else return undefined
  const token = authHeader && authHeader.split(' ')[1]

  if(token == null) return res.sendStatus(401)

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if(err) return res.sendStatus(403)
    req.user = user

    // Move on from middleware
    next()
  })
}


app.listen(4000)
