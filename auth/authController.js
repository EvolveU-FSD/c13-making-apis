import { Router } from "express"
import { findUserVerifyPassword } from "../user/userData.js"

const router = Router()

async function getUserFromRequest(req) {
    let user
    if (req.headers['authorization']) {
        const authorization = req.headers['authorization']
        const [scheme, credential] = authorization.split(' ')
        if (scheme === 'Basic') {
            const usernamePassword = Buffer.from(credential, 'base64').toString()
            const [username, password] = usernamePassword.split(':')
            user = await findUserVerifyPassword(username, password)
        }        
    }
    return user
}

export async function requireBasicAuth(req, res, next) {
    req.user = await getUserFromRequest(req)
    // send back 401 if there is no authentication header
    if (!req.user) {
        res.sendStatus(401)
        return
    }
    next()
}

router.post('/login', async function (req, res) {
    // validate incoming parameters
    const { username, password } = req.body
    if (!username || !password) {
        res.sendStatus(400)
        return
    }

    // use data layer
    const user = await findUserVerifyPassword(username, password)

    // send response
    if (user) {
        // send cookie here!
        res.send(user)
    }
    else {
        res.sendStatus(401)
    }
})

router.get('/currentUser', async function (req, res) {
    let user = await getUserFromRequest(req)
    res.send(user)
})

router.get('/logout', async function (req, res) {
    // clear cookie here if needed
    res.send({status: 'ok'})
})

export default router