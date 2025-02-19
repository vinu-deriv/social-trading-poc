import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { routes } from '@/routes/routes';
import { ThemeProvider } from '@/context/ThemeContext';
import './App.css';

function App() {
  const router = createBrowserRouter(routes);

  // Add class to prevent transitions on page load
  const removeNoTransition = () => {
    document.documentElement.classList.remove('no-transition');
  };

  // Add no-transition class initially
  document.documentElement.classList.add('no-transition');
  // Remove it after a short delay
  setTimeout(removeNoTransition, 100);

  return (
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

export default App;
