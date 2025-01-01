import React, { useState } from "react";

function SearchBar({
  setSearchValue,
}: {
  setSearchValue: (value: string) => void | undefined;
}) {
  const [search, setSearch] = useState<string>("");

  const onSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSearchValue(search);
  };

  return (
    <>
      <form onSubmit={onSubmit}>
        <input
          className="searchbar"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search"
        />
      </form>
    </>
  );
}

export default SearchBar;
