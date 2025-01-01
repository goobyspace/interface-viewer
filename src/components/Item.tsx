import { useState } from "react";
import ArrowDown from "./../assets/arrow_down.svg";
import ArrowRight from "./../assets/arrow_right.svg";

function Item({
  path,
  name,
  recursiveCount,
  show,
  children,
  setImage,
}: {
  path: string;
  name: string;
  recursiveCount: number;
  show: boolean;
  children: JSX.Element[] | undefined;
  setImage?: (url: string) => void | undefined;
}) {
  const [collapsed, setCollapsed] = useState<boolean>(false);
  //{"{img:interface/Glues/Models/UIWorgen/UIWORGENCLOUDS01.PNG:512:175:l}"}
  //we have to somehow assemble the above thing from the path string

  const onMouseEnter = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!path.includes(".PNG") || !setImage) return;
    setImage(`https://raw.githubusercontent.com/goobyspace/Interface/refs/heads/main/${path}`);
    console.log(`https://raw.githubusercontent.com/goobyspace/Interface/refs/heads/main/${path}`);
    console.log(e);
  };
  return (
    <>
      <div className={show ? "item" : "hidden"}>
        <span style={{ left: `${recursiveCount * 20}px` }} onMouseEnter={onMouseEnter}>
          {children && children.length > 0 && (
            <img
              src={collapsed ? ArrowRight : ArrowDown}
              alt="collapse arrow"
              className="arrow"
              onClick={() => {
                if (children && children.length > 0) {
                  setCollapsed(!collapsed);
                }
              }}
            />
          )}
          {path.includes(".PNG") ? (
            <a
              href={`https://raw.githubusercontent.com/goobyspace/Interface/refs/heads/main/${path}`}
              target="_blank"
              rel="noreferrer"
            >
              {name}
            </a>
          ) : (
            name
          )}
        </span>
        <div className="border" />
        <div className={collapsed ? "collapsed" : "open"}>{children}</div>
      </div>
    </>
  );
}

export default Item;
