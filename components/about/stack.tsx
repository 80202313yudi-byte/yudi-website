"use client";

import { RotateCcw } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";

import { useReducedMotion } from "@/lib/motion";

type Tool = {
  label: string;
  short: string;
  bg: string;
  fg: string;
};

const TOOLS: Tool[] = [
  { label: "Figma", short: "Fi", bg: "#1f1f1f", fg: "#ffffff" },
  { label: "Photoshop", short: "Ps", bg: "#001D34", fg: "#ffffff" },
  { label: "Illustrator", short: "Ai", bg: "#311500", fg: "#ffffff" },
  { label: "Premiere Pro", short: "Pr", bg: "#1B123D", fg: "#ffffff" },
  { label: "Canva", short: "Ca", bg: "#22BFC7", fg: "#ffffff" },
  { label: "ChatGPT", short: "GPT", bg: "#111111", fg: "#ffffff" },
  { label: "Midjourney", short: "MJ", bg: "#1f1f1f", fg: "#ffffff" },
  { label: "After Effects", short: "Ae", bg: "#22135E", fg: "#ffffff" },
  { label: "GitHub", short: "GH", bg: "#181717", fg: "#ffffff" },
];

const CHIP_RADIUS = 14;
const ICON_RADIUS = 10;
const WALL_PAD = 16;

type ToolState = {
  body: import("matter-js").Body;
  width: number;
  height: number;
};

