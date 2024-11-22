import React from 'react';
import Link from 'next/link';

import NavBarItem from './NavBarItem';

const PageLink = ({ onClick, children, href, className, icon, tabIndex, testId, userSub = '' }) => {
  return (
    <Link legacyBehavior href={`${href}/${userSub}`}>
      <a>
        <NavBarItem onClick={onClick} href={href} className={className} icon={icon} tabIndex={tabIndex} testId={testId}>
          {children}
        </NavBarItem>
      </a>
    </Link>
  );
};

export default PageLink;
