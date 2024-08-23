import useAuth from "./useAuth";

const useLogout = () => {
    const { setAuth , setConnectValide , setSessionValide} = useAuth();

    const logout = async () => {
        const attribute = '465gh4n65dthyty56try'
        setConnectValide(false);
        setSessionValide(false);
        localStorage.removeItem(attribute);
        localStorage.removeItem("connectValide");
        setAuth({});
    }

    return logout;
}

export default useLogout