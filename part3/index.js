require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const Person = require('./models/person')

app.use(express.json())

morgan.token('data', function (req, res) {
    return JSON.stringify(req.body)
})

app.use(morgan(function (tokens, req, res) {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'), '-',
      tokens['response-time'](req, res), 'ms',
      tokens.data(req, res)
    ].join(' ')
  })
)

const cors = require('cors')
app.use(cors())

app.use(express.static('build'))



app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
        .then(person => {
            if (person) {
                response.json(person)
            } else {
                response.status(404).end()
            }
        })
        .catch(error => next(error))
})

app.get('/info', (request, response) => {
    // const info = `<p>Phonebook has info for ${persons.length} people</p>`
    // const date = `<p>${new Date().toString()}</p>` 
    Person.find({}).then(persons => {
        const info = `<p>Phonebook has info for ${persons.length} people</p>`
        const date = `<p>${new Date().toString()}</p>` 
        response.send(`${info}${date}`)
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
    const body = request.body

    // const alreadyExists = 
    //     persons.some(p => p.name.toLocaleLowerCase() === body.name.toLowerCase())

    // if (alreadyExists) {
    //     return response.status(409).json({
    //         error: 'that person is alrady on the phonebook'
    //     })
    // }

    const person = new Person ({
        name: body.name,
        number: body.number
    })

    person.save().then(savedPerson => {
        response.json(savedPerson)
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
    // const id = +request.params.id
    // const body = request.body
    // const updatedPerson = {
    //     id: body.id,
    //     name: body.name,
    //     number: body.number
    // }

    // persons = persons.map(p => p.id === id ? updatedPerson : p)

    // response.json(updatedPerson)
    const body = request.body

    const person = {
        name: body.name,
        number: body.number,
    }

    Person.findByIdAndUpdate(request.params.id, person, { new: true, runValidators: true })
        .then(updatedNote => {
            response.json(updatedNote)
        })
        .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndRemove(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    }

    next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})