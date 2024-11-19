import React from 'react';
import AnchorLink from './AnchorLink';
import styles from "./Logo.module.css"

const Logo = () => (
  <div style={{display: "flex", flexDirection: "column"}}>
    <div>
      <img src='./images/loguito.png' width={"400px"} height={"500px"}></img>
    </div>
    <div style={{display: "flex", flexDirection: "row", alignItems: "center", height: "15em", color:"#ffffff"}}>
      <h1 className="mb-4" data-testid="hero-title">
        Owl, donde tus ideas vuelan alto
      </h1>
      <p className="lead" data-testid="hero-lead">
        Bienvenido a Owl, la red social donde puedes compartir tus pensamientos y conectar con otros.{' '}
        <AnchorLink
          href="/api/auth/login"
          className="link"
          tabIndex={0}
          testId="hero-join-link">
          Únete a nosotros
        </AnchorLink>{' '}
        y comienza a volar alto en el mundo de las ideas.
      </p>
    </div>
  </div>
);

export default Logo;
