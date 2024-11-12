import React from 'react';
import './Footer.module.css';  // Estilos para el footer

const Footer = () => {
  return (  
    <footer className="footer">
      <div className="footer-content">
        {/* Logo y nombre */}
        <div className="footer-logo">
          <img src="/logo-owl.png" alt="Logo de Owl" className="footer-logo-img" />
          <p className="footer-name">Owl Social Network</p>
        </div>

        {/* Enlaces principales */}
        <div className="footer-links">
          <ul>
            <li><a href="/acerca-de">Acerca de</a></li>
            <li><a href="/terminos-y-condiciones">Términos y Condiciones</a></li>
            <li><a href="/privacidad">Privacidad</a></li>
            <li><a href="/faq">FAQ</a></li>
            <li><a href="/contacto">Contacto</a></li>
          </ul>
        </div>

        {/* Redes sociales */}
        <div className="footer-socials">
          <a href="https://twitter.com/owl" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-twitter"></i>
          </a>
          <a href="https://instagram.com/owl" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-instagram"></i>
          </a>
          <a href="https://facebook.com/owl" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-facebook"></i>
          </a>
        </div>
      </div>

      {/* Copyright */}
      <div className="footer-copyright">
        <p>© 2024 Owl. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;
