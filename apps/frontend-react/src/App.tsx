import { useEffect, useState } from 'react'
import { logger } from './logger.ts'

type Book = {
  id: number
  title: string
  author: string
  year: number
}

type State =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; books: Book[] }

// Fetches the books and resolves to the next UI state; never throws.
async function loadBooks(): Promise<State> {
  logger.debug('fetching books')
  const start = performance.now()
  let status: number | undefined
  try {
    const response = await fetch('/api/books')
    status = response.status
    if (!response.ok) {
      throw new Error(`GET /api/books failed with HTTP ${response.status}`)
    }
    const books = (await response.json()) as Book[]
    logger.info(
      { count: books.length, duration_ms: Math.round(performance.now() - start) },
      'books fetched',
    )
    return { status: 'success', books }
  } catch (error) {
    logger.error(
      { err: error, status, duration_ms: Math.round(performance.now() - start) },
      'failed to fetch books',
    )
    return {
      status: 'error',
      message: error instanceof Error ? error.message : String(error),
    }
  }
}

function App() {
  // Starts as 'loading' so the mount effect doesn't need to set it.
  const [state, setState] = useState<State>({ status: 'loading' })

  useEffect(() => {
    let cancelled = false
    void loadBooks().then((next) => {
      if (!cancelled) setState(next)
    })
    return () => {
      cancelled = true
    }
  }, [])

  const refresh = async () => {
    setState({ status: 'loading' })
    setState(await loadBooks())
  }

  return (
    <main>
      <header>
        <h1>Books</h1>
        <button onClick={() => void refresh()} disabled={state.status === 'loading'}>
          Refresh
        </button>
      </header>

      {state.status === 'loading' && <p className="status">Loading…</p>}

      {state.status === 'error' && (
        <p className="error" role="alert">
          {state.message}
        </p>
      )}

      {state.status === 'success' && (
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Year</th>
            </tr>
          </thead>
          <tbody>
            {state.books.map((book) => (
              <tr key={book.id}>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>{book.year}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  )
}

export default App
