import { createRoot } from 'react-dom/client';
import '@fontsource/outfit/latin-400.css';
import '@fontsource/outfit/latin-500.css';
import '@fontsource/outfit/latin-600.css';
import '@fontsource/cormorant-garamond/latin-400.css';
import '@fontsource/cormorant-garamond/latin-400-italic.css';
import '@fontsource/mrs-saint-delafield/latin-400.css';
import './styles.css';
import './responsive.css';
import './kuromi.css';
import './interactions.css';
import App from './App';

createRoot(document.getElementById('root')).render(<App/>);
