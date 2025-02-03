import { Router } from "express";
import { requireBasicAuth } from "../auth/authController.js";
import { createUser, setUserPassword } from "./userData.js";

const router = Router()

// get a particular user
router.get('/:userId', requireBasicAuth, async function (req, res) {
    // validate parameters
    const id = req.params.userId
    if (req.user._id != id) {
        return res.sendStatus(403)
    }
    
    // send response
    res.send(req.user)
})

// list all users
router.get('/', async function (req, res) {
    res.sendStatus(403)
})

router.post('/', async (req, res) => {
    // extract/validate parameters
    const { username, fullName, companyName, password } = req.body
    if (!(username && fullName && password)) {
        return res.status(400).send("Missing one of username, fullName or password")
    }

    // use data layer
    try {
        const newUser = await createUser(username, fullName, companyName)
        await setUserPassword(username, password)

        // send result
        res.send(newUser)    
    }
    catch (error) {
        res.sendStatus(500)
    }
})

export default router