import Header from '../common/header';
import { useLocation } from 'react-router-dom';

const MainLayout = ({ children }) => {
    const { pathname } = useLocation();
    const shouldDisplayNavbar = !['', '/logout'].includes(pathname);

    return (
        <>
            {shouldDisplayNavbar && <Header />}
            {children}
        </>
    );
};

export default MainLayout;
