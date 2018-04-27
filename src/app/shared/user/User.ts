class User extends UserTransferable {
  get tasks(): Task {
    throw Error("Not implemented!");
  }
}
