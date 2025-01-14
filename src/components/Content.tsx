import { useEffect, useRef, useState } from "react";
import Item from "./Item";
import Image from "./Image";

function Content({
  search,
  width,
  percentage,
}: {
  search: string;
  width: number;
  percentage: number;
}) {
  const [items, setItems] = useState<JSX.Element[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [popupText, setPopupText] = useState<string>("");
  const [popupClasses, setPopupClasses] = useState<string>("hidden");
  const [json, setJson] = useState<InterfaceStructure>();

  const itemsRef = useRef<JSX.Element[]>([]);

  interface InterfaceStructure {
    parent: string;
    path: string;
    name: string;
    type: string;
    recursiveCount: number;
    children: InterfaceStructure[] | null;
  }

  const setPopup = (text: string) => {
    setPopupText(text);
    setPopupClasses("");
    setTimeout(() => {
      setPopupClasses("hidden");
    }, 5000);
  };

  useEffect(() => {
    const createItemsFromJson = async (json: InterfaceStructure) => {
      const findChildren = (children: InterfaceStructure[], currentCount: number) => {
        const imageArray: JSX.Element[] = [];
        const headerArray: JSX.Element[] = [];
        let localFound = false;

        children.map((child) => {
          let personalFound = false;
          if (child.path.toLowerCase().includes(search.toLowerCase())) {
            personalFound = true;
            localFound = true;
          }

          if (child.children) {
            const [headers, images, found] = findChildren(child.children, currentCount + 1);
            if (found) localFound = true;
            headerArray.push(
              <Item
                key={child.path}
                path={child.path}
                name={child.name}
                show={personalFound ? personalFound : (found as boolean)}
                recursiveCount={currentCount}
                headers={headers as JSX.Element[]}
                images={images as JSX.Element[]}
              />
            );
          } else if (child.path.includes(".PNG")) {
            imageArray.push(
              <Image
                key={child.path}
                path={child.path}
                name={child.name}
                show={personalFound}
                setPopup={setPopup}
              />
            );
          } else {
            headerArray.push(
              <Item
                key={child.path}
                path={child.path}
                name={child.name}
                show={personalFound}
                recursiveCount={currentCount}
                headers={[]}
                images={[]}
              />
            );
          }
        });

        return [headerArray, imageArray, localFound];
      };

      return new Promise<JSX.Element>((resolve) => {
        let mainFound = false;
        if (json.path.toLowerCase().includes(search.toLowerCase())) {
          mainFound = true;
        }

        if (json.children) {
          const promiseArray = json.children.map((child) => {
            return new Promise<JSX.Element>((resolve, reject) => {
              setTimeout(() => {
                try {
                  let item: JSX.Element;
                  let currentTrue = false;

                  currentTrue = child.path.toLowerCase().includes(search.toLowerCase());

                  if (currentTrue) {
                    mainFound = mainFound || currentTrue;
                  }

                  if (child.children) {
                    const [headers, images, found] = findChildren(child.children, 2);
                    mainFound = mainFound || currentTrue || (found as boolean);

                    item = (
                      <Item
                        key={child.path}
                        path={child.path}
                        name={child.name}
                        show={currentTrue ? currentTrue : (found as boolean)}
                        recursiveCount={1}
                        headers={headers as JSX.Element[]}
                        images={images as JSX.Element[]}
                      />
                    );
                  } else {
                    if (child.path.includes(".PNG")) {
                      item = (
                        <Image
                          key={child.path}
                          path={child.path}
                          name={child.name}
                          show={currentTrue}
                          setPopup={setPopup}
                        />
                      );
                    } else {
                      item = (
                        <Item
                          key={child.path}
                          path={child.path}
                          name={child.name}
                          show={currentTrue}
                          recursiveCount={1}
                          headers={[]}
                          images={[]}
                        />
                      );
                    }
                  }
                  resolve(item);
                } catch (error) {
                  reject(error);
                }
              }, 0);
            });
          });

          Promise.all(promiseArray!).then((values) => {
            const images = values.filter((value) => value.props.path.includes(".PNG"));
            const headers = values.filter((value) => !value.props.path.includes(".PNG"));

            resolve(
              <Item
                key={json.path}
                show={mainFound}
                path={json.path}
                name={json.name}
                recursiveCount={0}
                images={images}
                headers={headers}
              />
            );
          });
        } else
          resolve(
            <Item
              key={json.path}
              path={json.path}
              name={json.name}
              show={mainFound}
              recursiveCount={0}
              headers={[]}
              images={[]}
            />
          );
      });
    };

    const createItems = async () => {
      const itemPromises: Promise<JSX.Element>[] = [];
      const promises = json?.children?.map((element: InterfaceStructure) => {
        return new Promise<InterfaceStructure>((resolve) => {
          setTimeout(() => {
            itemPromises.push(createItemsFromJson(element));
            resolve(element);
          });
        });
      });
      return Promise.all(promises || []).then(() => {
        return Promise.all(itemPromises).then((values) => {
          setItems(
            values.sort((a, b) => {
              return a.props.path.localeCompare(b.props.path);
            })
          );
          setLoading(false);
        });
      });
    };

    createItems();
  }, [search, json]);

  useEffect(() => {
    import("./../assets/index.json").then((res) => {
      setJson(res.default as InterfaceStructure);
    });
  }, []);

  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  return (
    <>
      <div className="content" style={{ width: `${width}px` }}>
        {loading ? (
          <div key="loader" className="loader-overlay">
            <div className="loader" />
          </div>
        ) : (
          <div className="content-list" key={"content-list"}>
            <style>
              {`
              .preview-image {
                width: ${percentage}%;
              }
              `}
            </style>
            {items}
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
