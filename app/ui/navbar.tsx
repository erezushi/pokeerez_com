'use client';

import MenuRounded from '@mui/icons-material/MenuRounded';
import { Button } from '@mui/material';
import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';

const Navbar = () => {
  const [isMenuCollapsed, setIsMenuCollapsed] = useState(true);

  const toggleMenuCollapse = useCallback(() => {
    setIsMenuCollapsed((oldValue) => !oldValue);
  }, []);

  let mediaQuery: MediaQueryList | { matches: boolean };

  try {
    mediaQuery = window.matchMedia('(max-width: 465px)');
  } catch (error) {
    mediaQuery = { matches: false };
  }

  useEffect(() => {
    setIsMenuCollapsed(mediaQuery.matches);
  }, [mediaQuery.matches]);

  return (
    <div
      className={clsx({
        'navbar-container': true,
        collapsed: isMenuCollapsed,
      })}
    >
      {mediaQuery.matches && (
        <Button onClick={toggleMenuCollapse} className="navbar-collapse-button">
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
        <Link href="YouTube">YouTube</Link>
              priority
            />
          </Link>
          <Link href="YouTube">YouTube</Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
