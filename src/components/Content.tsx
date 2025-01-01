import { useEffect, useRef, useState } from "react";
import Item from "./Item";
import Image from "./Image";

function Content({ search }: { search: string }) {
  const [json, setJson] = useState<InterfaceStructure>({
    parent: "",
    path: "",
    name: "",
    type: "",
    recursiveCount: 0,
    children: null,
  });
  const [items, setItems] = useState<JSX.Element[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [image, setImage] = useState<string>("");

  const itemsRef = useRef<JSX.Element[]>([]);

  interface InterfaceStructure {
    parent: string;
    path: string;
    name: string;
    type: string;
    recursiveCount: number;
    children: InterfaceStructure[] | null;
  }

  const setItemImage = (url: string) => {
    setImage(url);
  };

  useEffect(() => {
    import("../assets/structure.json").then((res) => {
      setJson(res.default as InterfaceStructure);
    });
  }, []);

  useEffect(() => {
    itemsRef.current = items;
  });

  useEffect(() => {
    const findChildren = (children: InterfaceStructure[], currentCount: number) => {
      return children.map((child) => {
        if (child.children) {
          return (
            <Item
              key={child.path}
              path={child.path}
              name={child.name}
              setImage={setItemImage}
              show={true}
              recursiveCount={currentCount}
              children={[...findChildren(child.children, currentCount + 1)]}
            />
          );
        } else
          return (
            <Item
              key={child.path}
              path={child.path}
              name={child.name}
              setImage={setItemImage}
              show={true}
              recursiveCount={currentCount}
              children={[]}
            />
          );
      });
    };

    const createItems = async () => {
      const promiseArray = json?.children?.map((child) => {
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
                    setImage={setItemImage}
                    show={true}
                    recursiveCount={0}
                    children={[...findChildren(child.children, 1)]}
                  />
                );
              } else {
                item = (
                  <Item
                    key={child.path}
                    path={child.path}
                    name={child.name}
                    setImage={setItemImage}
                    show={true}
                    recursiveCount={0}
                    children={[]}
                  />
                );
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
        setItems(values);
        setLoading(false);
      });
    };
    if (json.children) {
      createItems();
    }
  }, [json]);

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
                          path={child.props.path}
                          name={child.props.name}
                          show={localFound ? localFound : childFound}
                          setImage={setItemImage}
                          recursiveCount={child.props.recursiveCount}
                          children={[...children]}
                        />
                      );
                    } else
                      return (
                        <Item
                          key={child.props.path}
                          path={child.props.path}
                          name={child.props.name}
                          show={localFound}
                          setImage={setItemImage}
                          recursiveCount={child.props.recursiveCount}
                          children={[]}
                        />
                      );
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
                    path={item.props.path}
                    name={item.props.name}
                    show={found}
                    setImage={setItemImage}
                    recursiveCount={0}
                    children={[...children]}
                  />
                );
              } else {
                resolve(
                  <Item
                    key={item.props.path}
                    path={item.props.path}
                    name={item.props.name}
                    show={found}
                    recursiveCount={0}
                    setImage={setItemImage}
                    children={[]}
                  />
                );
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
      <div className="content-container">
        <div className="content">
          {(loading && <div className="loader" />) || <div className="content-list">{items}</div>}
        </div>
        <Image image={image} />
      </div>
    </>
  );
}

export default Content;
