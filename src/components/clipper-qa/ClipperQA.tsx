"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Bug,
  ChevronDown,
  ClipboardList,
  ScanSearch,
  Send,
  Trash2,
  X,
} from "lucide-react";

const STORAGE_EXPANDED = "clipper-qa-expanded";
const STORAGE_BUGS = "clipper-qa-bugs";
const OUTLINE = "2px solid #6366f1";
const OUTLINE_OFFSET = "0px";

export interface ClippedBug {
  id: string;
  file: string;
  component: string;
  classes: string;
  description: string;
  breakpoint: "Mobile" | "Desktop";
}

const getBreakpoint = (): "Mobile" | "Desktop" =>
  typeof window !== "undefined" &&
  window.matchMedia("(max-width: 768px)").matches
    ? "Mobile"
    : "Desktop";

const getClassString = (el: Element): string => {
  if (el instanceof HTMLElement) return String(el.className ?? "");
  if (el instanceof SVGElement && el.className) {
    if (typeof el.className === "string") return el.className;
    return el.className.baseVal ?? "";
  }
  return el.getAttribute("class") ?? "";
};

const isInsideWidget = (node: EventTarget | null, root: HTMLElement | null) => {
  if (!(node instanceof Element)) return false;
  if (root?.contains(node)) return true;
  return node.closest("[data-clipper-qa-root]") !== null;
};

const elementFromPointExcludingWidget = (
  x: number,
  y: number,
  root: HTMLElement | null,
): Element | null => {
  const el = document.elementFromPoint(x, y);
  if (!el || isInsideWidget(el, root)) return null;
  return el;
};

const captureContextFromElement = (el: Element) => {
  const fileEl = el.closest("[data-qa-file]");
  const compEl = el.closest("[data-qa-component]");
  const file = fileEl?.getAttribute("data-qa-file") ?? "";
  const component = compEl?.getAttribute("data-qa-component") ?? "";
  const classes = getClassString(el);
  return {
    file,
    component,
    classes,
    breakpoint: getBreakpoint(),
  };
};

