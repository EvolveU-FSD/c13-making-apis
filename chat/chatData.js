import { connect } from '../db.js'

const mongoose = await connect()

const chatSchema = mongoose.Schema({
    topic: { type: String, required: true }
})

const Chat = mongoose.model('chat', chatSchema, 'chats')

export async function createChat(owner, topic) {  
    return Chat.create({topic})  
}

export async function findChatById(id) {
    return await Chat.findById(id)
}

// updating a chat really means changing the topic
export async function updateChat(chat) {
}

export async function deleteAllChats() {
    return await Chat.deleteMany()
}

export async function inviteUserToChat(chat, user) {
}

// find all chats that this user owns or is an invitee to
export async function findChatsForUser(userId) {
    return []
}

// find all invites this user has not accepted
export async function findChatInvitesForUser(user) {
    return []
}

// when a user accepts an invite
export async function acceptInvite(user, chat) {
}

// add a new message to a chat
export async function addMessageToChat(chat, user, message) {
}

