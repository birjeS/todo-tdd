const TodoModel = require('../models/todo.model')

const createTodo = (req, res, next) => {
    const createdModel = TodoModel.create(req.body)
    res.status(201).send()
}

module.exports = {createTodo}