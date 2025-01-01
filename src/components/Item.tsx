import { useEffect, useState } from "react";
import ArrowDown from "./../assets/arrow_down.svg";
import ArrowRight from "./../assets/arrow_right.svg";

function Item({
  path,
  name,
  recursiveCount,
  show,
  children,
}: {
  path: string;
  name: string;
  recursiveCount: number;
  show: boolean;
  children: JSX.Element[] | undefined;
}) {
  const [collapsed, setCollapsed] = useState<boolean>(true);
  const [headers, setHeaders] = useState<JSX.Element[]>([]);
  const [images, setImages] = useState<JSX.Element[]>([]);

  useEffect(() => {
    const newHeaders: JSX.Element[] = [];
    const newImages: JSX.Element[] = [];

    if (children && children.length > 0) {
      children.forEach((child) => {
        if (child.props.path.includes(".PNG")) {
          newImages.push(child);
        } else {
          newHeaders.push(child);
        }
      });
    }

    setImages(newImages);
    setHeaders(newHeaders);
  }, [children]);

  return (
    <>
      <div className={show ? "item" : "hidden"}>
        <span className="item-text" style={{ left: `${recursiveCount * 20}px` }}>
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
        <div className={`collapsable ${collapsed ? "collapsed" : "open"}`}>
          <div className="headers">{headers}</div>
          <div className="images">{images}</div>
        </div>
      </div>
    </>
  );
}

export default Item;
