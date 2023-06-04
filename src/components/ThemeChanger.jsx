import React, { useState } from 'react';
import { TbMoonStars, TbSun } from 'react-icons/tb';
import '../styles/ThemeChanger.scss';

const ThemeChanger = () => {
  const [iconTheme, setIconTheme] = useState(localStorage.getItem('theme') ? localStorage.getItem('theme') : 'light');

  const styles = {
    /* light theme */
    'bg-light': '#ffffff',
    'sidebar-light': '#f2f3f5',
    'navbar-light': '#e3e5e8',
    'user-bg-light': '#e9e9e9',
    'span-color-light': '#8f8f8f',
    'icon-color-light': '#191923',
    'icon-bg-hover-light': '#dadada',
    'icon-color-hover-light': '#000000',
        
    /* dark theme */
    'bg-dark': '#191923',
    'sidebar-dark': '#232330',
    'navbar-dark': '#1c1c24',
    'user-bg-dark': '#252533',
    'span-color-dark': '#8f8f8f',
    'icon-color-dark': '#ffffff',
    'icon-bg-hover-dark': '#363643',
    'icon-color-hover-dark': '#ffffff'
  };

  const toogleTheme = () => {
    setIconTheme(iconTheme === 'light' ? 'dark' : 'light');
    localStorage.setItem('theme', iconTheme === 'light' ? 'dark' : 'light');
  };

  document.documentElement.style.setProperty('--bg', iconTheme === 'light' ? styles['bg-light'] : styles['bg-dark']);
  document.documentElement.style.setProperty('--sidebar', iconTheme === 'light' ? styles['sidebar-light'] : styles['sidebar-dark']);
  document.documentElement.style.setProperty('--navbar', iconTheme === 'light' ? styles['navbar-light'] : styles['navbar-dark']);
  document.documentElement.style.setProperty('--user-bg', iconTheme === 'light' ? styles['user-bg-light'] : styles['user-bg-dark']);
  document.documentElement.style.setProperty('--span-color', iconTheme === 'light' ? styles['span-color-light'] : styles['span-color-dark']);
  document.documentElement.style.setProperty('--icon-color', iconTheme === 'light' ? styles['icon-color-light'] : styles['icon-color-dark']);
  document.documentElement.style.setProperty('--icon-bg-hover', iconTheme === 'light' ? styles['icon-bg-hover-light'] : styles['icon-bg-hover-dark']);
  document.documentElement.style.setProperty('--icon-color-hover', iconTheme === 'light' ? styles['icon-color-hover-light'] : styles['icon-color-hover-dark']);

  return (
    <section className="profile-theme-changer" onClick={toogleTheme}>
      <p>Current theme: {iconTheme}</p>
      {iconTheme === 'light' ? <TbSun /> : <TbMoonStars />}
    </section>
  );
};

export default ThemeChanger;
