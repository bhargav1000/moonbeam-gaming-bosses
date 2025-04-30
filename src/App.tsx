import "./index.css";
import BossList from "./components/BossList";

export function App() {
  return (
    <div className="app">
      <header>
        <h1>Moonbeam Gaming Bosses</h1>
      </header>
      <main>
        <BossList />
      </main>
    </div>
  );
}

export default App;
