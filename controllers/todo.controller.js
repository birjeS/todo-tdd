const TodoModel = require('../models/todo.model')

const createToDo = async (req, res, next) => {
    console.log(req.body)
    const createdModel = await ToDoModel.create(req.body)
    res.status(201).send()
}

module.exports = {createToDo}