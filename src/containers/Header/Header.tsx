import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Navbar from 'react-bootstrap/Navbar';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import GoogleLogin from '../../google/components/GoogleLogin';
import { selectLanguage } from '../../redux/slices/language';
import Language, { getLanguageName } from '../../types/Language';
import './Header.scss';
import { useState } from 'react';
import { selectDataTheme, setDataTheme } from '../../redux/slices/application';
import { useAppDispatch } from '../../redux/hook';

export default function Header() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const language = useSelector(selectLanguage);
    const dataTheme = useSelector(selectDataTheme);
    
    const dropDownItems = Object.values(Language).map((languageOption: Language, index: number) => {

        return (
            <NavDropdown.Item className='header__dropdown-item' key={index} onClick={() => {
                if (languageOption !== language) {
                    navigate(`/${languageOption}/browser/home`);
                }
            }}>{getLanguageName(languageOption)}</NavDropdown.Item>
        );
    });

    return (
        <header className='header'>
            <Navbar className='header__navbar' expand="sm">
                <Navbar.Brand className='header__brand'>Platform</Navbar.Brand>

                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">

                        <NavDropdown className='header__dropdown' id="basic-nav-dropdown" title={getLanguageName(language)}>
                            {dropDownItems}
                        </NavDropdown>

                        <Nav.Link eventKey="2" className='header__link' onClick={() => navigate(`/${language}/browser/home`)}>Strona Główna</Nav.Link>
                    </Nav>

                    <section className='header__search'>
                        <Nav.Link onClick={() => changeColorMode()} className='header__theme-icon'>
                            {dataTheme === "light" && <i className="bi bi-sun-fill"></i>}
                            {dataTheme === "dark" && <i className="bi bi-sun"></i>}
                        </Nav.Link>
                        <GoogleLogin></GoogleLogin>
                    </section>

                </Navbar.Collapse>
            </Navbar>
        </header>
    );

    function changeColorMode() {

        const htmlElement = document.querySelector('html');

        if (htmlElement) {

            if (htmlElement.getAttribute('data-bs-theme') === 'dark') {

                htmlElement.setAttribute('data-bs-theme', 'light');
                dispatch(setDataTheme("light"));
            } else if (htmlElement.getAttribute('data-bs-theme') === 'light') {

                htmlElement.setAttribute('data-bs-theme', 'dark');
                dispatch(setDataTheme("dark"));
            }
        }
    }
}