import { useState, useEffect } from "react";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
dayjs.extend(timezone);

export default function Clock({ tz }) {
  const setClock = function (tz, hfunc, mfunc, sfunc) {
    const now = dayjs().tz(tz);
    const hours = now.hour();

    const minutes = now.minute();

    const seconds = now.second();

    hfunc(hours * 30 + minutes / 2);
    mfunc(minutes * 6 + seconds / 10);
    sfunc(seconds * 6);
  };
  const [hourHand, setHourHand] = useState("");
  const [minHand, setMinHand] = useState("");
  const [secHand, setSecHand] = useState("");

  useEffect(() => {
    if (!tz) return;
    const interval = setInterval(() => {
      setClock(tz, setHourHand, setMinHand, setSecHand);
    }, 1000);
    return () => clearInterval(interval);
  }, [tz]);

  const ticks = [];
  for (let i = 0; i < 12; i++) {
    if (i % 3 === 0) continue;
    ticks.push(
      <div
        key={i}
        className="tick-container"
        style={{ transform: `rotate(${i * 30}deg)` }}
      >
        <div className="tick-mark" />
      </div>,
    );
  }

  return (
    <div className="clock">
      {ticks}
      <span className="clock-num clock-12">12</span>
      <span className="clock-num clock-3">3</span>
      <span className="clock-num clock-6">6</span>
      <span className="clock-num clock-9">9</span>

      <div
        className="hour"
        style={
          hourHand !== 0
            ? {
                transform: `rotate(${hourHand}deg)`,
                transition: "all 1s linear",
              }
            : { transform: `rotate(${hourHand}deg)`, transition: "none" }
        }
      ></div>
      <div
        className="minute"
        style={
          minHand !== 0
            ? {
                transform: `rotate(${minHand}deg)`,
                transition: "all 1s linear",
              }
            : { transform: `rotate(${minHand}deg)`, transition: "none" }
        }
      ></div>
      <div
        className="second"
        style={
          secHand !== 0
            ? {
                transform: `rotate(${secHand}deg)`,
                transition: "all 1s linear",
              }
            : { transform: `rotate(${secHand}deg)`, transition: "none" }
        }
      ></div>
      <div className="dot"></div>
    </div>
  );
}
