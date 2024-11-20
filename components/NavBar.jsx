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
  const [imageNotification, setImageNotification] = useState('/images/notification.png');

  const handleImageLupaChange = () => {
    setImageLupa('/images/lupaClicked.png');
    setImageHome('/images/home.png');
    setImageChat('/images/chat.png');
    setImageNotification('/images/notification.png')
  };
  const handleImageHomeChange = () => {
    setImageHome('/images/homeClicked.png');
    setImageChat('/images/chat.png');
    setImageNotification('/images/notification.png')
    setImageLupa('/images/lupa.png')
  };
  const handleImageChatChange = () => {
    setImageChat('/images/chatClicked.png');
    setImageHome('/images/home.png')
    setImageNotification('/images/notification.png')
    setImageLupa('/images/lupa.png')
  };
  const handleImageNotificationChange = () => {
    setImageNotification('/images/notificationClicked.png');
    setImageHome('/images/home.png');
    setImageChat('/images/chat.png');
    setImageLupa('/images/lupa.png')
  };

  return (
    <div className="nav-container" data-testid="navbar">
      <Navbar style={{ backgroundColor: '#151b23', color: '#238636'}} expand='md'>
        <Container>
          
          <NavbarToggler onClick={toggle} data-testid="navbar-toggle" />
          <Collapse isOpen={isOpen} navbar>
            <Nav className={styles.mrAuto} navbar data-testid="navbar-items">
              {user && (
                <>
                  <NavItem>
                    <div onClick={handleImageHomeChange} style={{ cursor: 'pointer', display: 'inline-block'}}>
                      <PageLink href="/csr" className="nav-link p-0 m-0" testId="navbar-csr">
                          <img src={imageHome} width={"45px"} height={"45px"}></img>
                      </PageLink>
                    </div>
                  </NavItem>
                  <NavItem>
                    <div onClick={handleImageLupaChange} style={{ cursor: 'pointer', display: 'inline-block' }}>
                      <PageLink href="/external" className="nav-link p-0 m-0" testId="navbar-external">
                          <img src={imageLupa} width="45px" height="45px"/>
                      </PageLink>
                    </div>
                  </NavItem>
                  <img src='./images/logo.png' width={"200px"} height={"130px"}></img>
                  <NavItem>
                    <div onClick={handleImageChatChange} style={{ cursor: 'pointer', display: 'inline-block' }}>
                      <PageLink href="/external" className="nav-link p-0 m-0" testId="navbar-external">
                        <img src={imageChat} width={"45px"} height={"45px"}></img>
                      </PageLink>
                    </div>
                  </NavItem>
                </>
              )}
                <Nav className="d-none d-md-block" style={{display:"flex", alignContent: "center", alignItems:"center"}} navbar>
                {!isLoading && !user && (
                  <NavItem id="qsLoginBtn">
                    <AnchorLink
                      href="/api/auth/login"
                      className="btn btn-primary btn-margin"
                      tabIndex={0}
                      testId="navbar-login-desktop">
                      Log in
                    </AnchorLink>
                  </NavItem>
                )}
                {user && (
                  <UncontrolledDropdown nav inNavbar data-testid="navbar-menu-desktop" >
                    <DropdownToggle style={{display:"flex", verticalAlign:"middle", alignContent: "center", alignItems:"center"}}nav caret id="profileDropDown">
                      <img
                        src={user.picture}
                        alt="Profile"
                        className="nav-user-profile rounded-circle"
                        verticalAlign="middle"
                        width="60"
                        height="60"
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
                )}
              </Nav>
              {!isLoading && !user && (
                <Nav className="d-md-none" navbar>
                  <AnchorLink
                    href="/api/auth/login"
                    className="btn btn-primary btn-block"
                    tabIndex={0}
                    testId="navbar-login-mobile">
                    Log in
                  </AnchorLink>
                </Nav>
              )}
              {user && (
                <Nav
                  id="nav-mobile"
                  className="d-md-none justify-content-between"
                  navbar
                  data-testid="navbar-menu-mobile">
                  <NavItem style={{verticalAlign: "middle"}}>
                    <span className="user-info">
                      <img
                        src={user.picture}
                        alt="Profile"
                        className="nav-user-profile d-inline-block rounded-circle"
                        width="55"
                        height="55"
                        decode="async"
                        data-testid="navbar-picture-mobile"
                        verticalAlign="middle"
                      />
                      <h6 className="d-inline-block" data-testid="navbar-user-mobile">
                        {user.name}
                      </h6>
                    </span>
                  </NavItem>
                  <NavItem>
                    <PageLink href="/profile" icon="user" testId="navbar-profile-mobile">
                      Profile
                    </PageLink>
                  </NavItem>
                  <NavItem id="qsLogoutBtn">
                    <AnchorLink
                      href="/api/auth/logout"
                      className="btn btn-link p-0"
                      icon="fa-solid fa-power-off"
                      testId="navbar-logout-mobile">
                      Log out
                    </AnchorLink>
                  </NavItem>
                </Nav>
              )}
            </Nav>
          </Collapse>
        </Container>
      </Navbar>
    </div>
  );
};

export default NavBar;
