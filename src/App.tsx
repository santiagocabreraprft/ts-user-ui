import UserList from './components/users/UserList';
import './App.css';

function App() {
  return (
    <div className="App">
      <header>
        <h1>Management Users System</h1>
      </header>

      <main>
        <UserList />
      </main>
    </div>
  );
}

export default App;
