import dirToJson from "dir-to-json";
import fs from "node:fs";

const filterWords = [
  "script.js",
  "package.json",
  "package-lock.json",
  "index.json",
  ".gitignore",
  "node_modules",
  ".git",
  "README.md",
  ".blp",
  ".BLP",
];

const filteredItems = [];
let blpCount = 0;

dirToJson("./", { sortType: true }).then((dirTree) => {
  console.log("The following files/folders were found and filtered out:");
  const ungrouped = [];

  const removeBlp = dirTree.children.filter(function filterBlp(item) {
    if (item.name.includes(".BLP") || item.name.includes(".blp")) {
      blpCount++;
      return false;
    }

    if (item.children) {
      return (item.children = item.children.filter(filterBlp)).length;
    }

    return true;
  });

  const filteredTree = {
    parent: "",
    path: "",
    name: ".",
    type: "directory",
    children: removeBlp
      .map((item) => {
        if (filterWords.some((word) => item.name.includes(word))) {
          if (item.name.endsWith(".blp") || item.name.endsWith(".BLP")) {
            blpCount++;
          } else filteredItems.push(item.name);
        } else if (item.type === "file") {
          ungrouped.push(item);
        } else if (item !== null) return item;
      })
      .filter((item) => item),
  };

  filteredTree.children.push({
    parent: "",
    path: "Ungrouped",
    name: "Ungrouped",
    type: "directory",
    children: ungrouped,
  });

  fs.writeFile("index.json", JSON.stringify(filteredTree), (err) => {
    if (err) {
      console.log(err);
    }
  });

  console.log("Filtered items:", filteredItems);
  console.log("BLP count:", blpCount);
});
