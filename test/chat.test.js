import './testDb.js'

import { 
    createUser, 
    findUserById, 
    findUserByUsername, 
    updateUser,
    setUserPassword,
    findUserVerifyPassword
} from '../user/userData.js'

describe('user data layer', () => {

    it('should create a user with a username', async () => {
        //execute
        const user = await createUser('tonye', 'Tony Enerson', 'InceptionU')

        // assert/verify
        expect(user).toBeDefined()
        expect(user.username).toEqual('tonye')
        expect(user.fullName).toEqual('Tony Enerson')
        expect(user.companyName).toEqual('InceptionU')
    })

    it('should find a user by username', async () => {
        // setup
        await createUser('tonye', 'Tony Enerson', 'InceptionU')

        // execute
        const user = await findUserByUsername('tonye')

        // test
        expect(user.username).toEqual('tonye')
        expect(user.fullName).toEqual('Tony Enerson')
        expect(user.companyName).toEqual('InceptionU')
    })

    it('should find a user by id', async () => {
        // setup
        const createdUser = await createUser('tonye', 'Tony Enerson', 'InceptionU')

        // execute
        const user = await findUserById(createdUser._id)

        // test
        expect(user.username).toEqual('tonye')
        expect(user.fullName).toEqual('Tony Enerson')
        expect(user.companyName).toEqual('InceptionU')
    })

    it('should not create a user with a number for a username', async () => {
        const user = await createUser(12, 'Tony Enerson', 'InceptionU')
        expect(user.username).toEqual('12')
    })

    it('should require a username', async () => {
        // execute/verify
        await expect(createUser(null, 'Tony Enerson', 'InceptionU'))
            .rejects.toThrow('user validation failed: username: Path `username` is required.')
    })

    it('should require a full name', async () => {
        //execute/verify
        await expect(createUser('tonye', null, 'InceptionU'))
            .rejects.toThrow('user validation failed: fullName: Path `fullName` is required.')
    })

    it('should require a username that is not an empty string', async () => {
        // execute/verify
        await expect(createUser('', 'Tony Enerson', 'InceptionU'))
            .rejects.toThrow('user validation failed: username: Path `username` is required.')
    })

    it('should require a full name that is not an empty string', async () => {
        //execute/verify
        await expect(createUser('tonye', '', 'InceptionU'))
            .rejects.toThrow('user validation failed: fullName: Path `fullName` is required.')
    })

    it('should not require a company name', async () => {
        // setup
        const createdUser = await createUser('tonye', 'Tony Enerson')

        // execute
        const user = await findUserById(createdUser._id)

        // test
        expect(user.companyName).toEqual('')  // default value
    })

    it('should not create a user with a duplicate username', async () => {
        //setup
        await createUser('tonye', 'Tony Enerson', 'InceptionU')

        // execute
        await expect(createUser('tonye', 'Tony Eggbert', 'Cupcakes4Fun'))
            .rejects.toThrow('User name already exists')
    })

    it.skip('should update a user', async () => {
        //setup
        const createdUser = await createUser('tonye', 'Tony Enerson', 'InceptionU')
        const update = { ...createdUser, companyName: 'Cupcakes4Fun' }

        // execute 
        await updateUser(update)

        // assert
        const actual = await findUserById(createdUser._id)
        expect(actual.companyName).toEqual('Cupcakes4Fun')
    })

    it.skip('should not update a username', async () => {
        //setup
        const createdUser = await createUser('tonye', 'Tony Enerson', 'InceptionU')
        const update = { ...createdUser, username: 'tonye2' }

        // execute / verify
        await expect(updateUser(update))
            .rejects.toThrow("Cannot change username")
    })

    it.skip('should set and verify a password (and not expose the password)', async () => {
        //setup
        const createdUser = await createUser('tonye', 'Tony Enerson', 'InceptionU')

        // execute 
        await setUserPassword(createdUser.username, "12345") // same my luggage!
        const actual = await findUserVerifyPassword(createdUser.username, "12345")

        // assert
        expect(actual).toBeDefined()
        expect(actual.username).toEqual('tonye')
        expect(actual.pwHash).toBeUndefined()      
    })

    it.skip('should not verify a user without a password', async () => {
        //setup
        const createdUser = await createUser('tonye', 'Tony Enerson', 'InceptionU')

        // execute 
        const actual = await findUserVerifyPassword(createdUser.username, "12345")

        // assert
        expect(actual).toBeUndefined()
    })

    it.skip('should not verify a user with a bad pasword', async () => {
        //setup
        const createdUser = await createUser('tonye', 'Tony Enerson', 'InceptionU')
        await setUserPassword(createdUser.username, "12345") // same my luggage!

        // execute 
        const actual = await findUserVerifyPassword(createdUser.username, "54321")

        // assert
        expect(actual).toBeUndefined()
    })

})


