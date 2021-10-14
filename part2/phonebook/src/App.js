import React, { useState, useEffect } from 'react'
import personService from './services/persons'
import Notification from './components/Notification'
import './index.css'

const NameFilter = ({ eventHandler }) => {
  return (
    <div>
      filter shown with <input onChange={eventHandler} />
    </div>
  )
}

const AddNumberForm = ({ addNumber, handleNameChange, handleNumberChange}) => {
  return (
    <form onSubmit={addNumber}>
      <div>
        name: <input onChange={handleNameChange}/>
      </div>
      <div>
        number: <input onChange={handleNumberChange} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

const PersonsList = ({ persons, newFilterName, deletePerson}) => {
  return (
    <div>
      {persons
        .filter(person => person.name.toLowerCase().includes(newFilterName.toLowerCase()))
        .map(person => <p key={person.id}>
                        {person.name} {person.number}
                        <button onClick={() => deletePerson(person.id)}>delete</button>
                      </p>)}
    </div>
  )
}

const App = () => {

  const [ persons, setPersons ] = useState([])
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ newFilterName, setNewFilterName ] = useState('')
  const [ notification, setNotification ] = useState({
    message: null,
    type: 'default'
  })

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const addNumber = (event) => {
    event.preventDefault();

    if (persons.some(person => person.name.toLowerCase() === newName.toLocaleLowerCase())) {
      const confirmation = window.confirm(`${newName} is already added to the phonebook,
        replace the old number with a new one?`)
      
      if (confirmation) {
        const personToUpdate = persons.find(person => {
          return person.name.toLowerCase() === newName.toLowerCase()
        })
        personToUpdate.number = newNumber

        personService
          .update(personToUpdate.id, personToUpdate)
          .then(setPersons(persons.map(person => {
            return personToUpdate.id === persons.id ? personToUpdate : person
          })))
          .then(() => {
            const message = `${personToUpdate.name} was updated successfully`
            setNotification({message: message, type:'normal'})
            setTimeout(() => setNotification({message:null, type:'default'}), 5000)
          })
      }

    } else {
      const personObject = {
        name: newName,
        number: newNumber,
        // id: persons.length + 1
      }

      personService
        .create(personObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
        })
        .then(() => {
          const message = `${personObject.name} was added successfully`
          setNotification({message: message, type:'normal'})
          setTimeout(() => setNotification({message:null, type:'default'}), 5000)
        })
    }
  }

  const deletePersonWithId = (id) => {
      
    const person = persons.find(person => person.id === id)
    const confirmation = window.confirm(`Delete ${person.name} number`)

      if (confirmation) {
        personService
        .deletePerson(id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id))
        })
        .catch(error => {
          const message = `The person ${person.name} has already been removed from the server`
          setNotification({message: message, type:'error'})
          setTimeout(() => setNotification({message:null, type:'default'}), 5000)
          setPersons(persons.filter(person => person.id !== id))
        })
      }
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setNewFilterName(event.target.value)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification notification={notification} />
      <NameFilter eventHandler={handleFilterChange} />
      <h3>add a new number</h3>
      <AddNumberForm 
        addNumber={addNumber} handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange} />
      <h3>Numbers</h3>
      <PersonsList 
        persons={persons} newFilterName={newFilterName} 
        deletePerson={deletePersonWithId}/>
    </div>
  )
}

export default App