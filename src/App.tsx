import React from 'react';
import { PomodoroTimer } from './components/pomodoro-timer';

function App(): JSX.Element {
  return (
    <div className="container">
      <PomodoroTimer
        pomodoroTimer={3605}
        shortRestTime={2}
        longRestTime={3}
        cycles={4}
      />
    </div>
  );
}

export default App;