import { acceptInvite, createChat, findChatById, findChatInvitesForUser, findChatsForUser, inviteUserToChat } from '../chat/chatData.js'

describe('chat data layer', () => {

    let chatOwner
    let chatMember

    beforeEach(async () => {
        chatOwner = await createUser('owner', 'Chat Owner', 'some org')
        chatMember = await createUser('member', 'Chat Member', 'some other org')
    })

    it('should create a chat', async () => {
        // execute
        const chat = await createChat(chatOwner, "Some Topic")

        // verify
        expect(chat.topic).toEqual("Some Topic")
        expect(chat.ownerId).toEqual(chatOwner._id)
    })

    it('should find a chat by Id', async () => {
        //setup
        const createdChat = await createChat(chatOwner, "Some Topic")

        // execute
        const chat = await findChatById(createdChat._id)

        // verify
        expect(chat.topic).toEqual("Some Topic")
        expect(chat.ownerId).toEqual(chatOwner._id)        
    })

    it('findChatsForUser should find chats that belongs to an owner', async () => {
        //setup
        await createChat(chatOwner, "Some Topic")

        // execute
        const chats = await findChatsForUser(chatOwner)

        // verify
        expect(chats.length).toEqual(1)
        expect(chats[0].topic).toEqual("Some Topic")        

    })

    it('should find chat invitations', async () => {
        //setup
        const createdChat = await createChat(chatOwner, "Some Topic")
        await inviteUserToChat(createdChat, chatMember)

        // execute
        const invitedChats = await findChatInvitesForUser(chatMember)

        // verify
        expect(invitedChats.length).toEqual(1)
        expect(invitedChats[0].topic).toEqual("Some Topic")        
    })

    it('should accept an invitation', async () => {
        //setup
        const createdChat = await createChat(chatOwner, "Some Topic")
        await inviteUserToChat(createdChat, chatMember)
        const invitedChats = await findChatInvitesForUser(chatMember)
        
        // execute
        await acceptInvite(chatMember, invitedChats[0])

        // assert 
        const afterAccept = await findChatInvitesForUser(chatMember)
        expect(afterAccept.length).toEqual(0)
    })

    it('findChatsForUser should find chats that a user has been invited to', async () => {
        //setup
        const createdChat = await createChat(chatOwner, "Some Topic")
        await inviteUserToChat(createdChat, chatMember)
        await acceptInvite(chatMember, createdChat)

        // execute
        const chats = await findChatsForUser(chatMember)

        // verify
        expect(chats.length).toEqual(1)
        expect(chats[0].topic).toEqual("Some Topic")        
    })

    it('findChatsForUser should both chats that a user has been invited to and ones they have created', async () => {
        //setup
        const createdChat = await createChat(chatOwner, "Some Topic")

        const invitedChat = await createChat(chatMember, "Some Other Topic")
        await inviteUserToChat(invitedChat, chatOwner)
        await acceptInvite(chatOwner, invitedChat)

        // execute
        const chats = await findChatsForUser(chatOwner)

        // verify
        expect(chats.length).toEqual(2)
    })

})
