export const getShortConversationName = (friendlyName, user) => {
  const conversationName = friendlyName.split("|");
  const is1v1Conversation = conversationName.length === 2;
  const currentUser = `${user.lastName}, ${user.firstName}`;
  const [firstUser, secondUser, otherText] = conversationName;

  const displayedUser = firstUser === currentUser ? secondUser : firstUser;
  const groupTitle = `${displayedUser} ${otherText ?? ""}`;

  return is1v1Conversation ? displayedUser : groupTitle;
};
