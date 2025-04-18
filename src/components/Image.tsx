import copy from "./../assets/copy.svg";
import exportImage from "./../assets/export.svg";
import { ExportImage } from "../Utility";
import { useState } from "react";
//weird name because of the conflict with the built-in Image
function ImageComponent({
  path,
  name,
  show,
  setPopup,
  setConfig,
}: {
  path: string;
  name: string;
  show: boolean;
  setPopup: (text: string) => void;
  setConfig: (url: string, open: boolean) => void;
}) {
  //{"{img:interface/Glues/Models/UIWorgen/UIWORGENCLOUDS01.PNG:512:175:l}"}
  const [hovering, setHovering] = useState(false);

  const imageRef = `https://raw.githubusercontent.com/goobyspace/Interface/refs/heads/main/${path}`;

  const copyImage = () => {
    ExportImage(path, imageRef, setPopup);
  };

  const configureImage = () => {
    setConfig(path, true);
  };

  return (
    <>
      <div
        className={show ? "preview-image" : "hidden"}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
      >
        <p className={hovering ? "title-hover" : "hidden"}> {name}</p>
        <div className="image-container">
          <div className={hovering ? "button-hover" : "hidden"}>
            <button onClick={copyImage}>
              <img src={copy} alt="copy" />
            </button>
            <button onClick={configureImage}>
              <img src={exportImage} alt="export" />
            </button>
            <a href={`https://github.com/goobyspace/Interface/blob/main/${path}`} target="_blank">
              <img src="https://github.githubassets.com/favicons/favicon-dark.svg" alt="github" />
            </a>
          </div>
          <img
            className={`image ${hovering ? "image-hover" : ""}`}
            src={imageRef}
            alt={name}
            loading="lazy" //this should only load images when theyre in view
          />
        </div>
      </div>
    </>
  );
}

export default ImageComponent;
