import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Twitch' };

const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => (
  <>
    Every other week, I live-stream three hours of Pokémon shiny hunting, or playthroughs when new
    games come out.
    <br />
    Watch my channel & chat here:
    <br />
    <div id="twitch-box" />
    {children}
  </>
);

export default Layout;
