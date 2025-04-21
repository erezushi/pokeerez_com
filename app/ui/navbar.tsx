'use client';

import MenuRounded from '@mui/icons-material/MenuRounded';
import { Button, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useState } from 'react';

const Navbar = () => {
  const [isMenuCollapsed, setIsMenuCollapsed] = useState(true);

  const toggleMenuCollapse = useCallback(() => {
    setIsMenuCollapsed((oldValue) => !oldValue);
  }, []);

  return (
    <div className={clsx({ 'navbar-container': true, collapsed: isMenuCollapsed })}>
      <Button onClick={toggleMenuCollapse} className="navbar-collapse-button">
        <MenuRounded htmlColor={isMenuCollapsed ? 'black' : 'white'} />
      </Button>
      <div className="navbar">
        <Link href="/">
          <Image
            className="site-logo"
            src="/images/PokéErez Logo.webp"
            height={50}
            width={50}
            alt="PokéErez channel logo"
            priority
          />
        </Link>
        <Link href="YouTube" className="navbar-link">
          YouTube
        </Link>
        <Link href="Twitch" className="navbar-link">
          Twitch
        </Link>
        <Link href="Schedule" className="navbar-link">
          Stream Schedule
        </Link>
        <Link href="Twitter" className="navbar-link">
          Twitter
        </Link>
        <Link href="Bluesky" className="navbar-link">
          Bluesky
        </Link>
        <Link href="Collection" className="navbar-link">
          Shiny Collection
        </Link>
        <Link href="ErOrBros" className="navbar-link">
          ErOr Bros.
        </Link>
        <FormControl>
          <InputLabel id="websites-input-label">Websites</InputLabel>
          <Select labelId="websites-input-label" id="websites-select" variant="standard">
            <MenuItem>
              <Link href="Randomizer" className="dropdown-link">
                Random Pokémon Generator
              </Link>
            </MenuItem>
            <MenuItem>
              <Link href="NameGame" className="dropdown-link">
                The Name Game
              </Link>
            </MenuItem>
          </Select>
        </FormControl>
      </div>
    </div>
  );
};

export default Navbar;
