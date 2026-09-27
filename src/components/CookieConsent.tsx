function CookieConsent({ setConsent }: { setConsent: (accepted: boolean) => void }) {
    return (
        <div className="cookie-popup" role="dialog" aria-labelledby="cookie-popup-text">
            <p id="cookie-popup-text">
                We need cookies to save your settings, do you accept cookies? You can always turn them on/off in the settings later.
            </p>
            <div className="cookie-popup-buttons">
                <button onClick={() => setConsent(true)}>Yes</button>
                <button onClick={() => setConsent(false)}>No</button>
            </div>
        </div>
    );
}

export default CookieConsent;
