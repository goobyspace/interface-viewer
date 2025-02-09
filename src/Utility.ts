export function ExportImage(
  path: string,
  imageRef: string,
  setPopup: (text: string) => void,
  direction?: string,
  scale?: number
) {
  const img = new Image();
  img.onload = function () {
    const width = img.width * (scale ? scale / 100 : 1);
    const height = img.height * (scale ? scale / 100 : 1);
    const TRPString = `{img:interface/${path}:${width}:${height}:${direction ? direction : "l"}}`;
    setPopup(`Copied: ${TRPString}`);
    navigator.clipboard.writeText(TRPString);
  };
  img.src = imageRef;
}

export function GetImage(path: string, imageRef: string, direction?: string, scale?: number) {
  if (!(path.length > 0)) return "";
  const img = new Image();
  let TRPString = "";

  img.src = imageRef;
  return new Promise<{ TRPString: string; width: number; height: number }>((resolve) => {
    img.onload = function () {
      const width = img.width * (scale ? scale / 100 : 1);
      const height = img.height * (scale ? scale / 100 : 1);
      TRPString = `{img:interface/${path}:${width}:${height}:${direction ? direction : "l"}}`;
      resolve({ TRPString, width, height });
    };
  });
}
