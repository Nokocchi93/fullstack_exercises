const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((acc, blog) => acc + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return null

  const indexMostLikes = blogs.reduce((acc, blog, i, blogs) => {
    if (blog.likes > blogs[acc].likes) return i
    return acc
  }, 0)
  return blogs[indexMostLikes]
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null

  const authors = []

  blogs.forEach(blog => {
    const authorIndex = authors.findIndex(author => author.author === blog.author)

    if (authorIndex === -1) {
      authors.push({ author: blog.author, blogs: 1 })
    } else {
      authors[authorIndex].blogs++
    }
  })

  const indexMostBlogs = authors.reduce((acc, author, i, authors) => {
    if (author.blogs > authors[acc].blogs) return i
    return acc
  }, 0)

  return authors[indexMostBlogs]
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) return null
  const authors = []

  blogs.forEach(blog => {
    const authorIndex = authors.findIndex(author => author.author === blog.author)

    if (authorIndex === -1) {
      authors.push({ author: blog.author, likes: blog.likes })
    } else {
      authors[authorIndex].likes += blog.likes
    }
  })

  const indexMostLikes = authors.reduce((acc, author, i, authors) => {
    if (author.likes > authors[acc].likes) return i
    return acc
  }, 0)

  return authors[indexMostLikes]
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}
