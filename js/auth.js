const Auth = {
  login(username, password) {
    const user = USERS[username.trim().toLowerCase()];
    if (!user || user.password !== password) return null;
    return {
      username: username.trim().toLowerCase(),
      role: user.role,
      displayName: user.displayName
    };
  },

  isLoggedIn() {
    return !!Store.getSession();
  },

  isAdmin() {
    const s = Store.getSession();
    return s && s.role === "admin";
  },

  getCurrentUser() {
    return Store.getSession();
  },

  logout() {
    Store.clearSession();
  }
};
