import React, { useState, useEffect, useCallback } from 'react';
import { useInterval } from '../hooks/use-interval';
import { secondsToTime } from '../utils/seconds-to-time';
import { Button } from './button';
import { Timer } from './timer';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const start = require('../sounds/bell-start.mp3');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const finish = require('../sounds/bell-finish.mp3');

const startAudio = new Audio(start);
const finishAudio = new Audio(finish);

interface Props {
  pomodoroTimer: number;
  shortRestTime: number;
  longRestTime: number;
  cycles: number;
}

export function PomodoroTimer(props: Props): JSX.Element {
  const [mainTime, setMainTime] = useState(props.pomodoroTimer);
  const [timeCounting, setTimeCounting] = useState(false);
  const [working, setWorking] = useState(false);
  const [resting, setResting] = useState(false);
  const [cyclesQntMan, setCyclesQntMan] = useState(
    new Array(props.cycles - 1).fill(true),
  );

  const [completedCycles, setCompletedCycles] = useState(0);
  const [fullWorkingTime, setfullWorkingTime] = useState(0);
  const [pomodoroQnt, setPomodoroQnt] = useState(0);

  useInterval(
    () => {
      setMainTime(mainTime - 1);
      if (working) setfullWorkingTime(fullWorkingTime + 1);
    },
    timeCounting ? 1000 : null,
  );

  const configWork = useCallback(() => {
    setTimeCounting(true);
    setWorking(true);
    setResting(false);
    setMainTime(props.pomodoroTimer);
    startAudio.play();
  }, [
    setWorking,
    setResting,
    setMainTime,
    setTimeCounting,
    props.pomodoroTimer,
  ]);

  const configRest = useCallback(
    (long: boolean) => {
      setTimeCounting(true);
      setWorking(false);
      setResting(true);
      if (long) {
        setMainTime(props.longRestTime);
      } else {
        setMainTime(props.shortRestTime);
      }
      finishAudio.play();
    },
    [
      setWorking,
      setResting,
      setMainTime,
      setTimeCounting,
      props.longRestTime,
      props.shortRestTime,
    ],
  );

  useEffect(() => {
    if (working) document.body.classList.add('working');
    if (resting) document.body.classList.remove('working');
    if (mainTime > 0) return;
    if (working && cyclesQntMan.length > 0) {
      configRest(false);
      cyclesQntMan.pop();
    } else if (working && cyclesQntMan.length <= 0) {
      configRest(true);
      setCyclesQntMan(new Array(props.cycles - 1).fill(true));
      setCompletedCycles(completedCycles + 1);
    }
    if (working) setPomodoroQnt(pomodoroQnt + 1);
    if (resting) configWork();
  }, [
    working,
    resting,
    mainTime,
    cyclesQntMan,
    pomodoroQnt,
    completedCycles,
    configRest,
    configWork,
    setCyclesQntMan,
    props.cycles,
  ]);

  return (
    <div className="pomodoro">
      <h2>You are: {working ? 'Working' : 'Resting'}</h2>
      <Timer mainTime={mainTime} />
      <div className="controls">
        <Button text="Work" onClick={() => configWork()} />
        <Button text="Rest" onClick={() => configRest(false)} />
        <Button
          className={!working && !resting ? 'hidden' : ''}
          text={timeCounting ? 'Pause' : 'Play'}
          onClick={() => setTimeCounting(!timeCounting)}
        />
      </div>
      <div className="details">
        <p>Ciclos concluidos: {completedCycles}</p>
        <p>Tempo trabalhado: {secondsToTime(fullWorkingTime)}</p>
        <p>Pomodoros concluidos: {pomodoroQnt}</p>
      </div>
    </div>
  );
}
