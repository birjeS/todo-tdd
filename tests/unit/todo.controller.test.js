const ToDoController = require('../../controllers/todo.controller')
const ToDoModel = require('../../models/todo.model')
const httpMocks = require('node-mocks-http')
const newTodo = require('../mock-data/new_todo.json')
const allTodos = require('../mock_data/all-todos.json')

ToDoModel.create = jest.fn()
ToDoModel.find = jest.fn()

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
        it('should handle errors', async () => {
            const errorMessage = { message: 'Done property missing' }
    })
    it('should handle errors', async()=>{
        const errorMessage = {message: 'Done property missing'}
        const rejectedPromise = Promise.reject(errorMessage)
        ToDoModel.create.mockReturnValue(rejectedPromise)
        await ToDoController.createToDo(req, res, next)
        expect(next).toBeCalledWith(errorMessage)
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
});