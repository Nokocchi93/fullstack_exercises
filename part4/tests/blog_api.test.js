const mongoose = require('mongoose')
const supertest = require('supertest')
const { initialBlogs } = require('./test_helper')
const { server } = require('../index')
const app = require('../app')
const Blog = require('../models/blog')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})

  // const blog1 = new Blog(initialBlogs[0])
  // await blog1.save()
  // const blog2 = new Blog(initialBlogs[1])
  // await blog2.save()

  // PARALELO
  // const blogObjects = initialBlogs.map(blog => new Blog(blog))
  // const blogPromises = blogObjects.map(blog => blog.save())
  // await Promise.all(blogPromises)

  // SERIE
  for (const blog of initialBlogs) {
    const blogObject = new Blog(blog)
    await blogObject.save()
  }
})

describe('GET request tests', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('there is the same number of blog entries', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(initialBlogs.length)
  })

  test('the first blog is from Michael Chan', async () => {
    const response = await api.get('/api/blogs')
    const authors = response.body.map(blog => blog.author)

    expect(authors).toContain('Michael Chan')
  })

  test('unique identifier of blog posts is named id', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body[0].id).toBeDefined()
  })
})

describe('POST requests tests', () => {
  test('checking total number of blogs after adding a new one', async () => {
    const newBlog = {
      title: 'fullstackopen',
      author: 'Aitor Mateu',
      url: 'https://fullstackopen.com/en/',
      likes: 12000
    }

    const postResponse = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    expect(postResponse.body.author).toBe('Aitor Mateu')

    const getResponse = await api.get('/api/blogs')
    expect(getResponse.body).toHaveLength(initialBlogs.length + 1)
  })

  test('if number of likes is missing, default to 0', async () => {
    const newBlog = {
      title: 'Blog with no likes defined',
      author: 'Who likes me?',
      url: 'https://nolikes.com/en/'
    }

    const response = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    expect(response.body.likes).toBe(0)
  })

  test('if title or url are missing, reponds with 400', async () => {
    const newBlog = {
      author: 'blog with no title and url',
      likes: 99
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
  })
})

describe('DELETE request tests', () => {
  test('check total number of blogs after deleting one', async () => {
    await api
      .delete('/api/blogs/5a422a851b54a676234d17f7') // ${initialBlogs[0]._id}
      .expect(204)

    const response = await api
      .get('/api/blogs')

    expect(response.body).toHaveLength(initialBlogs.length - 1)
  })
})

describe('PUT request tests', () => {
  test('check new number of likes after updating', async () => {
    const newBlog = {
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 12321
    }

    const response = await api
      .put('/api/blogs/5a422aa71b54a676234d17f8')
      .send(newBlog)

    expect(response.body.likes).toBe(12321)
  })
})

afterAll(() => {
  mongoose.connection.close()
  server.close()
})
