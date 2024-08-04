import { useState, useEffect } from "react";
import { Timer } from "lucide-react";

interface PomodoroTimerProps {
  workTime?: number;
  breakTime?: number;
  hourlyWage?: number;
}

const PomodoroTimer = ({
  workTime = 25,
  breakTime = 5,
  hourlyWage = 20,
}: PomodoroTimerProps) => {
  const [seconds, setSeconds] = useState(workTime * 60);
  const [isWorking, setIsWorking] = useState(true);
  const [moneyEarned, setMoneyEarned] = useState(0);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [hourlyWageState, setHourlyWageState] = useState(hourlyWage);

  useEffect(() => {
    if (isRunning) {
      const interval = setInterval(() => {
        if (seconds > 0) {
          setSeconds((prevSeconds) => prevSeconds - 1);
        } else {
          if (isWorking) {
            setIsWorking(false);
            setSeconds(breakTime * 60);
          } else {
            setIsWorking(true);
            setSeconds(workTime * 60);
          }
        }
      }, 1000);
      setIntervalId(interval);
      return () => clearInterval(interval);
    }
  }, [seconds, isWorking, workTime, breakTime, isRunning]);

  useEffect(() => {
    if (isRunning && isWorking) {
      const moneyPerSecond = hourlyWageState / 3600;
      const interval = setInterval(() => {
        setMoneyEarned((prevMoney) => prevMoney + moneyPerSecond);
      }, 1000);
      setIntervalId(interval);
      return () => clearInterval(interval);
    }
  }, [isWorking, hourlyWageState, isRunning]);

  const handleStartStop = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setSeconds(workTime * 60);
    setIsWorking(true);
    setMoneyEarned(0);
    setIsRunning(false);
    clearInterval(intervalId!);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Timer size={48} />
      <h1 className="text-4xl font-bold mb-4">
        {isWorking ? "Work Time" : "Break Time"}
      </h1>
      <p className="text-2xl font-bold mb-4">
        {Math.floor(seconds / 60).toString().padStart(2, "0")}:
        {Math.floor(seconds % 60).toString().padStart(2, "0")}
      </p>
      <div className="flex flex-col items-start mb-4">
        <p className="text-2xl font-bold">
          Money Earned: ${moneyEarned.toFixed(2)}
        </p>
        <div className="flex items-center">
          <p className="text-2xl font-bold">Hourly Wage:</p>
          <input
            type="number"
            value={hourlyWageState}
            onChange={(e) => setHourlyWageState(Number(e.target.value))}
            className="ml-2 text-2xl font-bold w-20"
          />
        </div>
      </div>
      <div className="flex justify-center">
        <button
          className={`${
            isRunning ? "bg-red-500 hover:bg-red-700" : "bg-green-500 hover:bg-green-700"
          } text-white font-bold py-2 px-4 rounded`}
          onClick={handleStartStop}
        >
          {isRunning ? "Stop" : "Start"}
        </button>
        <button
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-4"
          onClick={handleReset}
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default PomodoroTimer;