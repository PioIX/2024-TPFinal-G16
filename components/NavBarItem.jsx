import React from 'react';
import { usePathname } from 'next/navigation';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import PersonIcon from '@mui/icons-material/Person';

const NavBarItem = ({ children, href, className, icon, tabIndex, testId }) => {
  const pathname = usePathname();
  const activeClass = 'navbar-item-active';
  const activeClasses = className ? `${className} ${activeClass}` : activeClass;

  console.log("ICONOOOO",icon)

  return (
    <span className="d-inline-flex align-items-center navbar-item">
      {icon && icon == "user" && <PersonIcon className="mr-3" />}
      {icon && icon == "power-off" && <PowerSettingsNewIcon className="mr-3" />}
      <span className={pathname === href ? activeClasses : className} tabIndex={tabIndex} data-testid={testId}>
        {children}
      </span>
    </span>
  );
};

export default NavBarItem;
