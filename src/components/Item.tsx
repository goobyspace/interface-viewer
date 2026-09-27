import { useState } from "react";
import ArrowDown from "./../assets/arrow_down.svg";
import ArrowRight from "./../assets/arrow_right.svg";
import type { InterfaceStructure } from "../InterfaceStructure";
import { matchesSearch } from "../InterfaceStructure";
import ImageGrid from "./VirtualImageGrid";

function Item({
  node,
  recursiveCount,
  search,
  forever,
  imageCount,
  setPopup,
  setConfig,
}: {
  node: InterfaceStructure;
  recursiveCount: number;
  search: string;
  forever: boolean;
  imageCount: number;
  setPopup: (text: string) => void;
  setConfig: (url: string, open: boolean) => void;
}) {
  const [collapsed, setCollapsed] = useState<boolean>(true);
  const children = node.children?.filter((child) => matchesSearch(child, search)) ?? [];
  const headers = children.filter((child) => !child.path.includes(".PNG"));
  const images = children.filter((child) => child.path.includes(".PNG"));

  return (
    <>
      <div className="item">
        <span className="item-text" style={{ left: `${recursiveCount * 20}px` }}>
          {children.length > 0 && (
            <img
              src={collapsed ? ArrowRight : ArrowDown}
              alt="collapse arrow"
              className="arrow"
              onClick={() => {
                setCollapsed(!collapsed);
              }}
            />
          )}
          {node.path.includes(".PNG") ? (
            <a
              href={`https://raw.githubusercontent.com/goobyspace/Interface/refs/heads/${forever ? 'forever' : 'main'}/${node.path}`}
              target="_blank"
              rel="noreferrer"
            >
              {node.name}
            </a>
          ) : (
            node.name
          )}
        </span>
        <div className="border" />
        {!collapsed && (
          <div className="collapsable open">
            <div className="headers">
              {headers.map((child) => (
                <Item
                  key={child.path}
                  node={child}
                  recursiveCount={recursiveCount + 1}
                  search={search}
                  forever={forever}
                  imageCount={imageCount}
                  setPopup={setPopup}
                  setConfig={setConfig}
                />
              ))}
            </div>
            {images.length > 0 && (
              <div className="images">
                <ImageGrid
                  images={images}
                  imageCount={imageCount}
                  forever={forever}
                  setPopup={setPopup}
                  setConfig={setConfig}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default Item;
