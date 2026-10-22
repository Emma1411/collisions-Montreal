
import { NavLink } from "react-router-dom";
import { FiCompass, FiDownload, FiInfo } from "react-icons/fi";

function Header() {
  return (
    <header className="app-header">
      <NavLink to="/" className="app-brand">
        <span className="app-brand-icon">
          <FiCompass />
        </span>

        <span className="app-brand-name">
          Collisions
          <br />
          Montréal
        </span>
      </NavLink>

      <div className="header-data-label">
        DONNÉES 2012–2021 | BILAN OFFICIEL SPVM/SAAQ
      </div>

      <nav className="header-navigation">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            isActive ? "header-link active" : "header-link"
          }
        >
          Vue d'ensemble
        </NavLink>

        <NavLink
          to="/carte"
          className={({ isActive }) =>
            isActive ? "header-link active" : "header-link"
          }
        >
          Carte des points chauds
        </NavLink>

        <NavLink
          to="/methodologie"
          className={({ isActive }) =>
            isActive ? "header-link active" : "header-link"
          }
        >
          Méthodologie & limites
        </NavLink>
      </nav>

      <a
        className="header-download"
        href="/data/meta.json"
        download="meta.json"
      >
        <FiDownload />
        Télécharger les données
      </a>

      <a
        className="header-info"
        href="/methodologie"
        aria-label="Informations et méthodologie"
      >
        <FiInfo />
      </a>
    </header>
  );
}

export default Header;
