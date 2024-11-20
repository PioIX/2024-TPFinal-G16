'use client';
import {
  Collapse,
  Container,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap';
import { useUser } from '@auth0/nextjs-auth0/client';
import { usePathname } from 'next/navigation';
import PageLink from './PageLink';
import AnchorLink from './AnchorLink';
import styles from './Header.module.css';
import { useState, useEffect } from 'react';

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isLoading } = useUser();
  const toggle = () => setIsOpen(!isOpen);
  const [imageLupa, setImageLupa] = useState('/images/lupa.png');
  const [imageHome, setImageHome] = useState('/images/home.png');
  const [imageChat, setImageChat] = useState('/images/chat.png');
  const [imageSaved, setImageSaved] = useState('/images/saved.png');

  const handleImageLupaChange = () => {
    setImageLupa('/images/lupaClicked.png');
    setImageHome('/images/home.png');
    setImageChat('/images/chat.png');
    setImageSaved('/images/saved.png')
  };
  const handleImageHomeChange = () => {
    setImageHome('/images/homeClicked.png');
    setImageChat('/images/chat.png');
    setImageSaved('/images/saved.png')
    setImageLupa('/images/lupa.png')
  };
  const handleImageChatChange = () => {
    setImageChat('/images/chatClicked.png');
    setImageHome('/images/home.png')
    setImageSaved('/images/saved.png')
    setImageLupa('/images/lupa.png')
  };
  const handleImageSavedChange = () => {
    setImageSaved('/images/savedHover.png');
    setImageHome('/images/home.png');
    setImageChat('/images/chat.png');
    setImageLupa('/images/lupa.png')
  };

  return (
    <div className="nav-container" data-testid="navbar">
      <Navbar style={{ backgroundColor: '#151b23', color: '#238636' }} expand="md">
        <Container
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          className="mw-100"
        >
          <Nav
            className={styles.mrAuto}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '2rem', // Add spacing between icons
            }}
            navbar
            data-testid="navbar-items"
          >
            {user && (
              <>
                <NavItem>
                  <div
                    onClick={handleImageHomeChange}
                    style={{
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <PageLink href="/csr" className="nav-link m-0" testId="navbar-csr">
                      <img
                        src={imageHome}
                        style={{
                          display: 'block',
                        }}
                        width="40"
                        height="40"
                        alt="Home"
                      />
                    </PageLink>
                  </div>
                </NavItem>
                <NavItem>
                  <div
                    onClick={handleImageLupaChange}
                    style={{
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <PageLink href="/external" className="nav-link m-0" testId="navbar-external">
                      <img
                        src={imageLupa}
                        style={{
                          display: 'block',
                        }}
                        width="40"
                        height="40"
                        alt="Search"
                      />
                    </PageLink>
                  </div>
                </NavItem>
                <NavItem>
                  <img
                    src="./images/logo.png"
                    style={{
                      margin: 0,
                      padding: 0,
                      display: 'block',
                    }}
                    width="200"
                    height="130"
                    alt="Logo"
                  />
                </NavItem>
                <NavItem>
                  <div
                    onClick={handleImageSavedChange}
                    style={{
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <PageLink href="/ssr" className="nav-link m-0" testId="navbar-ssr">
                      <img
                        src={imageSaved}
                        style={{
                          display: 'block',
                        }}
                        width="40"
                        height="40"
                        alt="Saved"
                      />
                    </PageLink>
                  </div>
                </NavItem>
                <NavItem>
                  <div
                    onClick={handleImageChatChange}
                    style={{
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <PageLink href="/external" className="nav-link m-0" testId="navbar-external">
                      <img
                        src={imageChat}
                        style={{
                          display: 'block',
                        }}
                        width="40"
                        height="40"
                        alt="Chat"
                      />
                    </PageLink>
                  </div>
                </NavItem>
                <NavItem>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <UncontrolledDropdown nav inNavbar data-testid="navbar-menu-desktop">
                      <DropdownToggle nav caret id="profileDropDown">
                        <img
                          src={user.picture}
                          alt="Profile"
                          style={{
                            width: '57px',
                            height: '57px',
                            objectFit: 'cover',
                            borderRadius: '50%', // Ensure it's a circle
                            display: 'block',
                          }}
                          decode="async"
                          data-testid="navbar-picture-desktop"
                        />
                      </DropdownToggle>
                      <DropdownMenu>
                        <DropdownItem header data-testid="navbar-user-desktop">
                          {user.name}
                        </DropdownItem>
                        <DropdownItem className="dropdown-profile" tag="span">
                          <PageLink href="/profile" icon="user" testId="navbar-profile-desktop">
                            Profile
                          </PageLink>
                        </DropdownItem>
                        <DropdownItem id="qsLogoutBtn">
                          <AnchorLink href="/api/auth/logout" icon="power-off" testId="navbar-logout-desktop">
                            Log out
                          </AnchorLink>
                        </DropdownItem>
                      </DropdownMenu>
                    </UncontrolledDropdown>
                  </div>
                </NavItem>
              </>
            )}
          </Nav>
        </Container>
      </Navbar>
    </div>
  );
};

export default NavBar;
