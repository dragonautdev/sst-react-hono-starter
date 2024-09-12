import { trpcApi, UserSession } from "../lib/api";

/**
 * This represents some generic auth provider API, like Firebase.
 */
export const authHandler = {
  isAuthenticated: false,
  signin(callback: VoidFunction) {
    authHandler.isAuthenticated = true;
    setTimeout(callback, 100); // fake async
  },
  signout(callback: VoidFunction) {
    authHandler.isAuthenticated = false;
    setTimeout(callback, 100);
  }
};

export const loadSession = async (): Promise<UserSession | undefined> => {
  let token = localStorage.getItem("session");
  if (!token) {
    // no token. let's try to parse it from the url
    const url = new URL(window.location.href);

    token = url.searchParams.get("access_token")
    // get it from hash
    if (!token && url.hash) {
      const hashParams = new URLSearchParams(url.hash.substring(1))
      token = hashParams.get('access_token')
    } 
    if (token) {
      localStorage.setItem("session", token);
      window.location.href = window.origin;
    } else {
      window.location.href = "/auth/sign-in";
      
    }
  } else {
    
    try {
      const session = await trpcApi.account.getUser.query();
      return session
      
    } catch (error: any) {
      localStorage.removeItem('session');

      window.location.href = "/auth/sign-in"
    }
  }   
}

/*export const ensureLoggedIn = () => {
  // token is stored
  let token = localStorage.getItem("session");
  
  if (!token) {
    // no token. let's try to parse it from the url
    const url = new URL(window.location.href);

    token = url.searchParams.get("access_token")
    // get it from hash
    if (!token && url.hash) {
      const hashParams = new URLSearchParams(url.hash.substring(1))
      token = hashParams.get('access_token')
    } 
    if (token) {
      localStorage.setItem("session", token);
      window.location.href = window.origin;
    } else {
      window.location.href = "/auth/sign-in";
      
    }
  } else {
    try {
      await getSession();
    } catch (error: any) {
      localStorage.removeItem('session');

      window.location.href = "/auth/sign-in"
    }
    
  }
}*/