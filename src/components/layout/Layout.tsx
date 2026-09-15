"use client";

import { ReactNode, useState } from "react";
import Breadcrumb from "./Breadcrumb";
import Footer from "./Footer";
import Header from "./Header";
import MobileMenu from "./MobileMenu";

interface LayoutProps {
  children?: React.ReactNode;
  parent?: string;
  parent_link?: string;
  sub?: string;
  subChild?: string;
  noBreadcrumb?: string;
  headerStyle?: string;
}

export default function Layout({
  children,
  parent = "Home",
  parent_link = "/",
  sub = "",
  subChild = "",
  noBreadcrumb = "",
  headerStyle = "",
}: LayoutProps) {
  const [isToggled, setToggled] = useState(false);

  const toggleClick = () => {
    setToggled((prev) => !prev);

    if (typeof window !== "undefined") {
      document.body.classList.toggle("mobile-menu-active");
    }
  };

  return (
    <>
      {isToggled && (
        <div
          className="body-overlay-1"
          onClick={toggleClick}
        />
      )}

      <Header
        headerStyle={headerStyle}
        isToggled={isToggled}
        toggleClick={toggleClick}
      />

      <MobileMenu
        isToggled={isToggled}
        toggleClick={toggleClick}
      />

      <main className="main">
        <Breadcrumb
          parent={parent}
          parent_link={parent_link}
          sub={sub}
          subChild={subChild}
          noBreadcrumb={noBreadcrumb}
        />
        {children}
      </main>

      <Footer />
    </>
  );
}