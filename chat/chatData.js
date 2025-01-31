import { connect } from "../db.js";

const mongoose = await connect();

const chatSchema = mongoose.Schema({
  topic: { type: String, required: true },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
});

const Chat = mongoose.model("chat", chatSchema, "chats");

const inviteSchema = mongoose.Schema({
  chatId: { type: mongoose.Schema.Types.ObjectId, ref: "chat" },
  inviteeId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
});

const Invite = mongoose.model("invite", inviteSchema, "invites");

export async function createChat(owner, topic) {
  return Chat.create({
    topic,
    ownerId: owner._id,
  });
}

export async function findChatById(id) {
  return await Chat.findById(id);
}

// updating a chat really means changing the topic
export async function updateChat(chat) {}

export async function deleteAllChats() {
  await Chat.deleteMany();
  await Invite.deleteMany();
}

export async function inviteUserToChat(chat, user) {
  return await Invite.create({
    chatId: chat._id,
    inviteeId: user._id,
  });
}

// find all invites this user has not accepted
export async function findChatInvitesForUser(user) {
  const invites = await Invite.find({ inviteeId: user._id }).populate("chatId");
  return invites.map((invite) => invite.chatId);
}

// when a user accepts an invite

export async function acceptInvite(user, chat) {
  // TODO: check the invite actually exists

  await Invite.deleteOne({
    inviteeId: user._id,
    chatId: chat._id,
  });

  const acceptedChat = await findChatById(chat._id);
  acceptedChat.members.push([user._id]);
  await acceptedChat.save();
}

// find all chats that this user owns or is an invitee to
export async function findChatsForUser(userId) {
  return [];
}

// add a new message to a chat
export async function addMessageToChat(chat, user, message) {}