export const ClipperQA = () => {
  const rootRef = useRef<HTMLDivElement>(null);
  const hoverRef = useRef<Element | null>(null);
  const inspectModeRef = useRef(false);
  const [expanded, setExpanded] = useState(true);
  const [inspectMode, setInspectMode] = useState(false);
  const [bugs, setBugs] = useState<ClippedBug[]>([]);
  const [storageReady, setStorageReady] = useState(false);

  const clearHoverOutline = useCallback(() => {
    const prev = hoverRef.current;
    if (prev instanceof HTMLElement || prev instanceof SVGElement) {
      prev.style.outline = "";
      prev.style.outlineOffset = "";
    }
    hoverRef.current = null;
  }, []);

  const addBugFromElement = useCallback((target: Element) => {
    const ctx = captureContextFromElement(target);
    const next: ClippedBug = {
      id:
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : `bug-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      file: ctx.file,
      component: ctx.component,
      classes: ctx.classes,
      description: "",
      breakpoint: ctx.breakpoint,
    };
    setBugs((prev) => [...prev, next]);
  }, []);

  inspectModeRef.current = inspectMode;

  useEffect(() => {
    try {
      const exp = localStorage.getItem(STORAGE_EXPANDED);
      if (exp !== null) setExpanded(exp === "true");
      const raw = localStorage.getItem(STORAGE_BUGS);
      if (raw) {
        const parsed = JSON.parse(raw) as unknown;
        if (Array.isArray(parsed)) {
          setBugs(
            parsed.filter(
              (b): b is ClippedBug =>
                typeof b === "object" &&
                b !== null &&
                "id" in b &&
                "file" in b &&
                "component" in b &&
                "classes" in b &&
                "description" in b &&
                "breakpoint" in b,
            ),
          );
        }
      }
    } catch {
      /* ignore corrupt storage */
    }
    setStorageReady(true);
  }, []);

  useEffect(() => {
    if (!storageReady) return;
    localStorage.setItem(STORAGE_EXPANDED, String(expanded));
  }, [expanded, storageReady]);

  useEffect(() => {
    if (!storageReady) return;
    localStorage.setItem(STORAGE_BUGS, JSON.stringify(bugs));
  }, [bugs, storageReady]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const highlight = inspectModeRef.current || e.altKey;
      if (!highlight) {
        const prev = hoverRef.current;
        if (prev && (prev instanceof HTMLElement || prev instanceof SVGElement)) {
          prev.style.outline = "";
          prev.style.outlineOffset = "";
        }
        hoverRef.current = null;
        return;
      }

      const root = rootRef.current;
      const hit = elementFromPointExcludingWidget(e.clientX, e.clientY, root);
      const prev = hoverRef.current;
      if (prev && prev !== hit) {
        if (prev instanceof HTMLElement || prev instanceof SVGElement) {
          prev.style.outline = "";
          prev.style.outlineOffset = "";
        }
      }
      if (hit && (hit instanceof HTMLElement || hit instanceof SVGElement)) {
        hit.style.outline = OUTLINE;
        hit.style.outlineOffset = OUTLINE_OFFSET;
        hoverRef.current = hit;
      } else {
        hoverRef.current = null;
      }
    };

    const onScroll = () => clearHoverOutline();

    const clearIfAltOnly = () => {
      if (!inspectModeRef.current) clearHoverOutline();
    };

    const onKeyUp = (e: KeyboardEvent) => {
      if (e.code === "AltLeft" || e.code === "AltRight" || e.key === "Alt") {
        clearIfAltOnly();
      }
    };

    const onBlur = () => clearIfAltOnly();

    window.addEventListener("mousemove", onMove, true);
    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("keyup", onKeyUp, true);
    window.addEventListener("blur", onBlur);
    return () => {
      window.removeEventListener("mousemove", onMove, true);
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("keyup", onKeyUp, true);
      window.removeEventListener("blur", onBlur);
      clearHoverOutline();
    };
  }, [clearHoverOutline]);

  useEffect(() => {
    const shouldIntercept = (e: MouseEvent) => {
      if (e.button !== 0) return false;
      if (isInsideWidget(e.target, rootRef.current)) return false;
      return inspectMode || e.altKey;
    };

    const onMouseDown = (e: MouseEvent) => {
      if (!shouldIntercept(e)) return;
      e.preventDefault();
      e.stopPropagation();
    };

    const onClick = (e: MouseEvent) => {
      if (!shouldIntercept(e)) return;
      e.preventDefault();
      e.stopImmediatePropagation();
      const target = e.target;
      if (!(target instanceof Element)) return;
      addBugFromElement(target);
    };

    window.addEventListener("mousedown", onMouseDown, true);
    window.addEventListener("click", onClick, true);
    return () => {
      window.removeEventListener("mousedown", onMouseDown, true);
      window.removeEventListener("click", onClick, true);
    };
  }, [inspectMode, addBugFromElement]);

  const updateDescription = (id: string, description: string) => {
    setBugs((prev) =>
      prev.map((b) => (b.id === id ? { ...b, description } : b)),
    );
  };

  const clearBatch = () => setBugs([]);

  const removeBug = (id: string) => {
    setBugs((prev) => prev.filter((b) => b.id !== id));
  };

  const sendToAi = () => {
    const payload = bugs.map(
      ({ id, file, component, classes, description, breakpoint }) => ({
        id,
        file,
        component,
        classes,
        description,
        breakpoint,
      }),
    );
    console.log(JSON.stringify(payload, null, 2));
  };

  if (!expanded) {
    return (
      <div
        ref={rootRef}
        data-clipper-qa-root
        className="fixed bottom-5 right-5 z-[2147483646] font-sans"
      >
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-600 text-sm font-bold text-white shadow-lg shadow-indigo-600/25 ring-2 ring-white transition hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
          aria-label="Open ClipperQA"
        >
          <Bug className="h-6 w-6" strokeWidth={2} />
        </button>
      </div>
    );
  }

  return (
    <div
      ref={rootRef}
      data-clipper-qa-root
      className="fixed bottom-5 right-5 z-[2147483646] flex w-[min(100vw-1.5rem,22rem)] max-h-[min(85vh,36rem)] flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white text-zinc-900 shadow-xl shadow-zinc-400/25 ring-1 ring-zinc-200/80 font-sans"
    >
      <header className="flex items-center justify-between gap-2 border-b border-zinc-200 bg-zinc-50 px-3 py-2.5">
        <div className="flex items-center gap-2 min-w-0">
          <ClipboardList className="h-4 w-4 shrink-0 text-indigo-600" />
          <span className="truncate text-sm font-semibold text-zinc-900">
            ClipperQA
          </span>
        </div>
        <button
          type="button"
          onClick={() => setExpanded(false)}
          className="inline-flex items-center gap-1 rounded-lg border border-zinc-300 bg-white px-2 py-1 text-[11px] font-medium text-zinc-700 transition hover:bg-zinc-50"
        >
          <ChevronDown className="h-3.5 w-3.5" />
          Collapse
        </button>
      </header>

      <div className="flex flex-1 flex-col gap-3 overflow-hidden p-3">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setInspectMode((v) => !v)}
            aria-pressed={inspectMode}
            className={`inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-medium transition min-w-[7rem] ${
              inspectMode
                ? "bg-indigo-600 text-white hover:bg-indigo-500"
                : "border border-zinc-200 bg-zinc-100 text-zinc-800 hover:bg-zinc-200"
            }`}
          >
            <ScanSearch className="h-3.5 w-3.5" />
            Toggle Inspect
          </button>
          <button
            type="button"
            onClick={clearBatch}
            className="inline-flex items-center justify-center gap-1 rounded-lg border border-zinc-200 bg-zinc-100 px-2.5 py-2 text-xs font-medium text-zinc-800 hover:bg-zinc-200"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Clear Batch
          </button>
        </div>

        <p className="text-[11px] leading-snug text-zinc-600">
          Hold <span className="font-medium text-indigo-700">Alt</span> to
          highlight on hover, or use Inspect for the same without Alt.{" "}
          <span className="text-indigo-700">Alt+click</span> clips anytime
          (outside this panel).
        </p>

        <div className="min-h-0 flex-1 overflow-y-auto rounded-lg border border-zinc-200 bg-zinc-50">
          {bugs.length === 0 ? (
            <p className="p-4 text-center text-xs text-zinc-500">
              No clips yet. Turn on Inspect or Alt+click an element.
            </p>
          ) : (
            <ul className="divide-y divide-zinc-200">
              {bugs.map((b) => (
                <li key={b.id} className="p-3">
                  <div className="mb-2 flex items-start gap-2">
                    <div className="min-w-0 flex-1 space-y-0.5 text-[11px]">
                      <p className="font-medium text-indigo-800">
                        {b.component || "(no data-qa-component)"}
                      </p>
                      <p className="truncate text-zinc-500" title={b.file}>
                        {b.file || "(no data-qa-file)"}
                      </p>
                      <p className="text-zinc-600">{b.breakpoint}</p>
                      <p
                        className="max-h-12 overflow-y-auto break-all font-mono text-[10px] text-zinc-500"
                        title={b.classes}
                      >
                        {b.classes || "—"}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeBug(b.id)}
                      className="shrink-0 rounded-md p-1 text-zinc-400 transition hover:bg-red-50 hover:text-red-600"
                      aria-label="Remove clip"
                    >
                      <X className="h-4 w-4" strokeWidth={2} />
                    </button>
                  </div>
                  <label className="sr-only" htmlFor={`desc-${b.id}`}>
                    Description
                  </label>
                  <textarea
                    id={`desc-${b.id}`}
                    value={b.description}
                    onChange={(e) => updateDescription(b.id, e.target.value)}
                    placeholder="Bug description…"
                    rows={2}
                    className="w-full resize-none rounded-md border border-zinc-300 bg-white px-2 py-1.5 text-xs text-zinc-900 placeholder:text-zinc-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </li>
              ))}
            </ul>
          )}
        </div>

        <button
          type="button"
          onClick={sendToAi}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 disabled:opacity-50"
          disabled={bugs.length === 0}
        >
          <Send className="h-4 w-4" />
          SEND TO AI
        </button>
      </div>
    </div>
  );
};
