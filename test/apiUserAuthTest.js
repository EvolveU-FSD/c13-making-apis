import { startServer, shutdownServer, doGet, doPost, createCredentialHeaders, createUserAndLogin } from './testServer.js'

import { createUser, findUserByUsername, setUserPassword } from '../user/userData.js'
import { setShowLogs } from '../showRequests.js'

describe('/api/user', () => {

    let baseUrl 
    beforeEach(async () => {
        baseUrl = await startServer()
    })

    afterEach(async () => {
        await shutdownServer(baseUrl)
    })

    it('should allow a user to sign up using a POST to /api/user', async () => {
        const expectedUser = {
            username: "tonye", 
            fullName: "Tony Enerson", 
            companyName: "InceptionU",
            password: '12345', // same as the air sheild
        }

        // execute
        await doPost(baseUrl+"/api/user", expectedUser)

        // verify
        const actual = await findUserByUsername('tonye')
        expect(actual.username).toEqual(expectedUser.username)
        expect(actual.fullName).toEqual(expectedUser.fullName)
        expect(actual.companyName).toEqual(expectedUser.companyName)
    })

    it('should verify a password with /api/auth/login', async () => {
        // setup
        await createUser("tonye", "Tony Enerson", "InceptionU")
        await setUserPassword("tonye", "12345")

        // execute
        const authenticatedUser = await doPost(baseUrl+"/api/auth/login", { username: 'tonye', password: '12345'})

        // verify
        expect(authenticatedUser).toBeDefined()
        expect(authenticatedUser.username).toEqual("tonye")
        expect(authenticatedUser.fullName).toEqual("Tony Enerson")
        expect(authenticatedUser.companyName).toEqual("InceptionU")
    })

    it('should find a logged in user from credentials in request', async () => {
        // setup
        await createUser("tonye", "Tony Enerson", "InceptionU")
        await setUserPassword("tonye", "12345")

        // execute
        const response = await fetch(baseUrl+"/api/auth/currentUser", {
            headers: createCredentialHeaders("tonye", "12345")
        })

        // verify
        expect(response.ok).toEqual(true)
        
        const authenticatedUser = await response.json()

        expect(authenticatedUser).toBeDefined()
        expect(authenticatedUser.username).toEqual("tonye")
        expect(authenticatedUser.fullName).toEqual("Tony Enerson")
        expect(authenticatedUser.companyName).toEqual("InceptionU")
    })

    it('should retrieve a user record (for the right user)', async () => {
        // setup
        setShowLogs(true)
        const user = await createUserAndLogin()

        // execute
        const foundUser = await doGet(baseUrl+"/api/user/" + user._id)

        // verify
        expect(foundUser.username).toEqual(user.username)
        expect(foundUser.fullName).toEqual(user.fullName)
        expect(foundUser.companyName).toEqual(user.companyName)
    })
})