import { useState, useEffect, createContext } from "react";
import { Token } from "../db/Token";
import { User } from "../db/User";

const tokenCtrl = new Token();
const UserCtrl = new User();

export const AuthContext = createContext();

export function AuthProvider(props) {
    const { children } = props;
    const [User, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            const token = tokenCtrl.getToken();

            if (!token) {
                logout();
                setLoading(false);
                return;
            } else {
                setLoading(false)
                const data = JSON.parse(localStorage.getItem('ui'));
                setUser(data);
            }

            // if (tokenCtrl.hasExpired(token)) {
            //     logout();
            // } else {
            //     await login(token);
            // }
        })();
    }, []);

    const login = async (token, uid) => {
        try {
            let IsPremium = false;
            setLoading(true);
            tokenCtrl.setToken(token);
            const response = await UserCtrl.getMe(uid);
            const premiumresp = await UserCtrl.isPremium(uid);

            if(premiumresp){
                IsPremium = premiumresp.isPremium
            }

            let newData = {
                ...response,
                IsPremium
            }

            localStorage.setItem("ui", JSON.stringify(newData));
            const data = JSON.parse(localStorage.getItem('ui'));
            setUser(data);
            setLoading(false);
        } catch (error) {
            // console.error(error);
            setLoading(false);
        }
    };

    const logout = () => {
        tokenCtrl.removeToken();
        localStorage.removeItem("ui")
        setToken(null);
        setUser(null);
    };

    const updateUser = async (data) => {
        const newUserData = await UserCtrl.getMe(data.uid)
        setUser(newUserData);
    };

    const data = {
        accessToken: token,
        User,
        login,
        logout,
        updateUser,
    };

    if (loading) return null;

    return <AuthContext.Provider value={data}>{children}</AuthContext.Provider>;
}
