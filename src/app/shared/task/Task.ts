class Task extends TaskTransferable {
  get user(): User {
    throw new Error('Not implemented!');
  }
  set user(user: User) {
    this.userID = user.id;
  }
}
