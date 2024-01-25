const ToDoController = require('../../controllers/todo.controller')
const ToDoModel = require('../../models/todo.model')
const httpMocks = require('node-mocks-http')
const newTodo = require('../mock_data/new_todo.json')
const allTodos = require('../mock_data/all-todos.json')

ToDoModel.create = jest.fn()
ToDoModel.find = jest.fn()
ToDoModel.findById = jest.fn()
ToDoModel.findByIdAndUpdate = jest.fn()
ToDoModel.findByIdAndDelete = jest.fn()

const todoId = '65b243245c10517839901b23'

let req, res, next
beforeEach(() => {
    req = httpMocks.createRequest()
    res = httpMocks.createResponse()
    next = jest.fn()
})

describe('ToDoController.createToDo', () => {
    beforeEach(() => {
        req.body = newTodo
    })

    it('should have a createToDo function', async () => {
        expect(typeof ToDoController.createToDo).toBe('function')
    })
    it('should call ToDoModel.create', async () => {
        await ToDoController.createToDo(req, res, next)
        expect(ToDoModel.create).toBeCalledWith(newTodo)
    })
    it('should return 201 response code', async () => {
        await ToDoController.createToDo(req, res, next)
        expect(res.statusCode).toBe(201)
        expect(res._isEndCalled()).toBeTruthy()
    })
    it('should return json body in response', async () => {
        await ToDoModel.create.mockReturnValue(newTodo)
        await ToDoController.createToDo(req, res, next)
        expect(res._getJSONData()).toStrictEqual(newTodo)
    })
    it('should handle errors', async () => {
        const errorMessage = { message: 'Done property missing' }
        const rejectedPromise = Promise.reject(errorMessage)
        ToDoModel.create.mockReturnValue(rejectedPromise)
        await ToDoController.createToDo(req, res, next)
        expect(next).toBeCalledWith(errorMessage)
    })
})

describe('ToDoController.getTodos', () => {
    it('shouild have a getTodos function', () => {
        expect(typeof ToDoController.getTodos).toBe('function')
    })
    it('should call ToDoModel.find({})', async () => {
        await ToDoController.getTodos(req, res, next)
        expect(ToDoModel.find).toHaveBeenCalledWith({})
    })
    it('should return response with status 200 and all todos', async () => {
        ToDoModel.find.mockReturnValue(allTodos)
        await ToDoController.getTodos(req, res, next)
        expect(res.statusCode).toBe(200)
        expect(res._isEndCalled()).toBeTruthy()
        expect(res._getJSONData()).toStrictEqual(allTodos)
    })
    it('should handle errors in getTodods', async () => {
        const errorMessage = { message: 'Error finding' }
        const rejectedPromise = Promise.reject(errorMessage)
        ToDoModel.find.mockReturnValue(rejectedPromise)
        await ToDoController.getTodos(req, res, next)
        expect(next).toHaveBeenCalledWith(errorMessage)
    })
})


describe('TodoController.getTodoById', () => {
    it('should have a getTodobyId', () => {
        expect(typeof ToDoController.getTodoById).toBe('function')
    })
    it('should call TodoModel.findById with route parameeters', async () => {
        req.params.todoId = todoId
        await ToDoController.getTodoById(req, res, next)
        expect(ToDoModel.findById).toBeCalledWith(todoId)
    })
    it('should return json body and response code 200', async () => {
        ToDoModel.findById.mockReturnValue(newTodo)
        await ToDoController.getTodoById(req, res, next)
        expect(res.statusCode).toBe(200)
        expect(res._getJSONData()).toStrictEqual(newTodo)
        expect(res._isEndCalled()).toBeTruthy()
    })
    it('should do error handling', async () => {
        const errorMessage = { 'message': 'Error finding todoModel' }
        const rejectedPromise = Promise.reject(errorMessage)
        ToDoModel.findById.mockReturnValue(rejectedPromise)
        await ToDoController.getTodoById(req, res, next)
        expect(next).toHaveBeenCalledWith(errorMessage)
    })
    it('should return 404 when item doesnt exist', async () => {
        ToDoModel.findById.mockReturnValue(null)
        await ToDoController.getTodoById(req, res, next)
        expect(res.statusCode).toBe(404)
        expect(res._isEndCalled()).toBeTruthy()
    })
})

describe('TodoController..updateTodo', () => {
    it('should have an updateTodo function', () => {
        expect(typeof ToDoController.updateTodo).toBe('function')
    })
    it('should update with TodoModel.findByIdAndUpdate', async () => {
        req.params.todoId = todoId
        req.body = newTodo
        await ToDoController.updateTodo(req, res, next)
        expect(ToDoModel.findByIdAndUpdate).toHaveBeenCalledWith(todoId, newTodo, {
            new: true,
            useFindAndModify: false
        })
    })
    it('should return json body and response code 200', async () => {
        req.params.todoId = todoId
        req.body = newTodo
        ToDoModel.findByIdAndUpdate.mockReturnValue(newTodo)
        await ToDoController.updateTodo(req, res, next)
        expect(res.statusCode).toBe(200)
        expect(res._getJSONData()).toStrictEqual(newTodo)
        expect(res._isEndCalled()).toBeTruthy()
    })
    it('should do error handling', async () => {
        const errorMessage = { 'message': 'Error updating' }
        const rejectedPromise = Promise.reject(errorMessage)
        ToDoModel.findByIdAndUpdate.mockReturnValue(rejectedPromise)
        await ToDoController.updateTodo(req, res, next)
        expect(next).toHaveBeenCalledWith(errorMessage)
    })
    it('should return 404 when item doesnt exist', async () => {
        ToDoModel.findByIdAndUpdate.mockReturnValue(null)
        await ToDoController.updateTodo(req, res, next)
        expect(res.statusCode).toBe(404)
        expect(res._isEndCalled()).toBeTruthy()
    })
})

describe('TodoController.deleteTodo', () => {
    it('should have a deleteTodo function', () => {
        expect(typeof ToDoController.deleteTodo).toBe('function')
    })
    it('should call findByIdAndDelete', async () => {
        req.params.todoId = todoId
        await ToDoController.deleteTodo(req, res, next)
        expect(ToDoModel.findByIdAndDelete).toBeCalledWith(todoId)
    })
    it('should return 200 OK and deleted todomodel', async () => {
        ToDoModel.findByIdAndDelete.mockReturnValue(newTodo)
        await ToDoController.deleteTodo(req, res, next)
        expect(res.statusCode).toBe(200)
        expect(res._getJSONData()).toStrictEqual(newTodo)
        expect(res._isEndCalled()).toBeTruthy()
    })
    it('should do error handling', async () => {
        const errorMessage = { 'message': 'Error deleting' }
        const rejectedPromise = Promise.reject(errorMessage)
        ToDoModel.findByIdAndDelete.mockReturnValue(rejectedPromise)
        await ToDoController.deleteTodo(req, res, next)
        expect(next).toHaveBeenCalledWith(errorMessage)
    })
    it('should return 404', async () => {
        ToDoModel.findByIdAndDelete.mockReturnValue(null)
        await ToDoController.deleteTodo(req, res, next)
        expect(res.statusCode).toBe(404)
        expect(res._isEndCalled()).toBeTruthy()
    })
})