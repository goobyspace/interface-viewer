import { useLayoutEffect, useRef, useState } from "react";
import type { InterfaceStructure } from "../InterfaceStructure";
import Image from "./Image";

const OVERSCAN_ROWS = 2;

function ImageGrid({
    images,
    imageCount,
    forever,
    setPopup,
    setConfig,
}: {
    images: InterfaceStructure[];
    imageCount: number;
    forever: boolean;
    setPopup: (text: string) => void;
    setConfig: (url: string, open: boolean) => void;
}) {
    const gridRef = useRef<HTMLDivElement>(null);
    const [layout, setLayout] = useState({ width: 0, startRow: 0, endRow: 0 });
    const columnCount = Math.max(1, imageCount);
    const rowCount = Math.ceil(images.length / columnCount);
    const rowHeight = layout.width / columnCount;

    useLayoutEffect(() => {
        const grid = gridRef.current;
        const scrollContainer = grid?.closest(".content");
        if (!grid || !scrollContainer) return;

        let animationFrame = 0;

        const updateLayout = () => {
            const width = grid.clientWidth;
            const nextRowHeight = width / columnCount;
            const gridRect = grid.getBoundingClientRect();
            const scrollRect = scrollContainer.getBoundingClientRect();
            const firstVisibleRow = Math.floor((scrollRect.top - gridRect.top) / nextRowHeight);
            const lastVisibleRow = Math.ceil((scrollRect.bottom - gridRect.top) / nextRowHeight);
            const startRow = Math.max(0, Math.min(rowCount, firstVisibleRow - OVERSCAN_ROWS));
            const endRow = Math.max(0, Math.min(rowCount, lastVisibleRow + OVERSCAN_ROWS));

            setLayout((current) => {
                if (
                    current.width === width &&
                    current.startRow === startRow &&
                    current.endRow === endRow
                ) {
                    return current;
                }
                return { width, startRow, endRow };
            });
        };

        const scheduleUpdate = () => {
            cancelAnimationFrame(animationFrame);
            animationFrame = requestAnimationFrame(updateLayout);
        };

        const resizeObserver = new ResizeObserver(scheduleUpdate);
        resizeObserver.observe(grid);
        scrollContainer.addEventListener("scroll", scheduleUpdate, { passive: true });
        updateLayout();

        return () => {
            cancelAnimationFrame(animationFrame);
            resizeObserver.disconnect();
            scrollContainer.removeEventListener("scroll", scheduleUpdate);
        };
    }, [columnCount, rowCount]);

    const startIndex = layout.startRow * columnCount;
    const endIndex = Math.min(images.length, layout.endRow * columnCount);
    const visibleImages = images.slice(startIndex, endIndex).map((image, offset) => {
        const index = startIndex + offset;
        const row = Math.floor(index / columnCount);
        const column = index % columnCount;

        return (
            <div
                className="virtual-image-cell"
                key={image.path}
                style={{
                    height: `${rowHeight}px`,
                    left: `${(column / columnCount) * 100}%`,
                    top: `${row * rowHeight}px`,
                    width: `${100 / columnCount}%`,
                }}
            >
                <Image
                    path={image.path}
                    name={image.name}
                    forever={forever}
                    setPopup={setPopup}
                    setConfig={setConfig}
                />
            </div>
        );
    });

    return (
        <div
            ref={gridRef}
            className="virtual-image-grid"
            style={{ height: `${rowCount * rowHeight}px` }}
        >
            {visibleImages}
        </div>
    );
}

export default ImageGrid;