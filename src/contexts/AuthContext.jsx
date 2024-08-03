import { createContext, useContext, useReducer } from "react";
import { graphQLFetch } from "../Api";

const AuthContext = createContext(null);

const initialState = {
  user: JSON.parse(localStorage.getItem('userData')) || null,
  isAuthenticated: !!localStorage.getItem('userData'),
};

function reducer(state, action) {
  switch (action.type) {
    case "login":
      return { ...state, user: action.payload, isAuthenticated: true };
    case "logout":
      return { ...state, user: null, isAuthenticated: false };
    case "signup":
      return { ...state, user: action.payload, isAuthenticated: true };
    case "googleLogin":
      return { ...state, user: action.payload, isAuthenticated: true };
    default:
      throw new Error("Unknown action");
  }
}

function AuthProvider({ children }) {
  const [{ user }, dispatch] = useReducer(
    reducer,
    initialState
  );
  //const [isAuthenticated, setIsAuthenticated] = useState(false);

  async function login(email, password) {
    const query = `
      mutation login($email: String!, $password: String!) {
        login(email: $email, password: $password) {
          _id
        }
      }
    `;

    const variables = { email, password };

    try {
      // Send a POST request to the server for login
      const data = await graphQLFetch(query, variables);
      console.log("Data:", data);
      localStorage.setItem('userData', JSON.stringify(data.login));
      dispatch({ type: "login", payload: data.login });
    } catch (error) {
      console.error("Network or server error:", error);
    }
  }


  function googleLogin(googleUser) {
    // Logic to handle Google login
    localStorage.setItem('userData', JSON.stringify(googleUser));
    dispatch({ type: "googleLogin", payload: googleUser });
  };

  function logout() {
    localStorage.removeItem('userData');
    dispatch({ type: "logout" });
  }

  function signup(name, phone, email, password) {
    const newUser = {
      name,
      phone,
      email,
      password
    };
    dispatch({ type: "signup", payload: newUser });
  }

  return (
    <AuthContext.Provider value={{ user: user, isAuthenticated: user !== null, login, logout, signup, googleLogin }}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined)
    throw new Error("AuthContext was used outside AuthProvider");
  return context;
}

export { AuthProvider, useAuth };