export function Stack(): ReactNode {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const measureRef = useRef<HTMLDivElement | null>(null);
  const chipRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [resetKey, setResetKey] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;

    const container = containerRef.current;
    const measure = measureRef.current;
    if (!container || !measure) return;

    let cancelled = false;
    let cleanup: (() => void) | undefined;

    void (async () => {
      const Matter = await import("matter-js");
      if (cancelled) return;

      const {
        Bodies,
        Body,
        Engine,
        Events,
        Mouse,
        MouseConstraint,
        Runner,
        World,
      } = Matter;

      const measureChildren = Array.from(measure.children) as HTMLElement[];
      const dims = measureChildren.map((el) => {
        const rect = el.getBoundingClientRect();
        return { w: Math.max(80, rect.width), h: Math.max(28, rect.height) };
      });

      let width = container.clientWidth;
      let height = container.clientHeight;

      const engine = Engine.create();
      engine.gravity.y = 1;
      const world = engine.world;

      const wallThickness = 400;
      const floor = Bodies.rectangle(
        width / 2,
        height - WALL_PAD + wallThickness / 2,
        width * 3,
        wallThickness,
        { isStatic: true }
      );
      const leftWall = Bodies.rectangle(
        WALL_PAD - wallThickness / 2,
        height / 2,
        wallThickness,
        height * 4,
        { isStatic: true }
      );
      const rightWall = Bodies.rectangle(
        width - WALL_PAD + wallThickness / 2,
        height / 2,
        wallThickness,
        height * 4,
        { isStatic: true }
      );
      World.add(world, [floor, leftWall, rightWall]);

      const states: ToolState[] = TOOLS.map((_tool, index) => {
        const dim = dims[index] ?? { w: 120, h: 36 };
        const { w, h } = dim;
        const halfW = w / 2;
        const minX = WALL_PAD + halfW + 4;
        const maxX = width - WALL_PAD - halfW - 4;
        const x = minX + Math.random() * Math.max(1, maxX - minX);
        const y = -80 - index * 60 - Math.random() * 120;
        const body = Bodies.rectangle(x, y, w, h, {
          chamfer: { radius: CHIP_RADIUS },
          restitution: 0.35,
          friction: 0.5,
          frictionAir: 0.025,
          density: 0.0018,
          angle: (Math.random() - 0.5) * 0.4,
        });
        World.add(world, body);
        return { body, width: w, height: h };
      });

      const mouse = Mouse.create(container);
      const wheelTarget = mouse.element as HTMLElement & {
        mousewheel?: EventListener;
      };
      if (wheelTarget.mousewheel) {
        wheelTarget.removeEventListener("wheel", wheelTarget.mousewheel);
        wheelTarget.removeEventListener(
          "DOMMouseScroll",
          wheelTarget.mousewheel
        );
      }

      const mouseConstraint = MouseConstraint.create(engine, {
        mouse,
        constraint: {
          stiffness: 0.2,
          damping: 0.2,
          render: { visible: false },
        },
      });
      World.add(world, mouseConstraint);

      Events.on(mouseConstraint, "startdrag", () => {
        container.style.cursor = "grabbing";
      });
      Events.on(mouseConstraint, "enddrag", () => {
        container.style.cursor = "grab";
      });

      const runner = Runner.create();
      Runner.run(runner, engine);

      let raf = 0;
      const tick = (): void => {
        for (let index = 0; index < states.length; index++) {
          const state = states[index];
          const element = chipRefs.current[index];
          if (!state || !element) continue;
          const { x, y } = state.body.position;
          element.style.transform = `translate3d(${x - state.width / 2}px, ${
            y - state.height / 2
          }px, 0) rotate(${state.body.angle}rad)`;
        }
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);

      const onResize = (): void => {
        const nextWidth = container.clientWidth;
        const nextHeight = container.clientHeight;
        if (nextWidth === width && nextHeight === height) return;
        Body.setPosition(floor, {
          x: nextWidth / 2,
          y: nextHeight - WALL_PAD + wallThickness / 2,
        });
        Body.setPosition(leftWall, {
          x: WALL_PAD - wallThickness / 2,
          y: nextHeight / 2,
        });
        Body.setPosition(rightWall, {
          x: nextWidth - WALL_PAD + wallThickness / 2,
          y: nextHeight / 2,
        });
        width = nextWidth;
        height = nextHeight;
      };
      const resizeObserver = new ResizeObserver(onResize);
      resizeObserver.observe(container);

      cleanup = () => {
        cancelAnimationFrame(raf);
        resizeObserver.disconnect();
        Runner.stop(runner);
        World.clear(world, false);
        Engine.clear(engine);
      };
    })();

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, [resetKey, prefersReducedMotion]);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <h3 className="text-foreground text-[15px] font-semibold tracking-tight">
          常用工具
        </h3>
      </div>

      <div className="border-foreground/5 bg-foreground/2 dark:bg-foreground/5 relative h-40 overflow-hidden rounded-4xl border sm:h-64">
        <button
          type="button"
          onClick={() => setResetKey((key) => key + 1)}
          aria-label="重置工具标签布局"
          className="focus-ring border-foreground/8 bg-background text-foreground/70 hover:text-foreground absolute top-3 right-3 z-20 inline-flex h-9 w-9 items-center justify-center rounded-xl border transition-colors"
        >
          <RotateCcw className="h-4 w-4" strokeWidth={2.25} aria-hidden />
        </button>

        <div
          ref={measureRef}
          aria-hidden="true"
          className="pointer-events-none invisible absolute top-0 left-0 flex flex-wrap gap-2"
        >
          {TOOLS.map((tool) => (
            <ToolPill key={`measure-${tool.label}`} tool={tool} />
          ))}
        </div>

        {prefersReducedMotion ? (
          <div className="flex h-full flex-wrap content-center items-center justify-center gap-2 p-4">
            {TOOLS.map((tool) => (
              <ToolPill key={tool.label} tool={tool} />
            ))}
          </div>
        ) : (
          <div
            ref={containerRef}
            className="absolute inset-0 cursor-grab select-none"
            style={{ touchAction: "none" }}
          >
            {TOOLS.map((tool, index) => (
              <div
                key={`${resetKey}-${tool.label}`}
                ref={(element) => {
                  chipRefs.current[index] = element;
                }}
                className="pointer-events-none absolute top-0 left-0 will-change-transform"
                style={{ transform: "translate3d(-9999px, -9999px, 0)" }}
              >
                <ToolPill tool={tool} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ToolPill({ tool }: { tool: Tool }): ReactNode {
  return (
    <div
      className="dark:ring-1 dark:ring-white/15 inline-flex items-center gap-2 p-1 pr-2 text-[15px] font-medium tracking-tight sm:text-[16px]"
      style={{
        backgroundColor: tool.bg,
        color: tool.fg,
        borderRadius: `${CHIP_RADIUS}px`,
      }}
    >
      <span
        className="inline-flex h-8 min-w-8 items-center justify-center bg-white/95 px-1.5"
        style={{ borderRadius: `${ICON_RADIUS}px` }}
        aria-hidden="true"
      >
        <span className="text-[12px] font-bold leading-none text-neutral-950">
          {tool.short}
        </span>
      </span>
      <span>{tool.label}</span>
    </div>
  );
}
