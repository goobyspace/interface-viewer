import copy from "./../assets/copy.svg";

function Description({
  path,
  name,
  show,
  setPopup,
}: {
  path: string;
  name: string;
  show: boolean;
  setPopup: (text: string) => void;
}) {
  //{"{img:interface/Glues/Models/UIWorgen/UIWORGENCLOUDS01.PNG:512:175:l}"}

  const imageRef = `https://raw.githubusercontent.com/goobyspace/Interface/refs/heads/main/${path}`;

  const onClick = () => {
    const img = new Image();
    img.onload = function () {
      const TRPString = `{img:interface/${path}:${img.width}:${img.height}:l}`;
      setPopup(`Copied: ${TRPString}`);
      navigator.clipboard.writeText(TRPString);
    };
    img.src = imageRef;
  };

  return (
    <>
      <div className={show ? "preview-image" : "hidden"}>
        <a href={`https://github.com/goobyspace/Interface/blob/main/${path}`} target="_blank">
          <img
            className="image"
            src={imageRef}
            alt={name}
            loading="lazy" //this should only load images when theyre in view
          />
        </a>

        <span>
          <button onClick={onClick}>
            <img src={copy} alt="copy" />
          </button>
          {name}
        </span>
      </div>
    </>
  );
}

export default Description;
