import { TodosAccess } from './todosAcess'
import { AttachmentUtils } from './attachmentUtils';
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import * as uuid from 'uuid'

// TODO: Implement businessLogic
const todoAccess = new TodosAccess();

const attachmentUtils = new AttachmentUtils();

export async function createTodo(newTodo: CreateTodoRequest, userId: string) {
    const todoId = uuid.v4();
    const timestamp = new Date().toISOString()
    const newItem = {
        userId: userId,
        todoId: todoId,
        createdAt: timestamp,
        done: false,
        ... newTodo
    }
    return todoAccess.createTodos(newItem)
}

export async function updateTodo(itemToUpdate: UpdateTodoRequest, todoId: string, userId: string){
    return todoAccess.updateTodos(itemToUpdate, todoId, userId);
}

export async function deleteTodo(todoId: string, userId: string){
    return todoAccess.deleteTodo(todoId, userId)
} 

export async function getUploadUrl(todoId: string, userId: string){
    return attachmentUtils.generateUploadUrl(todoId, userId)
}
export async function getTodos(userId: string) {
    return todoAccess.getTodos(userId)
}
