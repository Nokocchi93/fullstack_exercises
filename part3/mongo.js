const mongoose = require('mongoose')

const numOfArgs = process.argv.length

if (numOfArgs < 3) {
    console.log('Please provide the password as an argument: node mongo.js <password>')
}

const password = process.argv[2]

const url = `mongodb+srv://fullstack:${password}@project0.gojew.mongodb.net/phonebook-app?retryWrites=true&w=majority`

mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Person', personSchema)

const addPerson = () => {
    
    const person = new Person({
        name: process.argv[3],
        number: process.argv[4],
    })

    person.save().then(result => {
        console.log(`added ${person.name} number ${person.number} to phonebook`)
        mongoose.connection.close()
    })
}

const displayPeople = () => {
    Person.find({}).then(result => {
        console.log('phonebook:')
        result.forEach(note => {
            console.log(`${note.name} ${note.number}`)
        })
        mongoose.connection.close()
    })
    
}

if (numOfArgs === 5) addPerson()
else if (numOfArgs === 3) displayPeople()