import { useEffect, useState } from "react";
import Tune from "./../assets/tune.svg";
import Close from "./../assets/close.svg";
import Cookies from "universal-cookie";

function Settings({
  setSettings,
}: {
  setSettings: (width: number, percentage: number) => void | undefined;
}) {
  const [open, setOpen] = useState<boolean>(false);
  const [width, setWidth] = useState<number>(
    document.body.clientWidth < 1280 ? document.body.clientWidth : 1280
  );
  const [percentage, setPercentage] = useState<number>(19);
  const [cookies, setCookies] = useState<Cookies>();

  const handleWidthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setWidth(parseInt(event.target.value));
    cookies?.set("width", event.target.value);
  };

  const handlePercentageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPercentage(parseInt(event.target.value));
    cookies?.set("percentage", event.target.value);
  };

  useEffect(() => {
    if (setSettings) {
      setSettings(width, percentage);
    }
  }, [width, percentage, setSettings]);

  useEffect(() => {
    if (cookies) {
      const cookieWidth = cookies.get("width");

      if (cookieWidth) {
        setWidth(parseInt(cookieWidth));
      }
      const cookiePercentage = cookies.get("percentage");
      if (cookiePercentage) {
        setPercentage(parseInt(cookiePercentage));
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
              <div className="setting">
                <span className="setting-label">
                  <label htmlFor="width">Table Width</label>
                  <span>{width}px</span>
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
                  <label htmlFor="width">Image %</label>
                  <span>{percentage}%</span>
                </span>
                <input
                  type="range"
                  id="width"
                  name="width"
                  min="5"
                  max="100"
                  value={percentage}
                  onChange={handlePercentageChange}
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
