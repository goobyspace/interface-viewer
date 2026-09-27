import Description from "./components/Description";
import SearchBar from "./components/SearchBar";
import Settings from "./components/Settings";
import Content from "./components/Content";
import ModeToggle from "./components/ModeToggle";
import CookieConsent from "./components/CookieConsent";
import Export from "./assets/export.svg";
import "./App.css";
import { useState } from "react";
import type { CSSProperties } from "react";
import Cookies from "universal-cookie";

const cookies = new Cookies(null, { path: "/", sameSite: "strict", maxAge: 60 * 60 * 24 * 365 });

function App() {
  const [search, setSearch] = useState<string>("");
  const [width, setWidth] = useState<number>(1280);
  const [imageCount, setImageCount] = useState<number>(0);
  const [forever, setForever] = useState<boolean>(false);
  const [cookieConsent, setCookieConsent] = useState<boolean | undefined>(() => {
    const consent = cookies.get("cookieConsent");
    return typeof consent === "boolean" ? consent : undefined;
  });

  const updateCookieConsent = (accepted: boolean) => {
    setCookieConsent(accepted);
    cookies.set("cookieConsent", accepted);
    if (accepted) {
      cookies.set("width", width);
      cookies.set("imageCount", imageCount);
      cookies.set("retail", forever);
    } else {
      ["width", "imageCount", "retail"].forEach((name) => cookies.remove(name, { path: "/" }));
    }
  };

  const setSearchValue = (value: string) => {
    setSearch(value);
  };

  const setSettings = (width: number, imageCount: number) => {
    setWidth(width);
    setImageCount(imageCount);
  };

  //quick summary of the application:
  //Main things first: <Content> is the meat and bones
  //load in a json that has the index for the repository, parse it and create JSX items from it
  //if item ends in .PNG, create an <Image> component
  //else create a <Item> component which functions as both header & folder for arrays of images and headers
  //these items can be collapsed and expanded and images will only load when the folder is expanded
  //because otherwise you're immediately loading in a million images and your firefox crashes
  //all of this is done recursively in an useEffect hook that gets way too complex
  //but tldr itll do 3 things, group all images, all items & see if the search term is in any of them
  //then pass it back to the item component that called it

  //when you search, it will give each item that isnt included a show tag which will give it a hidden class
  //finally we have settings which let you change the width of the table and the images so you can fit more/less on your screen
  //this was mostly so i had an excuse to fuck with cookies

  return (
    <>
      <div
        id="container"
        style={{ "--content-max-width": `${width / 16}rem` } as CSSProperties}
      >
        <Description />
        <div id="top-bar">
          <SearchBar setSearchValue={setSearchValue} />
          <div className="toolbar-actions">
            <ModeToggle
              forever={forever}
              setForever={setForever}
              cookiesEnabled={cookieConsent === true}
            />
            <Settings
              setSettings={setSettings}
              cookiesEnabled={cookieConsent === true}
              setCookiesEnabled={updateCookieConsent}
            />
            <a
              className="interface-link"
              href="https://github.com/goobyspace/Interface"
              aria-label="Interface files"
              title="Interface files"
            >
              <img src={Export} alt="" />
              <span className="control-label">Interface files</span>
            </a>
          </div>
        </div>
        <Content search={search} imageCount={imageCount} forever={forever} />
      </div>
      {cookieConsent === undefined && <CookieConsent setConsent={updateCookieConsent} />}
    </>
  );
}

export default App;
