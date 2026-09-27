"use client";
import { useEffect, useRef, useState } from "react";

const FRAME = { width: 340, height: 130 };
const OUTPUT = { width: 680, height: 260 };

type Offset = { x: number; y: number };

function clamp(o: Offset, dispW: number, dispH: number): Offset {
  return {
    x: Math.min(0, Math.max(FRAME.width - dispW, o.x)),
    y: Math.min(0, Math.max(FRAME.height - dispH, o.y)),
  };
}

export function LogoCropModal({
  file,
  onCancel,
  onSave,
}: {
  file: File;
  onCancel: () => void;
  onSave: (dataUrl: string) => void;
}) {
  const [url] = useState(() => URL.createObjectURL(file));
  const [natural, setNatural] = useState<{ w: number; h: number } | null>(null);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState<Offset>({ x: 0, y: 0 });
  const dragRef = useRef<{ startX: number; startY: number; origin: Offset } | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => () => URL.revokeObjectURL(url), [url]);

  const baseScale = natural ? Math.max(FRAME.width / natural.w, FRAME.height / natural.h) : 1;
  const scale = baseScale * zoom;
  const dispW = natural ? natural.w * scale : 0;
  const dispH = natural ? natural.h * scale : 0;

  function handleImgLoad() {
    const el = imgRef.current;
    if (!el) return;
    const w = el.naturalWidth;
    const h = el.naturalHeight;
    const bs = Math.max(FRAME.width / w, FRAME.height / h);
    setNatural({ w, h });
    setOffset({ x: (FRAME.width - w * bs) / 2, y: (FRAME.height - h * bs) / 2 });
  }

  function handlePointerDown(e: React.PointerEvent) {
    if (!natural) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    dragRef.current = { startX: e.clientX, startY: e.clientY, origin: offset };
  }
  function handlePointerMove(e: React.PointerEvent) {
    if (!dragRef.current) return;
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    setOffset(clamp({ x: dragRef.current.origin.x + dx, y: dragRef.current.origin.y + dy }, dispW, dispH));
  }
  function handlePointerUp() {
    dragRef.current = null;
  }

  function handleZoom(e: React.ChangeEvent<HTMLInputElement>) {
    if (!natural) return;
    const z = Number(e.target.value);
    const newScale = baseScale * z;
    const newW = natural.w * newScale;
    const newH = natural.h * newScale;
    const cx = FRAME.width / 2;
    const cy = FRAME.height / 2;
    const fx = dispW ? (cx - offset.x) / dispW : 0.5;
    const fy = dispH ? (cy - offset.y) / dispH : 0.5;
    setZoom(z);
    setOffset(clamp({ x: cx - fx * newW, y: cy - fy * newH }, newW, newH));
  }

  function handleSave() {
    if (!natural || !imgRef.current) return;
    const canvas = document.createElement("canvas");
    canvas.width = OUTPUT.width;
    canvas.height = OUTPUT.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const sx = -offset.x / scale;
    const sy = -offset.y / scale;
    const sw = FRAME.width / scale;
    const sh = FRAME.height / scale;
    ctx.drawImage(imgRef.current, sx, sy, sw, sh, 0, 0, OUTPUT.width, OUTPUT.height);
    onSave(canvas.toDataURL("image/png"));
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <h2 className="font-display text-lg font-bold">Crop &amp; resize image</h2>
        <p className="mt-1 text-sm text-slate-500">Drag the image to reposition it, use the slider to zoom, then save.</p>

        <div
          className="relative mx-auto mt-5 touch-none select-none overflow-hidden rounded-lg ring-1 ring-slate-200"
          style={{
            width: FRAME.width,
            height: FRAME.height,
            backgroundImage:
              "linear-gradient(45deg, #e5e7eb 25%, transparent 25%), linear-gradient(-45deg, #e5e7eb 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e5e7eb 75%), linear-gradient(-45deg, transparent 75%, #e5e7eb 75%)",
            backgroundSize: "16px 16px",
            backgroundPosition: "0 0, 0 8px, 8px -8px, -8px 0px",
          }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={imgRef}
            src={url}
            alt=""
            draggable={false}
            onLoad={handleImgLoad}
            className="absolute cursor-grab active:cursor-grabbing"
            style={
              natural
                ? { left: offset.x, top: offset.y, width: dispW, height: dispH, maxWidth: "none" }
                : { opacity: 0 }
            }
          />
        </div>

        <div className="mt-4">
          <label className="label">Zoom</label>
          <input type="range" min={1} max={3} step={0.01} value={zoom} disabled={!natural} onChange={handleZoom} className="w-full" />
        </div>

        <p className="mt-2 text-center text-xs text-slate-500">
          Output size: {OUTPUT.width}×{OUTPUT.height}px
        </p>

        <div className="mt-5 flex justify-end gap-2">
          <button type="button" onClick={onCancel} className="btn-secondary btn-sm">Cancel</button>
          <button type="button" onClick={handleSave} disabled={!natural} className="btn-primary btn-sm">Save</button>
        </div>
      </div>
    </div>
  );
}
