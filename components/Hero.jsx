import React from 'react';
import Logo from './Logo';
import AnchorLink from './AnchorLink'; // Asegúrate de importar el componente

const Hero = () => (
  <div className="hero my-5 text-center" data-testid="hero">
    <Logo testId="hero-logo" />
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
);

export default Hero;
