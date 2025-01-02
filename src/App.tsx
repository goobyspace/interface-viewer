import Description from "./components/Description";
import SearchBar from "./components/SearchBar";
import Settings from "./components/Settings";
import Content from "./components/Content";
import "./App.css";
import { useState } from "react";

function App() {
  const [search, setSearch] = useState<string>("");
  const [width, setWidth] = useState<number>(0);
  const [percentage, setPercentage] = useState<number>(0);

  const setSearchValue = (value: string) => {
    setSearch(value);
  };

  const setSettings = (width: number, percentage: number) => {
    setWidth(width);
    setPercentage(percentage);
  };

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
        <Content search={search} width={width} percentage={percentage} />
      </div>
    </>
  );
}

export default App;
