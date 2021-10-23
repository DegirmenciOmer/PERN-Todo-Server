import express from 'express'
import pool from './db.js'
import cors from 'cors'
import { v4 as uuidV4 } from 'uuid'

const app = express()
app.use(
  cors({
    cors: true,
    origins: ['http://localhost:3000'],
  })
)

app.use(express.json())

export const PORT = process.env.PORT || 5000

// register user
app.post('/users/register', async (req, res) => {
  try {
    const id = uuidV4()
    console.log({ id })
    const { name, email, password } = req.body
    res.setHeader('Content-Type', 'application/json')

    const { rowCount: alreadyExists } = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    )
    console.log({ alreadyExists })
    if (alreadyExists) {
      res.sendStatus(400)
      throw new Error('This email adress already exists')
    } else {
      const newUser = await pool.query(
        'INSERT INTO users(name, email, password, user_id) VALUES($1, $2, $3, $4) RETURNING *',
        [name, email, password, id]
      )
      res.status(201).json(newUser.rows[0])
    }
  } catch (error) {
    console.log(error.message)
    res.send(error.message)
  }
})

//Login user
app.post('/users/login', async (req, res) => {
  try {
    const { email, password } = req.body
    res.setHeader('Content-Type', 'application/json')

    console.log({ email, password })

    const user = await pool.query('SELECT * FROM users WHERE email = $1', [
      email,
    ])
    const selectedUser = user.rows[0]
    console.log({ selectedUser, user })
    if (!selectedUser) {
      res.status(404)
      throw new Error('Please sign up first')
    } else if (selectedUser && selectedUser.password !== password) {
      res.status(404)
      throw new Error('Incorrect password')
    } else {
      res.send(selectedUser)
    }
  } catch (error) {
    console.log(error.message)
    res.send(error.message)
  }
})

//add new todo
app.post('/todos/', async (req, res) => {
  res.setHeader('Content-Type', 'application/json')
  try {
    const { description, user_id } = req.body
    if (description.length > 55) {
      res.status(400)
      throw new Error('Too long text')
    }

    console.log(req.body.user_id)
    const newTodo = await pool.query(
      'INSERT INTO todo (description, user_id) VALUES($1, $2) RETURNING *',
      [description, user_id]
    )

    console.log(newTodo.rows[0])
    res.json(newTodo.rows[0])
  } catch (err) {
    console.error(err.message)
    res.json(err)
  }
})

//get all todos
app.get('/todos/:id', async (req, res) => {
  try {
    const { id } = req.params
    console.log({ id })
    const allTodos = await pool.query(
      'SELECT * FROM todo WHERE user_id = $1 ORDER BY created_at DESC ',
      [id]
    )

    console.log(allTodos.rows)

    res.json(allTodos.rows)
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
      'UPDATE todo SET is_done = NOT(COALESCE(is_done, FALSE)) WHERE todo_id = $1',
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

    const deleteTodo = await pool.query('DELETE FROM todo WHERE todo_id = $1', [
      id,
    ])

    res.json('Todo was deleted.')
  } catch (error) {
    console.error(error.message)
    res.json(error.message)
  }
})

app.listen(PORT, () => {
  console.log(`Server is up and running on port ${PORT}`)
})
