import Description from "./components/Description";
import SearchBar from "./components/SearchBar";
import Content from "./components/Content";
import "./App.css";
import { useState } from "react";

function App() {
  const [search, setSearch] = useState<string>("");

  const setSearchValue = (value: string) => {
    setSearch(value);
  };

  return (
    <>
      <div id="container">
        <Description />
        <div id="top-bar">
          <a href="https://github.com/goobyspace/Interface">
            <img
              src="https://github.githubassets.com/favicons/favicon-dark.svg"
              alt="GitHub logo"
            />
            Interface files
          </a>
          <SearchBar setSearchValue={setSearchValue} />
        </div>
        <Content search={search} />
      </div>
    </>
  );
}

export default App;
