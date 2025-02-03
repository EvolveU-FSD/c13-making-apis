import { createChat, inviteUserToChat } from '../chat/chatData.js'
import { createUser } from '../user/userData.js'
import { startServer, shutdownServer, doGet, doPost, createUserAndLogin, createCredentialHeaders } from './testServer.js'

describe('/api/chat', () => {

    let baseUrl 
    beforeEach(async () => {
        baseUrl = await startServer()
    })

    afterEach(async () => {
        await shutdownServer(baseUrl)
    })

    it.skip('should create a chat with a POST to /api/chat', async () => {
        const owner = await createUserAndLogin()
        const expectedChat = {
            topic: "Creating APIs for Fun and Profit!", 
        }

        // execute
        const actual = await doPost(baseUrl+"/api/chat", expectedChat)

        // verify
        expect(actual.topic).toEqual(expectedChat.topic)
        expect(actual.ownerId).toEqual(owner._id)
        expect(actual.members).toEqual([])
        expect(actual.messages).toEqual([])
    })

    it.skip('should find a chat', async () => {
        // setup
        const owner = await createUserAndLogin()
        const expectedChat = await createChat(owner, "Using IDs in urls")

        // execute
        const actual = await doGet(baseUrl+"/api/chat/"+expectedChat._id)

        // verify
        expect(actual).toBeDefined()
        expect(actual.topic).toEqual("Using IDs in urls")
    })

    it.skip('should not find a chat if you arent a member', async () => {
        // setup
        const owner = await createUser("owner", "Owen Ner", "Owner Corp.")
        const expectedChat = await createChat(owner, "Using IDs in urls")
        
        await createUserAndLogin("notowner", 'password')

        // execute
        const response = await fetch(baseUrl+"/api/chat/"+expectedChat._id, {
            headers: createCredentialHeaders('notowner', 'password')
        })

        // expect
        expect(response.status).toEqual(403)
    })

    it.skip('should list chats you own with /api/chat', async () => {
        // setup
        const owner = await createUserAndLogin()
        const expectedChat = await createChat(owner, "Getting multiple records with /")

        // execute
        const actual = await doGet(baseUrl+"/api/chat")

        // verify
        expect(actual).toBeDefined()
        expect(actual.length).toEqual(1)
        expect(actual[0].topic).toEqual(expectedChat.topic)
    })

    it.skip('should update a chat with a PUT to /api/chat/:id', async () => {
        // setup
        const owner = await createUserAndLogin()
        const expectedChat = await createChat(owner, "Updating records with PUT")

        // execute
        const actual = await doPut(baseUrl+"/api/chat/"+expectedChat.id, {
            topic: "New topic"
        })

        // verify
        expect(actual).toBeDefined()
        expect(actual.topic).toEqual("New topic")
    })

    it.skip('should create an invite with a post to /api/chat/:id/invite', async () => {
        // setup
        const owner = await createUserAndLogin()
        const expectedChat = await createChat(owner, "Nested lists in objects")
        const member = await createUser("member", "Member Joe", "Member Corp")

        // execute
        await doPost(baseUrl+"/api/chat"+expectedChat._id+"/invite")

        // verify with data layer
        const actualInvites = await findChatInvitesForUser(member)
        expect(actualInvites.length).toEqual(1)
        expect(actualInvites[0].topic).toEqual(expectedChat.topic)
    })

    it.skip('should find invites with a get to /api/chat/invite', async () => {
        // setup
        const owner = await createUser("owner", "Owen Ner", "Owner Corp.")
        const expectedChat = await createChat(owner, "Nested lists in objects")
        const member = await createUserAndLogin()
        await inviteUserToChat(expectedChat, member)

        // execute
        const actualInvites = await doGet(baseUrl+"/api/chat/invites")

        // verify with data layer
        expect(actualInvites.length).toEqual(1)
        expect(actualInvites[0].topic).toEqual(expectedChat.topic)
    })

    it.skip('should accept an invite /api/chat/:id/accept', async () => {
        throw new Error('Implement me!')
    })

    it.skip('should list me as a member after accepting an invite at /api/chat/:id', async () => {
        throw new Error('Implement me!')
    })

    it.skip('should find chats I am a member of with /api/chat', async () => {
        throw new Error('Implement me!')
    })

    it.skip('should add a message to a chat with a POST to /api/chat/:id/message', async () => {
        throw new Error('Implement me!')
    })

})