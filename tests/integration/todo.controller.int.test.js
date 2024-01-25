const request = require('supertest');
const app = require('../../app');
const newTodo = require('../mock-data/new_todo.json');

const endpointUrl = '/todos/'
let firstTodo
let newTodoId
const testData = {
    title: 'Make integfration test for PUT',
    done: true
}
const notExistingTodoId = '65b253f64ac2a8896839bc65'
describe(endpointUrl, () => {
    it('POST ' + endpointUrl, async () => {
        const response = await request(app)
            .post(endpointUrl)
            .send(newTodo)
        expect(response.statusCode).toBe(201)
        expect(response.body.title).toBe(newTodo.title)
        expect(response.body.done).toBe(newTodo.done)
        newTodoId = response.body._id
    })
    it('should return error 500 on malformed data with POST' + endpointUrl, async () => {
        const response = await request(app)
            .post(endpointUrl)
            .send({ title: "Missing done property" })
        expect(response.statusCode).toBe(500)
        expect(response.body).toStrictEqual({
            message: 'ToDo validation failed: done: Path `done` is required.'
        })
    })
    test('GET' + endpointUrl, async () => {
        const response = await request(app).get(endpointUrl)
        expect(response.statusCode).toBe(200)
        expect(Array.isArray(response.body)).toBeTruthy()
        expect(response.body[0].title).toBeDefined()
        expect(response.body[0].done).toBeDefined()
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