import Description from "./components/Description";
import SearchBar from "./components/SearchBar";
import Settings from "./components/Settings";
import Content from "./components/Content";
import "./App.css";
import { useState } from "react";

function App() {
  const [search, setSearch] = useState<string>("");
  const [width, setWidth] = useState<number>(0);
  const [imageCount, setImageCount] = useState<number>(0);

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
      <div id="container">
        <Description />
        <div id="top-bar">
          <SearchBar setSearchValue={setSearchValue} />
          <Settings setSettings={setSettings} />
          <a href="https://github.com/goobyspace/Interface">
            <img
              src="https://github.githubassets.com/favicons/favicon-dark.svg"
              alt="GitHub logo"
            />
            Interface files
          </a>
        </div>
        <Content search={search} width={width} imageCount={imageCount} />
      </div>
    </>
  );
}

export default App;
