import { Outlet } from 'react-router-dom';
import Nav from './components/Nav';

function App() {
  return (
    <div className='app-container'>
      <Nav />
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default App;