"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

import MainHeaderBackground from "./main-header-background";
import logoImg from "@/assets/logo.png";
import classes from "./main-header.module.css";
import NavLink from "./nav-link";

export default function MainHeader() {
  const [isMobile, setIsMobile] = useState(false); // State for toggling mobile menu

  const toggleMenu = () => {
    setIsMobile(!isMobile); // Toggle the mobile menu state
  };

  return (
    <>
      <MainHeaderBackground />
      <header className={classes.header}>
        <Link className={classes.logo} href="/">
          <Image src={logoImg} alt="A plate with food on it" priority />
          NextLevel Food
        </Link>

        {/* Hamburger icon */}
        <div className={classes.hamburger} onClick={toggleMenu}>
          <span className={classes.bar}></span>
          <span className={classes.bar}></span>
          <span className={classes.bar}></span>
        </div>

        {/* Navigation links */}
        {/* Web View */}
        {!isMobile && (
          <nav className={classes.nav}>
            <ul>
              <li>
                <NavLink href="/meals">Browse Meals</NavLink>
              </li>
              <li>
                <NavLink href="/community">Foodies Community</NavLink>
              </li>
            </ul>
          </nav>
        )}
         {/* Mobile View */}
        {isMobile && (
          <nav className={classes.nav}>
            <ul
              className={`${isMobile ? classes.navList : ""} ${
                isMobile ? classes.active : ""
              }`}
            >
              <li onClick={()=>{
                setIsMobile(!isMobile);
              }}>
                <NavLink href="/meals">Browse Meals</NavLink>
              </li>
              <li onClick={()=>{
                setIsMobile(!isMobile);
              }}>
                <NavLink href="/community">Foodies Community</NavLink>
              </li>
            </ul>
          </nav>
        )}
      </header>
    </>
  );
}
