import React from 'react';
import styles from "./Logo.module.css";
import Logo from "./Logo.jsx"
import AnchorLink from './AnchorLink'; // Asegúrate de importar el componente

const Hero = () => (
  <div className="text-center" data-testid="hero" style={{width: "100%", display:"flex", flexDirection: "row", alignItems: "center", textAlign: "center", margin: "0 auto", padding: "0"}}>
    <Logo/>
  </div>
);

export default Hero;
