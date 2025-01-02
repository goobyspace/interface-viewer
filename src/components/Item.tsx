import { useState } from "react";
import ArrowDown from "./../assets/arrow_down.svg";
import ArrowRight from "./../assets/arrow_right.svg";

function Item({
  path,
  name,
  recursiveCount,
  show,
  headers,
  images,
}: {
  path: string;
  name: string;
  recursiveCount: number;
  show: boolean;
  headers: JSX.Element[] | undefined;
  images: JSX.Element[] | undefined;
}) {
  const [collapsed, setCollapsed] = useState<boolean>(true);
  const [firstOpen, setFirstOpen] = useState<boolean>(false);

  return (
    <>
      <div className={show ? "item" : "hidden"}>
        <span className="item-text" style={{ left: `${recursiveCount * 20}px` }}>
          {((headers && headers.length > 0) || (images && images.length > 0)) && (
            <img
              src={collapsed ? ArrowRight : ArrowDown}
              alt="collapse arrow"
              className="arrow"
              onClick={() => {
                if (!firstOpen) setFirstOpen(true);
                setCollapsed(!collapsed);
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
        <div className={`collapsable ${collapsed ? "collapsed" : "open"}`}>
          {firstOpen ? <div className="headers">{headers}</div> : null}
          {firstOpen ? <div className="images">{images}</div> : null}
        </div>
      </div>
    </>
  );
}

export default Item;
