import copy from "./../assets/copy.svg";
import exportImage from "./../assets/export.svg";
import { ExportImage } from "../Utility";
import { useState } from "react";
//weird name because of the conflict with the built-in Image
function ImageComponent({
  path,
  name,
  forever,
  setPopup,
  setConfig,
}: {
  path: string;
  name: string;
  forever: boolean;
  setPopup: (text: string) => void;
  setConfig: (url: string, open: boolean) => void;
}) {
  //{"{img:interface/Glues/Models/UIWorgen/UIWORGENCLOUDS01.PNG:512:175:l}"}
  const [hovering, setHovering] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const imageRef = `https://raw.githubusercontent.com/goobyspace/Interface/refs/heads/${forever ? 'forever' : 'main'}/${path}`;

  const copyImage = () => {
    ExportImage(path, imageRef, setPopup);
  };

  const configureImage = () => {
    setConfig(path, true);
  };

  return (
    <>
      <div
        className="preview-image"
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
            <a href={`https://github.com/goobyspace/Interface/blob/${forever ? 'forever' : 'main'}/${path}`} target="_blank">
              <img src="https://github.githubassets.com/favicons/favicon-dark.svg" alt="github" />
            </a>
          </div>
          <img
            className={`image ${loaded ? "image-loaded" : "image-loading"} ${hovering ? "image-hover" : ""}`}
            src={imageRef}
            alt={name}
            loading="lazy"
            decoding="async"
            onLoad={() => setLoaded(true)}
          />
        </div>
      </div>
    </>
  );
}

export default ImageComponent;
