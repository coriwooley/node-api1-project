const express = require('express')
const User = require('./users/model')
const server = express()
server.use(express.json())

server.get('/api/users', (req, res) => {
    User.find()
        .then(users => {
            res.json(users)
        })
        .catch(err => {
            res.status(500).json({
                message: "The users information could not be retrieved",
                err: err.message
            })
        })
})

server.get('/api/users/:id', (req, res) => {
    User.findById(req.params.id)
        .then(user => {
            if(!user){
                res.status(404).json({
                    message: "The user with the specified ID does not exist"
                })
            } else { 
            res.json(user)
        }})
        .catch(err => {
            res.status(500).json({
                message: "The user information could not be retrieved",
                err: err.message
            })
        })
})

server.post('/api/users', (req, res) => {
    const user = req.body
    if(!user.name || !user.bio){
        res.status(400).json({
            message: "Please provide name and bio for the user"
        })
    } else {
        User.insert(user)
            .then(userDoc => {
                res.status(201).json(userDoc)
            })
            .catch(err => {
                res.status(500).json({
                    message: "There was an error while saving the user to the database",
                    err: err.message
                })
            })
    }
    
})

server.put('/api/users/:id', (req, res) => {
    const changes = req.body
    User.findById(req.params.id)
    .then(user => {
        if(!user){
            res.status(404).json({
                message: "The user with the specified ID does not exist"
            })
        } else if(!changes.name || !changes.bio){
            res.status(400).json({
                message:"Please provide name and bio for the user"
            })
        } else {
            User.update(req.params.id, changes)
            .then(updatedUser => {
                res.status(200).json(updatedUser)
            })
            .catch(err => {
                res.status(500).json({
                    message: "The user information could not be modified",
                    err: err.message
                })
            })
        }
    })
    .catch(err => console.log(err))
})

server.delete('/api/users/:id', (req, res) => {
    User.findById(req.params.id)
    .then(user => {
        if(!user){
            res.status(404).json({
                message: "The user with the specified ID does not exist"
            })
        } else {
            User.remove(req.params.id)
            .then(deletedUser => {
                res.json(deletedUser)
            }) 
            .catch(err => {
                res.status(500).json({
                    message: "The user could not be removed",
                    err: err.message
                })
            })
        }
    })
    .catch(err => {console.log(err)})
})

server.use('*', (req, res) => {
    res.status(404).json({
        message: "not found"
    })
})

module.exports = server; // EXPORT YOUR SERVER instead of {}
