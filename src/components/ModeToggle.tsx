import { useEffect, useState } from "react";
import Cookies from "universal-cookie";

function ModeToggle({
    forever,
    setForever,
    cookiesEnabled,
}: {
    forever: boolean;
    setForever: (forever: boolean) => void;
    cookiesEnabled: boolean;
}) {
    const [cookies, setCookies] = useState<Cookies>();

    const handleToggleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setForever(event.target.checked);
        if (cookiesEnabled) {
            cookies?.set("retail", event.target.checked);
        }
    };

    useEffect(() => {
        if (cookies && cookiesEnabled) {
            const savedForever = cookies.get("retail");
            if (typeof savedForever === "boolean") {
                setForever(savedForever);
            }
        }
    }, [cookies, cookiesEnabled, setForever]);

    useEffect(() => {
        setCookies(new Cookies(null, { path: "/", sameSite: "strict", maxAge: 60 * 60 * 24 * 365 }));
    }, []);

    return (
        <div className="toggle-container">
            <span className="mode-label">Retail</span>
            <label className="toggle" title={forever ? "Forever" : "Retail"}>
                <input
                    type="checkbox"
                    id="forever-toggle"
                    name="foreverToggle"
                    aria-label="Use Forever interface files"
                    checked={forever}
                    onChange={handleToggleChange}
                />
                <span className="slider" />
            </label>
            <span className="mode-label">Forever</span>
        </div>
    );
}

export default ModeToggle;