import { Router } from "express";
import { requireBasicAuth } from "../auth/authController.js";

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
    // send response
    res.sendStatus(400)
})

// update a chat 
router.put('/:chatId', requireBasicAuth, async function (req, res) {
    // send response
    res.sendStatus(400)
})

// list all chats
router.get('/', requireBasicAuth, async function (req, res) {
    res.sendStatus(400)
})

// create a new chat
router.post('/', requireBasicAuth, async (req, res) => {
    res.sendStatus(400)
})

export default router