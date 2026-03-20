"use client";

import { useState, useEffect, useRef } from "react";

const VARIANTS = [
  { top: "your next", middle: "idea", bottom: "awaits" },
  { top: "find.", middle: "build.", bottom: "ship." },
];

const TYPE_SPEED = 80;
const DELETE_SPEED = 40;
const PAUSE_AFTER_TYPE = 2500;

export function HeroTypewriter() {
  const [text, setText] = useState(["", "", ""]);
  const stateRef = useRef({
    variantIndex: 0,
    phase: "typing" as "typing" | "paused" | "deleting",
    line: 0,
    text: ["", "", ""],
  });

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    function step() {
      const s = stateRef.current;
      const variant = VARIANTS[s.variantIndex];
      const lines = [variant.top, variant.middle, variant.bottom];

      if (s.phase === "typing") {
        const target = lines[s.line];
        if (s.text[s.line].length < target.length) {
          s.text[s.line] = target.slice(0, s.text[s.line].length + 1);
          setText([...s.text]);
          timeout = setTimeout(step, TYPE_SPEED);
        } else if (s.line < 2) {
          s.line++;
          timeout = setTimeout(step, TYPE_SPEED);
        } else {
          s.phase = "paused";
          timeout = setTimeout(step, PAUSE_AFTER_TYPE);
        }
      } else if (s.phase === "paused") {
        s.phase = "deleting";
        s.line = 2;
        timeout = setTimeout(step, DELETE_SPEED);
      } else if (s.phase === "deleting") {
        if (s.text[s.line].length > 0) {
          s.text[s.line] = s.text[s.line].slice(0, -1);
          setText([...s.text]);
          timeout = setTimeout(step, DELETE_SPEED);
        } else if (s.line > 0) {
          s.line--;
          timeout = setTimeout(step, DELETE_SPEED);
        } else {
          s.variantIndex = (s.variantIndex + 1) % VARIANTS.length;
          s.phase = "typing";
          s.line = 0;
          timeout = setTimeout(step, TYPE_SPEED);
        }
      }
    }

    step();
    return () => clearTimeout(timeout);
  }, []);

  return (
    <h1 className="font-pixel text-2xl sm:text-4xl leading-relaxed sm:leading-relaxed tracking-wide min-h-[8rem] sm:min-h-[11rem]">
      <span className="text-muted-foreground">{text[0]}</span>
      <br />
      <span className="gradient-text">{text[1]}</span>
      <span className="inline-block w-[3px] h-[1.1em] bg-amber-400 ml-1 align-middle animate-pulse" />
      <br />
      <span className="text-muted-foreground">{text[2]}</span>
    </h1>
  );
}
