import { useEffect, useState } from "react";

interface TimerProp {
  timeframe?: number | any;
  action(): void;
}

function Timer({ timeframe, action }: TimerProp) {
  const [time, setTime] = useState(timeframe);
  const count = 1000;

  useEffect(() => {
    const interval = setInterval(() => {
      if (time <= 0) {
        action();
        clearInterval(interval);
        return;
      }

      setTime((prev: number) => (prev -= 1));
    }, count);
    return () => clearInterval(interval);
  }, [time]);

  return (
    <button className="bg-dark-300 px-3 py-1 rounded-[30px] ml-2">
      <p
        className={
          " text-white-200 text-[10px] flex items-center justify-center font-pp-rg"
        }
      >
        Resend in
        <span className="text-white-100 font-pp-sb ml-2">{time}sec</span>
      </p>
    </button>
  );
}

export default Timer;
