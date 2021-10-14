import React, { useState, useEffect } from 'react'
import axios from 'axios'

const DisplayCountry = ({ country }) => {
  const [weather, setWeather] = useState([])
  const api_key = process.env.REACT_APP_API_KEY

  useEffect(() => {
    axios
      .get(`http://api.weatherstack.com/current?access_key=${api_key}&query=${country.capital[0]}`)
      .then(response => setWeather(response.data))
  }, [])
  console.log(weather)

  return (
   <div>
     <h1>{country.name.common}</h1>
     <div>capital {country.capital[0]}</div>
     <div>population {country.population}</div>
     <h3>Languages</h3>
     <ul>
       {Object.values(country.languages)
        .map(lang => <li key={lang}>{lang}</li>)}
      </ul>
      <img src={country.flags.png} alt={"Country flag"} />
      <h3>Weather in {country.capital[0]}</h3>
      <p>temperature: {weather.current?.temperature} Celsius</p>
      <img src={weather.current?.weather_icons[0]} />
      <p>wind: {weather.current?.wind_speed} mph direction {weather.current?.wind_dir}</p>
   </div>
   )
}

const Information = ({ countries, findCountry }) => {

  const [showCountry, setShowCountry] = useState()

  const handleShowButton = (country) => {
    setShowCountry(country)
  }

  if (findCountry === '') {
    return <div>Search for a country</div>
  } else {
    const matches = countries.filter(country => {
      return country.name.common.toLowerCase().includes(findCountry)
    })
    
    if (matches.length > 10) {
      return <div>Too many matches, specify another filter</div>
    } 
    else if (matches.length <= 10 && matches.length > 1) {
      return (
        <ul>
          {matches.map((country, i) => {
            return (
              <li key={i}>
                {country.name.common}
                <button key={i} onClick={() => handleShowButton(country)}>show</button>
                {showCountry?.name.common === country.name.common
                  ? <DisplayCountry country={country} />
                  : null
                }
                <br />
              </li>
              )
            })
          }
        </ul>
      )
    }
    else if (matches.length === 1) {
      return <DisplayCountry country={matches[0]} />
    }
    else return <div>No matches</div>
  }
}

const App = () => {

  const [countries, setCountries] = useState([])
  const [findCountry, setFindCountry] = useState('')

  useEffect(() => {
    axios
      .get('https://restcountries.com/v3.1/all')
      .then(response => setCountries(response.data))
  }, [])

  const handleFindCountry = (event) => {
    setFindCountry(event.target.value.toLowerCase())
  }

  return (
    <div>
      find countries <input onChange={handleFindCountry}/>
      <Information countries={countries} findCountry={findCountry} />
    </div>
  )
}

export default App;
