const mongoose = require('mongoose')
const supertest = require('supertest')
const { initialBlogs, initialUsers } = require('./test_helper')
const { server } = require('../index')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const { init } = require('../models/user')
const { response } = require('express')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  for (const blog of initialBlogs) {
    const blogObject = new Blog(blog)
    await blogObject.save()
  }

  for (const user of initialUsers) {
    const userObject = new User(user)
    await userObject.save()
  }
})

describe('check database data', () => {
  test('check number of blogs', async () => {
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(response.body).toHaveLength(initialBlogs.length)
  })

  test('check number of users', async () => {
    const response = await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(response.body).toHaveLength(initialUsers.length)
  })
})

// describe('check that new users are added correctly', () => {
//   test('invalid users are not created', async () => {
//     const invalidUser = {
//       username: 'aa',
//       name: 'invalid user',
//       pass
//     }
//   })
// })