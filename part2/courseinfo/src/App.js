// 2.3
// import React from 'react'

// const Header = ({ course }) => {
//   return (
//     <h1>{course.name}</h1>
//   )
// }

// const Total = ({ course }) => {
//   const sum = course.parts.reduce((acc, part) => acc + part.exercises, 0)
//   return(
//     <p>Number of exercises {sum}</p>
//   ) 
// }

// const Part = ({ part }) => {
//   return (
//     <p>
//       {part.name} {part.exercises}
//     </p>    
//   )
// }

// const Content = ({ course }) => {
//   return course.parts.map(part => <Part key={part.id} part={part} />)
// }

// const Course = ({ course }) => {
//   return (
//     <div>
//       <Header course={course} />
//       <Content course={course} />
//       <Total course={course} />
//     </div>
//   )
// }

// const App = () => {
//   const course = {
//     id: 1,
//     name: 'Half Stack application development',
//     parts: [
//       {
//         name: 'Fundamentals of React',
//         exercises: 10,
//         id: 1
//       },
//       {
//         name: 'Using props to pass data',
//         exercises: 7,
//         id: 2
//       },
//       {
//         name: 'State of a component',
//         exercises: 14,
//         id: 3
//       },
//       {
//         name: 'Another extra part',
//         exercises: 1,
//         id: 4
//       },
//       {
//         name: 'Final exercise',
//         exercises: 18,
//         id: 5
//       }
//     ]
//   }

//   return <Course course={course} />
// }

// export default App


//#####################################################################

// 2.4
import React from 'react'
import Course from './components/Course'

const App = () => {
  const courses = [
    {
      name: 'Half Stack application development',
      id: 1,
      parts: [
        {
          name: 'Fundamentals of React',
          exercises: 10,
          id: 1
        },
        {
          name: 'Using props to pass data',
          exercises: 7,
          id: 2
        },
        {
          name: 'State of a component',
          exercises: 14,
          id: 3
        },
        {
          name: 'Redux',
          exercises: 11,
          id: 4
        }
      ]
    }, 
    {
      name: 'Node.js',
      id: 2,
      parts: [
        {
          name: 'Routing',
          exercises: 3,
          id: 1
        },
        {
          name: 'Middlewares',
          exercises: 7,
          id: 2
        }
      ]
    }
  ]

  return courses.map(course => <Course key={course.id} course={course} />)
   
}

export default App