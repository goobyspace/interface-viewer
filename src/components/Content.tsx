import { useEffect, useState } from "react";
import Item from "./Item";
import Config from "./Config";
import type { InterfaceStructure } from "../InterfaceStructure";
import { matchesSearch } from "../InterfaceStructure";

function Content({
  search,
  imageCount,
  forever,
}: {
  search: string;
  imageCount: number;
  forever: boolean;
}) {
  const [loading, setLoading] = useState<boolean>(true);
  const [popupText, setPopupText] = useState<string>("");
  const [popupClasses, setPopupClasses] = useState<string>("hidden");
  const [json, setJson] = useState<{ data: InterfaceStructure; forever: boolean }>();
  const [configUrl, setConfigUrl] = useState<string>("");
  const [configOpen, setConfigOpen] = useState<boolean>(false);

  const setConfig = (url: string, open: boolean) => {
    setConfigUrl(url);
    setConfigOpen(open);
  };

  const setPopup = (text: string) => {
    setPopupText(text);
    setPopupClasses("");
    setTimeout(() => {
      setPopupClasses("hidden");
    }, 5000);
  };

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    const indexImport = forever
      ? import("./../assets/forever/index.json")
      : import("./../assets/retail/index.json");

    indexImport.then((res) => {
      if (!cancelled) {
        setJson({ data: res.default as InterfaceStructure, forever });
        setLoading(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [forever]);

  const normalizedSearch = search.toLowerCase();
  const topLevelItems = (json?.data.children ?? [])
    .filter((node) => matchesSearch(node, normalizedSearch))
    .sort((a, b) => a.path.localeCompare(b.path));

  return (
    <>
      <Config path={configUrl} open={configOpen} setPopup={setPopup} setConfig={setConfig} forever={forever} />
      <div className="content">
        {loading ? (
          <div key="loader" className="loader-overlay">
            <div className="loader" />
            <p>Loading {forever ? "Forever" : "Retail"}...</p>
          </div>
        ) : (
          <div className="content-list" key={"content-list"}>
            {topLevelItems.map((node) => (
              <Item
                key={node.path}
                node={node}
                recursiveCount={0}
                search={normalizedSearch}
                forever={json?.forever ?? forever}
                imageCount={imageCount}
                setPopup={setPopup}
                setConfig={setConfig}
              />
            ))}
          </div>
        )}
        <div id="popup" className={popupClasses}>
          {popupText}
        </div>
      </div>
    </>
  );
}

export default Content;
