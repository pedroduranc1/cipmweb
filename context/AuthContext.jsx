import { useState, useEffect, createContext } from "react";

export const AuthContext = createContext();

export function AuthProvider(props) {
    const { children } = props;
    const [User, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(false)
    }, [])

    const data = {
        accessToken: "2710",
        User: "Prueba",
        // login,
        // logout,
        // updateUser,
    };

    if (loading) return null;

    return <AuthContext.Provider value={data}>{children}</AuthContext.Provider>;
}
