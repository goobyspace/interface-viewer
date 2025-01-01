import { useEffect, useRef, useState } from "react";
import Item from "./Item";
import Image from "./Image";

function Content({ search }: { search: string }) {
  const [items, setItems] = useState<JSX.Element[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [popupText, setPopupText] = useState<string>("");
  const [popupClasses, setPopupClasses] = useState<string>("hidden");

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
        return children.map((child) => {
          if (child.children) {
            return (
              <Item
                key={child.path}
                path={child.path}
                name={child.name}
                show={true}
                recursiveCount={currentCount}
                children={[...findChildren(child.children, currentCount + 1)]}
              />
            );
          } else if (child.path.includes(".PNG")) {
            return (
              <Image
                key={child.path}
                path={child.path}
                name={child.name}
                show={true}
                setPopup={setPopup}
              />
            );
          } else {
            return (
              <Item
                key={child.path}
                path={child.path}
                name={child.name}
                show={true}
                recursiveCount={currentCount}
                children={[]}
              />
            );
          }
        });
      };

      return new Promise<JSX.Element>((resolve) => {
        const item = (
          <Item
            key={"base" + json.path}
            path={json.path}
            name={json.name}
            show={true}
            recursiveCount={0}
            children={[]}
          />
        );

        if (json.children) {
          const promiseArray = json.children.map((child) => {
            return new Promise<JSX.Element>((resolve, reject) => {
              setTimeout(() => {
                try {
                  let item: JSX.Element;
                  if (child.children) {
                    item = (
                      <Item
                        key={child.path}
                        path={child.path}
                        name={child.name}
                        show={true}
                        recursiveCount={1}
                        children={[...findChildren(child.children, 2)]}
                      />
                    );
                  } else {
                    if (child.path.includes(".PNG")) {
                      item = (
                        <Image
                          key={child.path}
                          path={child.path}
                          name={child.name}
                          show={true}
                          setPopup={setPopup}
                        />
                      );
                    } else {
                      item = (
                        <Item
                          key={child.path}
                          path={child.path}
                          name={child.name}
                          show={true}
                          recursiveCount={1}
                          children={[]}
                        />
                      );
                    }
                  }
                  resolve(item);
                } catch (error) {
                  console.log(error);
                  reject(error);
                }
              }, 0);
            });
          });

          Promise.all(promiseArray!).then((values) => {
            resolve(<Item {...item.props} children={[...values]} />);
          });
        } else resolve(item);
      });
    };

    import("../JSON/index.json").then((res) => {
      const index = res.default;
      const itemPromises: Promise<JSX.Element>[] = [];
      const promises = index.index.map((element: string) => {
        return new Promise<InterfaceStructure>((resolve) => {
          setTimeout(() => {
            import(`../JSON/${element}`).then((newRes) => {
              const json = newRes.default as InterfaceStructure;
              itemPromises.push(createItemsFromJson(json));
              resolve(newRes.default as InterfaceStructure);
            });
          });
        });
      });
      return Promise.all(promises).then(() => {
        return Promise.all(itemPromises).then((values) => {
          setItems(
            values.sort((a, b) => {
              return a.props.path.localeCompare(b.props.path);
            })
          );
          setLoading(false);
        });
      });
    });
  }, []);

  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  useEffect(() => {
    setLoading(true);

    const searchItems = async () => {
      const promiseArray = itemsRef.current.map((item) => {
        return new Promise<JSX.Element>((resolve, reject) => {
          setTimeout(() => {
            try {
              let found = false;
              const searchChildren = (children: JSX.Element[]) => {
                let searchChildFound = false;
                return {
                  children: children.map((child) => {
                    let localFound = false;

                    if (child.props.path.toLowerCase().includes(search.toLowerCase())) {
                      localFound = true;
                      searchChildFound = true;
                    }

                    if (!found && localFound) {
                      found = localFound;
                    }

                    if (child.props.children) {
                      const { children, childFound } = searchChildren(child.props.children);

                      if (childFound) {
                        searchChildFound = childFound;
                      }

                      return (
                        <Item
                          key={child.props.path}
                          {...child.props}
                          show={localFound ? localFound : childFound}
                          children={[...children]}
                        />
                      );
                    } else if (child.props.path.includes(".PNG")) {
                      return (
                        <Image
                          key={child.props.path}
                          {...child.props}
                          show={localFound}
                          setPopup={setPopup}
                        />
                      );
                    } else {
                      return (
                        <Item
                          key={child.props.path}
                          {...child.props}
                          show={localFound}
                          children={[]}
                        />
                      );
                    }
                  }),
                  childFound: searchChildFound,
                };
              };

              if (item.props.path.toLowerCase().includes(search.toLowerCase())) found = true;
              if (item.props.children) {
                const { children, childFound } = searchChildren(item.props.children);

                if (!found && childFound) {
                  found = childFound;
                }

                resolve(
                  <Item
                    key={item.props.path}
                    {...item.props}
                    show={found}
                    children={[...children]}
                  />
                );
              } else {
                if (item.props.path.includes(".PNG")) {
                  resolve(<Image key={item.props.path} {...item.props} show={found} />);
                } else {
                  resolve(
                    <Item key={item.props.path} {...item.props} show={found} children={[]} />
                  );
                }
              }
            } catch (error) {
              reject(error);
            }
          }, 0);
        });
      });

      Promise.all(promiseArray!).then((values) => {
        setItems(values);
        setLoading(false);
      });
    };
    searchItems();
  }, [search]);

  return (
    <>
      <div className="content">
        {(loading && <div className="loader" />) || <div className="content-list">{items}</div>}
        <div id="popup" className={popupClasses}>
          {popupText}
        </div>
      </div>
    </>
  );
}

export default Content;
