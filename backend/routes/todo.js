const express = require('express')
const Todo = require('../models/todoModel')
const {
  getTodos,
  getTodo,
  createTodo,
  deleteTodo,
  updateTodo} = require('../controllers/todocontroller')


const router = express.Router()

// GET all Todo
router.get('/', getTodos)

// GET a single workout
router.get('/:id', getTodo)

// POST a new workout
router.post('/', createTodo)

// DELETE a workout
router.delete('/:id', deleteTodo)

// UPDATE a workout
router.patch('/:id', updateTodo)

module.exports = router
