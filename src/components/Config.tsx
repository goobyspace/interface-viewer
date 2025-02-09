import React, { useEffect, useRef, useState } from "react";
import { ExportImage, GetImage } from "../Utility";

function Config({
  path,
  open,
  setPopup,
  setConfig,
}: {
  path: string;
  open: boolean;
  setPopup: (text: string) => void;
  setConfig: (path: string, open: boolean) => void;
}) {
  const [scale, setScale] = useState<number>(100);
  const [directionIndex, setDirectionIndex] = useState<number>(1);
  const [direction, setDirection] = useState<string>("l");
  const [copyString, setCopyString] = useState<string>("");
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);

  const options = useRef(["l", "c", "r"]);
  const optionsTranslated = useRef(["Left", "Center", "Right"]);

  const imageRef = `https://raw.githubusercontent.com/goobyspace/Interface/refs/heads/main/${path}`;

  useEffect(() => {
    async function getTRPString() {
      const values = await GetImage(path, imageRef, direction, scale);
      if (typeof values === "object" && values !== null) {
        const { TRPString, width, height } = values;
        setCopyString(TRPString);
        setWidth(width);
        setHeight(height);
      } else {
        setCopyString("");
      }
    }
    getTRPString();
  }, [path, imageRef, direction, scale]);

  const handleScaleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setScale(parseInt(event.target.value));
  };

  const handleDirectionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDirectionIndex(parseInt(event.target.value));
    setDirection(options.current[parseInt(event.target.value) - 1]);
  };

  const copyImage = () => {
    ExportImage(path, imageRef, setPopup, direction, scale);
  };

  return (
    <div className={open ? "config-menu" : "hidden"}>
      <div className="config-canvas" onClick={() => setConfig("", false)}>
        <div className="config-card" onClick={(e) => e.stopPropagation()}>
          <div
            className="config-image"
            style={{
              textAlign: optionsTranslated.current[directionIndex - 1].toLowerCase() as
                | "left"
                | "right"
                | "center",
            }}
          >
            <img
              src={imageRef}
              alt={path}
              style={{
                width: `${width}px`,
                height: `${height}px`,
              }}
            />
          </div>
          <div className="config-settings">
            <div className="config-setting">
              <span className="config-label">
                <label htmlFor="width">Image Scale:</label>
                <span>{scale}%</span>
              </span>
              <input
                type="range"
                id="scale"
                name="scale"
                min="1"
                max="1000"
                value={scale}
                onChange={handleScaleChange}
              />
            </div>
            <div className="config-setting">
              <span className="config-label">
                <label htmlFor="width">Align Direction:</label>
                <span>{optionsTranslated.current[directionIndex - 1]}</span>
              </span>
              <input
                type="range"
                id="direction"
                name="direction"
                min="1"
                max="3"
                value={directionIndex}
                onChange={handleDirectionChange}
              />
            </div>
            <p>{copyString}</p>
            <button onClick={copyImage}>Export</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Config;
