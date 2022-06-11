// Load .env variables
require('dotenv').config()

// Import Express and CORS
const express = require('express')
const cors = require('cors')

// Initialise application
const app = express()
app.use(express.urlencoded({
    extended:true,
}))
app.use(express.json())
app.use(cors())

const PORT = process.env.PORT

// Data will stored in the following format:
// {"id": 0, "content": "Lorem Ipsum"}
// Where id is the primary key, and content is any string wished to store
let storage = []

// Utilities
function getNextIndex(){
    let maxIndex = -1
    for (let i in storage){
        let val = storage[i]
        if (maxIndex < val.id){
            maxIndex = val.id
        }
    }
    return maxIndex + 1
}

function getStoredContentByIndex(id){
    for (let i in storage){
        val = storage[i]
        if (val.id === id){
            return val
        }
    }
    return NaN
}

// Create endpoint
app.post('/create', (req, res)=>{
    let bodyData = req.body

    if (!"content" in bodyData){
        res.json({status:1, message: "Key 'content' not found in request body", key: -1})
        return
    }

    let nextIndex = getNextIndex()
    storage.push({id: nextIndex, content: bodyData.content})

    res.json({status:0, message:"Success", key: nextIndex})
})
    
app.get('/readAll', (req, res)=>{
    res.json({status:0, message:"Success", storage})
})

app.get('/read/:id', (req, res)=>{
    let id = req.params.id
    if (isNaN(id)){
        res.json({status:2, message:"ID is not a number"})
        return
    }

    id = parseInt(id)

    let storedContent = getStoredContentByIndex(id)
    if (!storedContent){
        res.json({status:1, message:"ID not found in storage."})
        return
    }
    
    res.json({status:0, message:"Success", storedContent})
})

app.get('/deleteAll', (req, res)=>{
    storage = []
    res.json({status:0, message:"Success"})
})

app.get('/delete/:id', (req, res)=>{
    let id = req.params.id
    if (isNaN(id)){
        res.json({status:1, message:"ID is not a number"})
        return
    }

    id = parseInt(id)

    var newStorage = storage.filter(storedContent => {
        return storedContent.id !== id;
    });
    storage = newStorage
    res.json({status:0, message:"Success"})
})

app.post('/update/:id', (req, res)=>{
    let id = req.params.id
    if (isNaN(id)){
        res.json({status:3, message:"ID is not a number"})
        return
    }

    id = parseInt(id)
    
    let storedContent = getStoredContentByIndex(id)
    if (!storedContent){
        res.json({status:1, message:"ID not found in storage."})
        return
    }
    
    let bodyData = req.body
    
    if (!"content" in bodyData){
        res.json({status:2, message: "Key 'content' not found in request body", key: -1})
        return
    }
    
    for (let i in storage){
        val = storage[i]
        if (val.id === id) {
            storage[i].content = bodyData.content
        }
    }

    res.json({status:0, message:"Success"})
})

// Start Application
app.listen(PORT)