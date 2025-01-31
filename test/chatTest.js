import './testDb.js'

import {  createUser } from '../user/userData.js'
import { acceptInvite, createChat, findChatById, findChatInvitesForUser, findChatsForUser, inviteUserToChat } from '../chat/chatData.js'

describe.skip('chat data layer', () => {

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

    it('should find chat invitations', async () => {
        //setup
        const createdChat = await createChat(chatOwner, "Some Topic")
        await inviteUserToChat(createdChat, chatMember)

        // execute
        const invitedChats = await findChatInvitesForUser(chatMember)

        // verify
        expect(invitedChats.length).toEqual(1)
        expect(invitedChats[0].topic).toEqual("Some Topic")     
        
        // verify chat membership (or lack thereof) here
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

        // verify chat membership here!
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

    it('findChatsForUser should find chats that a user has accepted invitations to', async () => {
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

    it('findChatsForUser should find both chats that a user has accepted invitations to and ones they have created', async () => {
        //setup
        await createChat(chatOwner, "Some Topic")

        const invitedChat = await createChat(chatMember, "Some Other Topic")
        await inviteUserToChat(invitedChat, chatOwner)
        await acceptInvite(chatOwner, invitedChat)

        // execute
        const chats = await findChatsForUser(chatOwner)

        // verify
        expect(chats.length).toEqual(2)
    })

    
})
