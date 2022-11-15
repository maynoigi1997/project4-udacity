import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate';

const AWSXRay = require('aws-xray-sdk')

// TODO: Implement the dataLayer logic

export class TodosAccess {
    constructor (
        private readonly docClient: DocumentClient = new AWSXRay.DynamoDB.DocumentClient(),
        private readonly todoTable = process.env.TODOS_TABLE,
        private readonly userIdIndex = process.env.USER_INDEX,

    ) {}

    async getTodos(userId: string) {
        const todos = await this.docClient.query({
            TableName: this.todoTable,
            IndexName: this.userIdIndex,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId
            }
        }).promise()
        return todos;
    }

    async createTodos(newTodo: TodoItem): Promise<TodoItem> {
        await this.docClient.put({
            TableName: this.todoTable,
            Item: newTodo
        }).promise()
        return newTodo
    }

    async updateTodos(updatedTodo: TodoUpdate, todoId: string, userId: string): Promise <TodoUpdate>{
        await this.docClient.update({
            TableName: this.todoTable,
            Key: {userId, todoId}, 
            UpdateExpression: 'set #N=:name, #d=:dueDate, #c=:done',
            ExpressionAttributeNames: { '#N': 'name', '#d':'dueDate', '#c':'done'},
            ExpressionAttributeValues:{
                ":name": updatedTodo.name,
                ":dueDate": updatedTodo.dueDate,
                ":done": updatedTodo.done
            },
            ReturnValues: "UPDATED_NEW"
        }).promise()

        return updatedTodo
    }

    async deleteTodo(todoId: string, userId: string){
        await this.docClient.delete({
            TableName: this.todoTable,
            Key: {todoId, userId}
        }).promise()
    }
}
