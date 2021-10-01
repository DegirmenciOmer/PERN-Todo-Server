import express from 'express'
import cors from 'cors'

export const customizedCors = cors({
  cors: true,
  origins: ['http://localhost:3000'],
})

export const router = express.Router()

//create a todo
router.post('/todos', customizedCors, async (req, res) => {
  try {
    console.log(req.body)
  } catch (error) {
    console.error(error.message)
  }
})
//get all todos
//get one todo
//update a todo
//delete a todo
