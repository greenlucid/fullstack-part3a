require('dotenv').config()
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

const Person = require('./models/person')

app.get('/', (request, response) => {
  response.send('What are you doing here?')
})

app.get("/info", (request, response) => {
  const header = `<p>Phonebook has info for ${persons.length} people</p>`
  const currentDate = `<p>${new Date()}</p>`
  response.send(header + currentDate)
})

app.get("/api/persons", (request, response, next) => {
  Person.find({}).then(notes => {
    response.json(notes)
  })
})

app.get("/api/persons/:id", (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      person
        ? response.json(person)
        : response.status(404).end()
    })
    .catch(error => next(error))
})

app.post("/api/persons", (request, response, next) => {
  const body = request.body

  const person = new Person({
    name: body.name,
    number: body.number
  })

  person.save()
    .then(savedPerson => {
      response.json(savedPerson)
    })
    .catch(error => next(error))
})

app.put("/api/persons/:id", (request, response, next) => {
  const body = request.body
  
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
  }

  const newPerson = {
    number: body.number
  }
  
  Person.findByIdAndUpdate(request.params.id, newPerson, { new: true, runValidators: true })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

app.delete("/api/persons/:id", (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  console.log('QUE PASA DANIEEEEEEEEEL')
  
  response.status(404).send({ error: 'unknown endpoint'})
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id'})
  } else if (error.name === 'ValidationError') {
    return response.status(400).send({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT)
console.log(`Server running on port ${PORT}`)

