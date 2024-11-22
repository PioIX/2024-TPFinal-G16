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
          <Collapse className={styles.mrAuto} style={{display: "flex", alignContent: "center", alignItems:"center"}}isOpen={isOpen} navbar>
            <Nav style={{ backgroundColor: '#151b23', color: '#238636', display: 'flex', flexDirection: 'row'}} className={styles.mrAuto} navbar data-testid="navbar-items">
              {user && (
                <>
                  <NavItem className={styles.desktopOnly}>
                    <div onClick={handleImageHomeChange} style={{ cursor: 'pointer', display: 'inline-block'}}>
                      <PageLink href="/tweet" className="nav-link p-0 m-0" testId="navbar-csr">
                          <img style={{width:"45px", height:"45px"}} src={imageHome}></img>

                      </PageLink>
                    </div>
                  </NavItem>
                  <NavItem className={styles.desktopOnly}>
                    <div onClick={handleImageLupaChange} style={{ cursor: 'pointer', display: 'inline-block' }}>
                      <PageLink href="/search" className="nav-link p-0 m-0" testId="navbar-external">
                          <img style={{width:"45px", height:"45px"}} src={imageLupa}/>
                      </PageLink>
                    </div>
                  </NavItem>
                  <img src='/images/logo.png' className={styles.desktopOnly}width={"200px"} height={"100px"} alt='Logo'></img>
                  <NavItem className={styles.desktopOnly}>
                    <div onClick={handleImageChatChange} style={{ cursor: 'pointer', display: 'inline-block' }}>
                      <PageLink href="/chats" className="nav-link p-0 m-0" testId="navbar-external">
                        <img style={{width:"45px", height:"45px"}} src={imageChat}></img>

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
                      Iniciar Sesión
                    </AnchorLink>
                  </NavItem>
                )}
                {user && (
                  <UncontrolledDropdown nav inNavbar data-testid="navbar-menu-desktop" >
                    <DropdownToggle style={{display:"flex", alignContent: "center", alignItems:"center"}}nav caret id="profileDropDown">
                      <img
                        src={user.picture}
                        alt="Profilee"
                        className="nav-user-profile rounded-circle"
                        width="60"
                        height="60"
                        decode="async"
                        data-testid="navbar-picture-desktop"
                      />
                    </DropdownToggle>
                    <DropdownMenu style={{backgroundColor: "#151b23", color: '#238636'}}>
                      <DropdownItem style={{color: '#ffffff'}} header data-testid="navbar-user-desktop">
                        {user.name}
                      </DropdownItem>

                      <div className={styles.Squarelink} style={{width: "100%"}}>
                        <DropdownItem className="dropdown-profile" tag="span">
                          <PageLink href="/profilee" icon="user" className={styles.link} testId="navbar-profile-desktop" userSub={user.sub}>
                                  Perfil
                          </PageLink>
                        </DropdownItem>
                      </div>

                      <div className={styles.Squarelink} style={{width: "100%"}}>
                        <DropdownItem id="qsLogoutBtn">
                          <AnchorLink href="/api/auth/logout" className={styles.link} icon="power-off" testId="navbar-logout-desktop">
                                Cerrar Sesión
                          </AnchorLink>
                        </DropdownItem>
                      </div>

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
                    Iniciar Sesión
                  </AnchorLink>
                </Nav>
              )}
              {user && (
                <Nav
                  id="nav-mobile"
                  style={{backgroundColor:"#151b23", color:"#ffffff"}}
                  className="d-md-none justify-content-between"
                  navbar
                  data-testid="navbar-menu-mobile">
                  <div style={{display:"flex", width:"100%", gap:"7%", flexDirection:"column", alignItems:"center", textAlign:"center", justifyContent:"space-around"}}>
                    <NavItem>
                      <div onClick={handleImageHomeChange} style={{ cursor: 'pointer', display: 'inline-block'}}>
                        <PageLink href="/tweet" className="nav-link p-0 m-0" testId="navbar-csr">
                            <img style={{width:"30px", height:"30px"}} src={imageHome}></img>
                        </PageLink>
                      </div>
                    </NavItem>
                    <NavItem>
                      <div onClick={handleImageLupaChange} style={{ cursor: 'pointer', display: 'inline-block' }}>
                        <PageLink href="/search" className="nav-link p-0 m-0" testId="navbar-external">
                            <img style={{width:"30px", height:"30px"}} src={imageLupa}/>
                        </PageLink>
                      </div>
                    </NavItem>
                    <img src="/images/logo.png" width={"80px"} heigth={"80px"}></img>
                    <NavItem>
                      <div onClick={handleImageChatChange} style={{ cursor: 'pointer', display: 'inline-block' }}>
                        <PageLink href="/chats" className="nav-link p-0 m-0" testId="navbar-external">
                          <img style={{width:"30px", height:"30px"}} src={imageChat}></img>
                        </PageLink>
                      </div>
                    </NavItem>
                  </div>
                  <UncontrolledDropdown nav inNavbar data-testid="navbar-menu-desktop" >
                      <DropdownToggle style={{display:"flex", alignContent: "center", alignItems:"center"}}nav caret id="profileDropDown">
                        <img
                          src={user.picture}
                          alt="Profile"
                          className="nav-user-profile rounded-circle"
                          width="50"
                          height="50"
                          decode="async"
                          data-testid="navbar-picture-desktop"
                        />
                      </DropdownToggle>
                      <DropdownMenu style={{backgroundColor: "#151b23", color: '#238636', zIndex: "9999"}}>
                        <DropdownItem style={{color: '#ffffff'}} header data-testid="navbar-user-desktop">
                          {user.name}
                        </DropdownItem>
                        <div className={styles.Squarelink} style={{width: "100%"}}>
                          <DropdownItem className="dropdown-profile" tag="span">
                            <PageLink href="/profilee" icon="user" className={styles.link} testId="navbar-profile-desktop" userSub={user.sub}>
                                    Perfil
                            </PageLink>
                          </DropdownItem>
                        </div>
                        <div className={styles.Squarelink} style={{width: "100%"}}>
                          <DropdownItem id="qsLogoutBtn">
                            <AnchorLink href="/api/auth/logout" className={styles.link} icon="power-off" testId="navbar-logout-desktop">
                                  Cerrar Sesión
                            </AnchorLink>
                          </DropdownItem>
                        </div>
                      </DropdownMenu>
                     </UncontrolledDropdown>
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
