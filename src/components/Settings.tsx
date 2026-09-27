import { useEffect, useState } from "react";
import Tune from "./../assets/tune.svg";
import Close from "./../assets/close.svg";
import Cookies from "universal-cookie";

function Settings({
  setSettings,
  cookiesEnabled,
  setCookiesEnabled,
}: {
  setSettings: (width: number, imageCount: number) => void | undefined;
  cookiesEnabled: boolean;
  setCookiesEnabled: (enabled: boolean) => void;
}) {
  const [open, setOpen] = useState<boolean>(false);
  const [width, setWidth] = useState<number>(1280);
  const [appliedWidth, setAppliedWidth] = useState<number>(1280);
  const [imageCount, setImageCount] = useState<number>(5);
  const [cookies, setCookies] = useState<Cookies>();
  const maximumWidth = Math.max(600, window.screen.availWidth);

  const handleWidthInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value);
    setWidth(value);
    setAppliedWidth(value);
    if (cookiesEnabled) cookies?.set("width", value);
  };

  const handleWidthRangeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setWidth(parseInt(event.target.value));
  };

  const applyWidth = (event: React.SyntheticEvent<HTMLInputElement>) => {
    const value = parseInt(event.currentTarget.value);
    setAppliedWidth(value);
    if (cookiesEnabled) cookies?.set("width", value);
  };

  const handleImageCountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value);
    setImageCount(value);
    if (cookiesEnabled) cookies?.set("imageCount", value);
  };

  useEffect(() => {
    if (setSettings) {
      setSettings(appliedWidth, imageCount);
    }
  }, [appliedWidth, imageCount, setSettings]);

  useEffect(() => {
    if (cookies && cookiesEnabled) {
      const cookieWidth = parseInt(cookies.get("width"));
      if (cookieWidth >= 600 && cookieWidth <= maximumWidth) {
        setWidth(cookieWidth);
        setAppliedWidth(cookieWidth);
      }

      const cookieImageCount = cookies.get("imageCount");
      if (cookieImageCount) {
        setImageCount(parseInt(cookieImageCount));
      }

      if (cookieImageCount < 1 || cookieImageCount > 20) {
        setImageCount(5);
      }
    }
  }, [cookies, cookiesEnabled, maximumWidth]);

  useEffect(() => {
    setCookies(new Cookies(null, { path: "/", sameSite: "strict", maxAge: 60 * 60 * 24 * 365 }));
  }, []);

  return (
    <>
      <div className={open ? "settings-canvas" : "hidden"} onClick={() => setOpen(!open)} />

      <div className="settings">
        <button
          className="settings-button"
          onClick={() => setOpen(!open)}
          aria-label="Settings"
          title="Settings"
        >
          <img src={Tune} alt="" />
          <span className="control-label">Settings</span>
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
                  <label htmlFor="width">Maximum Table Width</label>
                  <input
                    type="number"
                    name="width"
                    min="600"
                    max={maximumWidth}
                    value={width}
                    onChange={handleWidthInputChange}
                  />
                </span>
                <input
                  type="range"
                  id="width"
                  name="width"
                  min="600"
                  max={maximumWidth}
                  value={width}
                  onChange={handleWidthRangeChange}
                  onPointerUp={applyWidth}
                  onKeyUp={applyWidth}
                  onBlur={applyWidth}
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
              <div className="setting cookie-setting">
                <label className="setting-label" htmlFor="cookieConsent">
                  <span>Save settings in cookies</span>
                  <input
                    type="checkbox"
                    id="cookieConsent"
                    name="cookieConsent"
                    checked={cookiesEnabled}
                    onChange={(event) => setCookiesEnabled(event.target.checked)}
                  />
                </label>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Settings;
