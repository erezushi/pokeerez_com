'use client';

import MenuRounded from '@mui/icons-material/MenuRounded';
import { Button } from '@mui/material';
import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import { Suspense, useCallback, useEffect, useState } from 'react';

const Navbar = () => {
  if (typeof window === 'undefined') {
    throw Error('NavBar should only render on the client.');
  }
  const [isMenuCollapsed, setIsMenuCollapsed] = useState(true);

  const toggleMenuCollapse = useCallback(() => {
    setIsMenuCollapsed((oldValue) => !oldValue);
  }, []);

  const mediaQuery = window.matchMedia('(max-width: 465px)');

  useEffect(() => {
    setIsMenuCollapsed(mediaQuery.matches);
  }, []);

  return (
    <Suspense fallback={<></>}>
      <div
        className={clsx({
          'navbar-container': true,
          collapsed: isMenuCollapsed,
        })}
      >
        {mediaQuery.matches && (
          <Button
            onClick={toggleMenuCollapse}
            className="navbar-collapse-button"
          >
            <MenuRounded htmlColor={isMenuCollapsed ? 'black' : 'white'} />
          </Button>
        )}
        <div className="navbar">
          <Link href="/">
            <Image
              className="site-logo"
              src="/PokéErez Logo.webp"
              height={50}
              width={50}
              alt="PokéErez channel logo"
              priority
            />
          </Link>
        </div>
      </div>
    </Suspense>
  );
};

export default Navbar;
