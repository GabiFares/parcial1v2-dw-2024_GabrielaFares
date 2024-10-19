export const auth = {
  get token() {
    return localStorage.getItem("token");
  },
  get id() {
    return localStorage.getItem("id");
  },

  logout() {
    localStorage.clear();
  },

  getPayload() {
    if (!this.token) return null;
    const arrayToken = this.token.split("."); // Divide el token en 3 partes
    const payload = JSON.parse(atob(arrayToken[1])); // Decodifica la parte del payload
    return payload;
  },

  isAuthenticated() {
    // Comparamos la fecha de expiración del token con la fecha actual
    const payload = this.getPayload();
    if (!payload) return false;
    const expirationTime = payload.exp * 1000;
    const isExpired = Date.now() >= expirationTime;
    if (!!this.token && !isExpired) {
      return true;
    }
    this.logout();
  },

  getRole() {
    const payload = this.getPayload();
    return payload.is_admin;
  },
};
