import express from 'express'
import pool from './db.js'
import cors from 'cors'

const app = express()
app.use(
  cors({
    cors: true,
    origins: ['http://localhost:3000'],
  })
)

app.use(express.json())

export const PORT = process.env.PORT || 5000

//add new todo
app.post('/todos', async (req, res) => {
  try {
    const { description } = req.body
    if (description.length > 55) {
      res.status(400)
      throw new Error('Too long text')
    }
    res.setHeader('Content-Type', 'application/json')
    const newTodo = await pool.query(
      'INSERT INTO todo (description) VALUES($1) RETURNING *',
      [description]
    )
    console.log('Success')

    res.json(newTodo.rows[0])
  } catch (err) {
    console.error(err.message)
    res.status(400).json({ message: err.message })
  }
})

//get all todos
app.get('/todos', async (req, res) => {
  try {
    const allTodos = await pool.query(
      'SELECT * FROM todo ORDER BY updated_at DESC'
    )

    res.json(allTodos.rows)
  } catch (error) {
    console.error(error.message)
    res.json(error.message)
  }
})

//get one todo
app.get('/todos/:id', async (req, res) => {
  try {
    const { id } = req.params
    const selectedTodo = await pool.query(
      'SELECT * FROM todo WHERE todo_id = $1',
      [id]
    )

    res.json(selectedTodo.rows[0])
  } catch (error) {
    console.error(error.message)
    res.json(error.message)
  }
})
//update a todo
app.put('/todos/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { description } = req.body

    await pool.query('UPDATE todo SET description=$1 WHERE todo_id = $2', [
      description,
      id,
    ])

    res.json('Todo was updated.')
  } catch (error) {
    console.error(error.message)
    res.json(error.message)
  }
})

//mark a todo as done
app.put('/todos/toggle/:id', async (req, res) => {
  try {
    const { id } = req.params
    await pool.query(
      'UPDATE todo SET is_done = NOT(COALESCE(is_done, FALSE)) WHERE id = $1',
      [id]
    )
  } catch (error) {
    console.error(error.message)
    res.json(error.message)
  }
})

//delete a todo
app.delete('/todos/:id', async (req, res) => {
  try {
    const { id } = req.params

    await pool.query('DELETE FROM todo WHERE todo_id = $1', [id])

    res.json('Todo was deleted.')
  } catch (error) {
    console.error(error.message)
    res.json(error.message)
  }
})

app.listen(PORT, () => {
  console.log(`Server is up and running on port ${PORT}`)
})
