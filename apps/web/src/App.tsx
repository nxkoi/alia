import React from 'react';
import { TaskList } from './components/TaskList';

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>AIDE</h1>
        <p>ADHD Focus</p>
      </header>
      <main className="app-main">
        <TaskList />
      </main>
    </div>
  );
}

export default App;
