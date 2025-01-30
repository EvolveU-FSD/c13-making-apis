const dbUri = process.env.MONGO_URI

if (!(dbUri.includes('test') || dbUri.includes('Test'))) {
    throw new Error('Can only run tests against a "test" database '+ dbUri)
}

export * from '../db.js'
import { disconnectDb } from '../db.js'

import { deleteAllUsers } from '../user/userData.js';
import { deleteAllChats } from '../chat/chatData.js';

export async function cleanoutDatabase() {
    await deleteAllUsers();
    await deleteAllChats();
}

beforeEach(async () => {
    await cleanoutDatabase()
})

afterAll(async () => {
    console.log('Disconnecting mongoose')
    await disconnectDb()
})