"use client";

import type { ReactNode } from "react"
import { useRef, useState } from "react"

const MIN_SCALE = 0.45;
const MAX_SCALE = 3.2;

type Point = {
  x: number;
  y: number;
};

type Transform = {
  x: number;
  y: number;
  scale: number;
};

type GestureState = {
  startTransform: Transform;
  startPoint: Point;
  startCenter: Point;
  startDistance: number;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function getDistance(a: Point, b: Point) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function getCenter(a: Point, b: Point) {
  return {
    x: (a.x + b.x) / 2,
    y: (a.y + b.y) / 2
  };
}

type MovableContainerProps = {
  children: ReactNode;
};

export function MovableContainer({ children }: MovableContainerProps) {
  const pointers = useRef(new Map<number, Point>());
  const gesture = useRef<GestureState | null>(null);

  const [transform, setTransform] = useState<Transform>({
    x: 0,
    y: 0,
    scale: 1
  });

  function beginGesture() {
    const points = Array.from(pointers.current.values());

    if (points.length === 1) {
      gesture.current = {
        startTransform: transform,
        startPoint: points[0],
        startCenter: points[0],
        startDistance: 0
      };
    }

    if (points.length >= 2) {
      const first = points[0];
      const second = points[1];

      gesture.current = {
        startTransform: transform,
        startPoint: first,
        startCenter: getCenter(first, second),
        startDistance: getDistance(first, second)
      };
    }
  }

  function handlePointerDown(event: React.PointerEvent<HTMLDivElement>) {
    event.currentTarget.setPointerCapture(event.pointerId);

    pointers.current.set(event.pointerId, {
      x: event.clientX,
      y: event.clientY
    });

    beginGesture();
  }

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (!pointers.current.has(event.pointerId) || !gesture.current) {
      return;
    }

    pointers.current.set(event.pointerId, {
      x: event.clientX,
      y: event.clientY
    });

    const points = Array.from(pointers.current.values());
    const currentGesture = gesture.current;

    if (points.length === 1) {
      const point = points[0];
      const dx = point.x - currentGesture.startPoint.x;
      const dy = point.y - currentGesture.startPoint.y;

      setTransform({
        ...currentGesture.startTransform,
        x: currentGesture.startTransform.x + dx,
        y: currentGesture.startTransform.y + dy
      });
    }

    if (points.length >= 2) {
      const first = points[0];
      const second = points[1];
      const center = getCenter(first, second);
      const distance = getDistance(first, second);
      const scaleFactor = distance / currentGesture.startDistance;
      const nextScale = clamp(
        currentGesture.startTransform.scale * scaleFactor,
        MIN_SCALE,
        MAX_SCALE
      );

      setTransform({
        x: currentGesture.startTransform.x + center.x - currentGesture.startCenter.x,
        y: currentGesture.startTransform.y + center.y - currentGesture.startCenter.y,
        scale: nextScale
      });
    }
  }

  function handlePointerUp(event: React.PointerEvent<HTMLDivElement>) {
    pointers.current.delete(event.pointerId);
    beginGesture();
  }

  function resetPosition() {
    pointers.current.clear();
    gesture.current = null;
    setTransform({ x: 0, y: 0, scale: 1 });
  }

  return (
    <div className="grid h-full w-full place-items-center overflow-hidden touch-none">
      <div
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onDoubleClick={resetPosition}
        className="h-full w-full cursor-grab active:cursor-grabbing"
        style={{
          transform: `translate3d(${transform.x}px, ${transform.y}px, 0) scale(${transform.scale})`,
          transformOrigin: "center center"
        }}
      >
        {children}
      </div>
    </div>
  );
}