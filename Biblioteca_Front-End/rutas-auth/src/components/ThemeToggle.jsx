// src/components/ThemeToggle.jsx
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      style={{
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        fontSize: '1.5rem',
        padding: '0.5rem',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.3s ease',
        width: '40px',
        height: '40px'
      }}
      title={isDarkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
    >
      {isDarkMode ? '☀️' : '🌙'}
    </button>
  );
};

export default ThemeToggle;