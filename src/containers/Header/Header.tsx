import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Navbar from 'react-bootstrap/Navbar';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import GoogleLogin from '../../google/components/GoogleLogin';
import { selectLanguage } from '../../redux/slices/language';
import Language, { getLanguageName } from '../../types/Language';
import './Header.scss';

export default function Header() {

    const navigate = useNavigate();
    const language = useSelector(selectLanguage);

    const dropDownItems = Object.values(Language).map((languageOption: Language) => {

        return (
            <NavDropdown.Item className='header__dropdown-item' onClick={() => {
                if (languageOption !== language) {
                    navigate(`/${languageOption}/browser/home`);
                }
            }}>{getLanguageName(languageOption)}</NavDropdown.Item>
        );
    });

    return (
        <header className='header'>
            <Navbar className='header__navbar'>
                <Navbar.Brand className='header__brand'>Platform</Navbar.Brand>

                <NavDropdown className='header__dropdown' title={getLanguageName(language)}>
                    {dropDownItems}
                </NavDropdown>

                <Nav.Link className='header__link' onClick={() => navigate(`/${language}/browser/home`)}>Strona Główna</Nav.Link>
            </Navbar>

            <section className='header__search'>
                <GoogleLogin></GoogleLogin>
            </section>
        </header>
    );
}