import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

import { useDLRGStore } from '../src/useDLRGStore';
import { getNotLoadedUser } from '../src/appWriteService';

export { RouteGuard };

function RouteGuard({ publicRoutes, children }) {
    const router = useRouter();
    const userStore = useDLRGStore((state) => state.user);

    const [user, setUser] = useState(getNotLoadedUser());

    const pathIsProtected = publicRoutes.indexOf(router.pathname) === -1;

    useEffect(() => {
        setUser(userStore);
    }, [userStore]);

    useEffect(() => {
        
        var isLoading = user != null && user.name === "notloaded";      

        if (!isLoading && user == null && pathIsProtected) {
            // Redirect route, you can point this to /login
            router.push('/signin');
        }
    }, [user, pathIsProtected]);

    var isLoading = user != null && user.name === "notloaded";     
    if ((isLoading || user == null) && pathIsProtected) {
        return <></>;
    }

    return children;
}