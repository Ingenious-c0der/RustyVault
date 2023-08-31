import "../style.css";
import "../App.css";
import "../pages/styles/HomePage.css";
import '../components/VaultCard/VaultCard.css';
import '../components/Sidebar/Sidebar.css';
import '../components/AddVaultForm/Addvaultform.css';
import '../components/DeleteVaultForm/DeleteVaultForm.css';
import '../components/EditVaultForm/EditVaultForm.css';
import { ReactNotifications } from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'
import '../assets/vault_icon.png';

// This default export is required in a new `pages/_app.js` file.

export default function MyApp({ Component, pageProps }) {
  return (
  <div>
    <ReactNotifications />
    <Component {...pageProps} />
  </div>
);
}
