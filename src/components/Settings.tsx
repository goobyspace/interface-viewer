import { useEffect, useState } from "react";
import Tune from "./../assets/tune.svg";
import Close from "./../assets/close.svg";
import Cookies from "universal-cookie";

function Settings({
  setSettings,
}: {
  setSettings: (width: number, imageCount: number) => void | undefined;
}) {
  const [open, setOpen] = useState<boolean>(false);
  const [width, setWidth] = useState<number>(
    document.body.clientWidth < 1280 ? document.body.clientWidth : 1280
  );
  const [imageCount, setImageCount] = useState<number>(5);
  const [cookies, setCookies] = useState<Cookies>();

  const handleWidthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setWidth(parseInt(event.target.value));
    cookies?.set("width", event.target.value);
  };

  const handleImageCountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value);
    setImageCount(value);
    cookies?.set("imageCount", value);
  };

  useEffect(() => {
    if (setSettings) {
      setSettings(width, imageCount);
    }
  }, [width, imageCount, setSettings]);

  useEffect(() => {
    if (cookies) {
      const cookieWidth = cookies.get("width");

      if (cookieWidth) {
        setWidth(parseInt(cookieWidth));
      }
      const cookieImageCount = cookies.get("imageCount");
      if (cookieImageCount) {
        setImageCount(parseInt(cookieImageCount));
      }

      if (cookieImageCount < 1 || cookieImageCount > 20) {
        setImageCount(5);
      }
    }
  }, [cookies]);

  useEffect(() => {
    setCookies(new Cookies(null, { path: "/", sameSite: "strict" }));
  }, []);

  return (
    <>
      <div className={open ? "settings-canvas" : "hidden"} onClick={() => setOpen(!open)} />

      <div className="settings">
        <button className="settings-button" onClick={() => setOpen(!open)}>
          <img src={Tune} alt="tune icon" /> Settings
        </button>
        {open && (
          <div className="settings-window">
            <div className="settings-header">
              <span>Settings</span>
              <button className="settings-close" onClick={() => setOpen(false)}>
                <img src={Close} alt="close icon" />
              </button>
            </div>

            <div className="settings-body">
              <h6>Page Settings</h6>
              <div className="setting">
                <span className="setting-label">
                  <label htmlFor="width">Table Width</label>
                  <input
                    type="number"
                    name="width"
                    min="450"
                    value={width}
                    onChange={handleWidthChange}
                  />
                </span>
                <input
                  type="range"
                  id="width"
                  name="width"
                  min="450"
                  value={width}
                  onChange={handleWidthChange}
                  max={document.body.clientWidth - 100}
                />
              </div>
              <div className="setting">
                <span className="setting-label">
                  <label htmlFor="width">Images Per Row</label>
                  <input
                    type="number"
                    name="imageCount"
                    min="1"
                    max="30"
                    value={imageCount}
                    onChange={handleImageCountChange}
                  />
                </span>
                <input
                  type="range"
                  id="imageCount"
                  name="imageCount"
                  min="1"
                  max="30"
                  value={imageCount}
                  onChange={handleImageCountChange}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Settings;
