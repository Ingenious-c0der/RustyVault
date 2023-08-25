import "../style.css";
import "../App.css";
import '../components/VaultCard/VaultCard.css';
import { ReactNotifications } from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'
// This default export is required in a new `pages/_app.js` file.

export default function MyApp({ Component, pageProps }) {
  return (
  <div>
    <ReactNotifications />
    <Component {...pageProps} />
  </div>
);
}
