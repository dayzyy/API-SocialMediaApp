export const is_following = (user1, user2) => {
  return user1.following.some(friend => friend.id === user2.id)
}
