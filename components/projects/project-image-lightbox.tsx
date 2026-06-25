"use client";

import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";
import Image from "next/image";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";

import GradualBlur from "@/components/ui/gradual-blur";
import { NoOrphanText } from "@/components/ui/no-orphan-text";
import { useReducedMotion } from "@/lib/motion";
import type { ProjectImage } from "@/lib/projects";

type ProjectImageLightboxProps = {
  image: ProjectImage;
  galleryImages: ProjectImage[];
  galleryIndex: number;
  priority?: boolean;
  large?: boolean;
  edgeBlur?: boolean;
};

type ImageTransform = {
  scale: number;
  x: number;
  y: number;
};

type DragStart = {
  pointerId: number;
  startX: number;
  startY: number;
  originX: number;
  originY: number;
};

const MIN_SCALE = 1;
const MAX_SCALE = 4;
const ZOOM_STEP = 1.12;
const RESET_SCALE_THRESHOLD = 1.02;

function normalizeIndex(index: number, total: number): number {
  if (total <= 0) return 0;
  return ((index % total) + total) % total;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function clampTranslate(
  x: number,
  y: number,
  scale: number,
  width: number,
  height: number
): Pick<ImageTransform, "x" | "y"> {
  if (scale <= MIN_SCALE) {
    return { x: 0, y: 0 };
  }

  const maxX = (width * (scale - 1)) / 2;
  const maxY = (height * (scale - 1)) / 2;

  return {
    x: clamp(x, -maxX, maxX),
    y: clamp(y, -maxY, maxY),
  };
}

export function ProjectImageLightbox({
  image,
  galleryImages,
  galleryIndex,
  priority = false,
  large = false,
  edgeBlur = false,
}: ProjectImageLightboxProps): ReactNode {
  const prefersReducedMotion = useReducedMotion();
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const dragStartRef = useRef<DragStart | null>(null);
  const gallery = useMemo(
    () => (galleryImages.length > 0 ? galleryImages : [image]),
    [galleryImages, image]
  );
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(
    normalizeIndex(galleryIndex, gallery.length)
  );
  const [imageTransform, setImageTransform] = useState<ImageTransform>({
    scale: 1,
    x: 0,
    y: 0,
  });
  const [isDragging, setIsDragging] = useState(false);

  const currentImage = gallery[currentIndex] ?? image;
  const hasMultipleImages = gallery.length > 1;
  const isZoomed = imageTransform.scale > MIN_SCALE;
  const zoomPercentage = Math.round(imageTransform.scale * 100);

  const resetTransform = useCallback(() => {
    dragStartRef.current = null;
    setIsDragging(false);
    setImageTransform({ scale: 1, x: 0, y: 0 });
  }, []);

  const openLightbox = useCallback(() => {
    setCurrentIndex(normalizeIndex(galleryIndex, gallery.length));
    resetTransform();
    setIsOpen(true);
  }, [gallery.length, galleryIndex, resetTransform]);

  const closeLightbox = useCallback(() => {
    resetTransform();
    setIsOpen(false);
  }, [resetTransform]);

  const showPrevious = useCallback(() => {
    resetTransform();
    setCurrentIndex((index) => normalizeIndex(index - 1, gallery.length));
  }, [gallery.length, resetTransform]);

  const showNext = useCallback(() => {
    resetTransform();
    setCurrentIndex((index) => normalizeIndex(index + 1, gallery.length));
  }, [gallery.length, resetTransform]);

  const handleWheel = useCallback((event: globalThis.WheelEvent) => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    event.preventDefault();
    event.stopPropagation();

    const rect = viewport.getBoundingClientRect();
    const mouseX = event.clientX - rect.left - rect.width / 2;
    const mouseY = event.clientY - rect.top - rect.height / 2;
    const zoomFactor = event.deltaY < 0 ? ZOOM_STEP : 1 / ZOOM_STEP;

    setImageTransform((current) => {
      const nextScale = clamp(
        current.scale * zoomFactor,
        MIN_SCALE,
        MAX_SCALE
      );

      if (nextScale <= RESET_SCALE_THRESHOLD) {
        return { scale: 1, x: 0, y: 0 };
      }

      const scaleRatio = nextScale / current.scale;
      const nextX = mouseX - (mouseX - current.x) * scaleRatio;
      const nextY = mouseY - (mouseY - current.y) * scaleRatio;
      const clamped = clampTranslate(
        nextX,
        nextY,
        nextScale,
        rect.width,
        rect.height
      );

      return {
        scale: nextScale,
        x: clamped.x,
        y: clamped.y,
      };
    });
  }, []);

  const handlePointerDown = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      if (imageTransform.scale <= MIN_SCALE || event.button !== 0) return;

      event.preventDefault();
      event.currentTarget.setPointerCapture(event.pointerId);
      dragStartRef.current = {
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        originX: imageTransform.x,
        originY: imageTransform.y,
      };
      setIsDragging(true);
    },
    [imageTransform.scale, imageTransform.x, imageTransform.y]
  );

  const handlePointerMove = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      const dragStart = dragStartRef.current;
      const viewport = viewportRef.current;

      if (!dragStart || !viewport || event.pointerId !== dragStart.pointerId) {
        return;
      }

      event.preventDefault();

      const rect = viewport.getBoundingClientRect();
      const nextX = dragStart.originX + event.clientX - dragStart.startX;
      const nextY = dragStart.originY + event.clientY - dragStart.startY;
      const clamped = clampTranslate(
        nextX,
        nextY,
        imageTransform.scale,
        rect.width,
        rect.height
      );

      setImageTransform((current) => ({
        ...current,
        x: clamped.x,
        y: clamped.y,
      }));
    },
    [imageTransform.scale]
  );

  const stopDragging = useCallback(
    (event?: PointerEvent<HTMLDivElement>) => {
      const dragStart = dragStartRef.current;

      if (
        event &&
        dragStart &&
        event.currentTarget.hasPointerCapture(dragStart.pointerId)
      ) {
        event.currentTarget.releasePointerCapture(dragStart.pointerId);
      }

      dragStartRef.current = null;
      setIsDragging(false);
    },
    []
  );

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const viewport = viewportRef.current;
    if (!viewport) return;

    viewport.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      viewport.removeEventListener("wheel", handleWheel);
    };
  }, [handleWheel, isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeLightbox();
        return;
      }

      if (event.key === "ArrowLeft") {
        showPrevious();
        return;
      }

      if (event.key === "ArrowRight") {
        showNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [closeLightbox, isOpen, showNext, showPrevious]);

  return (
    <>
      <figure className="border-foreground/8 bg-background overflow-hidden rounded-3xl border p-2 shadow-sm">
        <button
          type="button"
          onClick={openLightbox}
          aria-label={`放大查看：${image.alt}`}
          className={`focus-ring group ring-foreground/5 bg-foreground/5 relative block w-full cursor-zoom-in overflow-hidden rounded-[1.35rem] ring-1 ${
            large ? "aspect-[16/10]" : "aspect-[4/3]"
          }`}
        >
          <Image
            src={image.src}
            alt={image.alt}
            fill
            unoptimized
            priority={priority}
            sizes={
              large
                ? "(min-width: 1280px) 1100px, 100vw"
                : "(min-width: 1024px) 520px, (min-width: 768px) 48vw, 100vw"
            }
            className={`object-cover transition-transform ${
              prefersReducedMotion
                ? "duration-0"
                : "duration-500 group-hover:scale-[1.015]"
            }`}
          />
          {edgeBlur ? (
            <GradualBlur
              target="parent"
              position="bottom"
              height="4.25rem"
              strength={0.85}
              divCount={4}
              curve="bezier"
              exponential={false}
              opacity={0.48}
              zIndex={2}
            />
          ) : null}
          <span className="bg-background/80 text-foreground/70 border-foreground/8 pointer-events-none absolute right-3 bottom-3 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full border opacity-0 shadow-sm backdrop-blur-sm transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
            <Maximize2 className="h-4 w-4" aria-hidden="true" />
          </span>
        </button>
        {image.caption ? (
          <figcaption className="text-foreground/50 px-2 pt-3 pb-1 text-[13px] leading-relaxed tracking-tight">
            <NoOrphanText text={image.caption} tailLength={5} />
          </figcaption>
        ) : null}
      </figure>

      {isOpen
        ? createPortal(
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/88 px-4 py-5 backdrop-blur-sm sm:px-8"
          role="dialog"
          aria-modal="true"
          aria-label="作品图片放大查看"
          onClick={closeLightbox}
        >
          <div
            className="relative flex h-full w-full max-w-7xl flex-col"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="absolute top-0 right-0 left-0 z-20 flex items-center justify-between gap-3">
              <div className="rounded-full border border-white/15 bg-white/10 px-3 py-2 text-xs font-medium text-white/70 backdrop-blur-md">
                {currentIndex + 1} / {gallery.length}
              </div>
              <div className="flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-2 text-xs font-medium text-white/70 backdrop-blur-md">
                <span>{zoomPercentage}%</span>
                {isZoomed ? (
                  <button
                    type="button"
                    onClick={resetTransform}
                    className="cursor-pointer rounded-full px-2 py-0.5 text-white transition-colors hover:bg-white/15 focus-visible:bg-white/15 focus-visible:outline-none"
                  >
                    重置
                  </button>
                ) : null}
              </div>
              <button
                type="button"
                onClick={closeLightbox}
                aria-label="关闭图片查看"
                className="focus-ring inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-white/15 bg-white/10 text-white backdrop-blur-md transition-colors hover:bg-white/20"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <div className="flex min-h-0 flex-1 items-center justify-center pt-14 pb-16 sm:pb-18">
              <div
                ref={viewportRef}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={stopDragging}
                onPointerCancel={stopDragging}
                onLostPointerCapture={() => stopDragging()}
                className={`relative h-full max-h-[78vh] w-full touch-none overflow-hidden select-none ${
                  isZoomed
                    ? isDragging
                      ? "cursor-grabbing"
                      : "cursor-grab"
                    : "cursor-zoom-in"
                }`}
              >
                <Image
                  src={currentImage.src}
                  alt={currentImage.alt}
                  fill
                  unoptimized
                  sizes="100vw"
                  draggable={false}
                  className="pointer-events-none object-contain will-change-transform"
                  style={{
                    transform: `translate3d(${imageTransform.x}px, ${imageTransform.y}px, 0) scale(${imageTransform.scale})`,
                    transition:
                      isDragging || prefersReducedMotion
                        ? "none"
                        : "transform 180ms ease-out",
                  }}
                />
              </div>
            </div>

            {hasMultipleImages ? (
              <>
                <button
                  type="button"
                  onClick={showPrevious}
                  aria-label="查看上一张图片"
                  className="focus-ring absolute top-1/2 left-0 inline-flex h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-white/15 bg-white/10 text-white backdrop-blur-md transition-colors hover:bg-white/20 sm:left-2"
                >
                  <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={showNext}
                  aria-label="查看下一张图片"
                  className="focus-ring absolute top-1/2 right-0 inline-flex h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-white/15 bg-white/10 text-white backdrop-blur-md transition-colors hover:bg-white/20 sm:right-2"
                >
                  <ChevronRight className="h-5 w-5" aria-hidden="true" />
                </button>
              </>
            ) : null}

            <div className="absolute right-0 bottom-0 left-0 z-20 flex justify-center">
              <div className="max-w-3xl rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-center text-sm leading-relaxed text-white/80 backdrop-blur-md">
                <NoOrphanText
                  text={currentImage.caption ?? currentImage.alt}
                  tailLength={5}
                />
              </div>
            </div>
          </div>
        </div>,
        document.body
          )
        : null}
    </>
  );
}
