const { request, response } = require('express')
const express = require('express')
var morgan = require('morgan')
var cors = require('cors')
morgan.token('body', (request, response) => (JSON.stringify(request.body)))

const app = express()
app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let persons = [
  {
    name: "Arto Man",
    number: "123-123123",
    id: 1
  },
  {
    name: "MegaMan",
    number: "633-1421123",
    id: 2
  },
  {
    name: "Satan",
    number: "666",
    id: 3
  },
  {
    name: "George Bush",
    number: "STONECUTTERS-912",
    id: 4
  }
]

app.get('/', (request, response) => {
  response.send('What are you doing here?')
})

app.get("/info", (request, response) => {
  const header = `<p>Phonebook has info for ${persons.length} people</p>`
  const currentDate = `<p>${new Date()}</p>`
  response.send(header + currentDate)
})

app.get("/api/persons", (request, response) => {
  response.json(persons)
})

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)
  if (person){
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.post("/api/persons", (request, response) => {
  const body = request.body
  const randomId = Math.floor(10000000000 * Math.random())
  
  if (!body) {
    return response.status(400).json({
      error: 'body is undefined'
    })
  } else if (!body.name) {
    return response.status(400).json({
      error: 'name is undefined'
    })
  } else if (!body.number) {
    return response.status(400).json({
      error: 'number is undefined'
    })
  } else if (persons.map(person => person.name).includes(body.name)) {
    return response.status(400).json({
      error: 'name is already in the phonebook'
    })
  }
  
  const person = {
    name: body.name,
    number: body.number,
    id: randomId
  }
  persons = persons.concat(person)
  console.log(person)
  
  response.json(person)
})

app.put("/api/persons/:id", (request, response) => {
  const body = request.body
  const id = Number(request.params.id)
  
  if (!body) {
    return response.status(400).json({
      error: "Body is undefined"
    })
  } else if (!body.name) {
    return response.status(400).json({
      error: "Name is empty or undefined"
    })
  } else if (!body.number) {
    return response.status(400).json({
      error: "Number is empty or undefined"
    })
  } else if (persons
      .filter(person => person.id !== id).map(person => person.name).includes(body.name)) {
    return response.status(400).json({
      error: "Name has already been registered"
    })
  }

  const newPerson = {
    name: body.name,
    number: body.number,
    id: id
  }

  persons = persons.map(person => person.id !== id ? person : newPerson)
  response.json(newPerson)
})

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)
  response.status(204).end()
})

const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)