const ToDoController = require('../../controllers/todo.controller')
const ToDoModel = require('../../models/todo.model')
const httpMocks = require('node-mocks-http')
const newTodo = require('../mock-data/new_todo.json')

ToDoModel.create = jest.fn()

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
    it('should return 201 response code', () => {
        ToDoController.createToDo(req, res, next)
        expect(res.statusCode).toBe(201)
        expect(res._isEndCalled()).toBeTruthy()
    })
    it('should return json body in response', async () => {
        await ToDoModel.create.mockReturnValue(newTodo)
        await ToDoController.createToDo(req, res, next)
        expect(res._getJSONData()).toStrictEqual(newTodo)
    })
    it('should handle errors', async()=>{
        const errorMessage = {message: 'Done property missing'}
        const rejectedPromise = Promise.reject(errorMessage)
        ToDoModel.create.mockReturnValue(rejectedPromise)
        await ToDoController.createToDo(req, res, next)
        expect(next).toBeCalledWith(errorMessage)
    })
})