import { Router } from "express";
import { requireBasicAuth } from "../auth/authController.js";
import { createChat, findChatById, findChatsForUser, updateChat } from "./chatData.js";

const router = Router()

// get all of your invites
router.get('/invites', requireBasicAuth, async function (req, res) {
    // send response
    res.sendStatus(400)
})

// create an invite
router.post('/:chatId/accept', requireBasicAuth, async function (req, res) {
    // send response
    res.sendStatus(400)
})

// add a message
router.post('/:chatId/message', requireBasicAuth, async function (req, res) {
    // send response
    res.sendStatus(400)
})

// create an invite
router.post('/:chatId/invite', requireBasicAuth, async function (req, res) {
    // send response
    res.sendStatus(400)
})

// get a particular chat
router.get('/:chatId', requireBasicAuth, async function (req, res) {
    const chatId = req.params.chatId
    const chat = await findChatById(chatId)
    res.send(chat)
})

// update a chat 
router.put('/:chatId', requireBasicAuth, async function (req, res) {
    // validate
    const user = req.user
    const chatId = req.params.chatId
    const chat = await findChatById(chatId)
    if (!chat || (chat.ownerId.toString() !== user._id.toString())) {
        return res.sendStatus(404)
    }
    const newTopic = req.body.topic
    if (!newTopic) {
        return res.status(400).send('topic required')
    }

    try {
        chat.topic = newTopic
        const updatedChat = await updateChat(chat)
        console.log('Updated chat', updatedChat)
        res.send(updatedChat)    
    }
    catch(error) {
        console.log(error),
        res.sendStatus(500)
    }
})

// list all chats
router.get('/', requireBasicAuth, async function (req, res) {
    const user = req.user
    const chats = await findChatsForUser(user)
    res.send(chats)
})

// create a new chat
router.post('/', requireBasicAuth, async function (req, res) {
    // validate incoming parameters
    const owner = req.user
    const topic = req.body.topic
    if (!topic) {
        return res.status(400).send("Topic required")
    }

    try {
        // use data layer
        const chat = await createChat(owner, topic)

        // send response
        res.send(chat)    
    }
    catch (err) {
        res.sendStatus(500)
    }
})

export default router