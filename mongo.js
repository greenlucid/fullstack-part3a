const mongoose = require('mongoose')

if (process.argv.length < 5) {
  console.log('Syntax: node mongo.js <password> <name> <number>')
  process.exit(1)
}

const password = process.argv[2]
const url =
  `mongodb+srv://admin:${password}@phonebook.nkybr.mongodb.net/Phonebook?retryWrites=true&w=majority`
mongoose.connect(url, 
  { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true }
)

const newPerson = {
  name: process.argv[3],
  number: process.argv[4]
}

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema)

const person = new Person({
  name: newPerson.name,
  number: newPerson.number
})

person.save().then( result => {
  console.log('New entry added')
  Person.find({}).then( result => {
    console.log('phonebook:')  
    result.forEach(person => {
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
  })
})


