import { Router } from 'express'

export type Book = {
  id: number
  title: string
  author: string
  year: number
}

const books: Book[] = [
  { id: 1, title: 'Dune', author: 'Frank Herbert', year: 1965 },
  { id: 2, title: 'The Left Hand of Darkness', author: 'Ursula K. Le Guin', year: 1969 },
  { id: 3, title: 'Neuromancer', author: 'William Gibson', year: 1984 },
  { id: 4, title: 'Hyperion', author: 'Dan Simmons', year: 1989 },
  { id: 5, title: 'Snow Crash', author: 'Neal Stephenson', year: 1992 },
  { id: 6, title: 'The Three-Body Problem', author: 'Liu Cixin', year: 2008 },
  { id: 7, title: 'Ancillary Justice', author: 'Ann Leckie', year: 2013 },
  { id: 8, title: 'The Fifth Season', author: 'N. K. Jemisin', year: 2015 },
  { id: 9, title: 'Project Hail Mary', author: 'Andy Weir', year: 2021 },
  { id: 10, title: 'Children of Time', author: 'Adrian Tchaikovsky', year: 2015 },
]

export const booksRouter = Router()

booksRouter.get('/', (_req, res) => {
  res.json(books)
})
