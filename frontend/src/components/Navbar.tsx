import { useEffect, useRef, useState } from 'react';
import {
  Bars3Icon,
  BuildingOffice2Icon,
  HomeIcon,
  MegaphoneIcon,
  UserCircleIcon,
  UserIcon,
  XMarkIcon,
} from '@heroicons/react/24/solid';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import claslogo from '../assets/img/clas-logo-name.png';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { label: 'Inicio', to: '/', icon: HomeIcon, end: true },
  { label: 'Directorio', to: '/directorio', icon: BuildingOffice2Icon },
  { label: 'Noticias', to: '/noticias', icon: MegaphoneIcon },
];

const linkClass = ({ isActive }: { isActive: boolean }) =>
  [
    'font-body inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium no-underline transition-colors duration-200',
    isActive
      ? 'bg-[#eef5fd] text-primary'
      : 'text-[#64748b] hover:text-[#12284b] hover:bg-gray-50',
  ].join(' ');

const mobileLinkClass = ({ isActive }: { isActive: boolean }) =>
  [
    'font-body flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium no-underline transition-colors duration-200',
    isActive
      ? 'bg-[#eef5fd] text-primary'
      : 'text-[#64748b] hover:text-[#12284b] hover:bg-gray-50',
  ].join(' ');

export default function Navbar() {
  const { usuarioActual, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuToggleRef = useRef<HTMLButtonElement>(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!isMobileMenuOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMobileMenuOpen(false);
        menuToggleRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isMobileMenuOpen]);

  return (
    <nav className="sticky top-0 z-[100] grid h-[72px] grid-cols-[1fr_auto_1fr] items-center bg-white px-10 shadow-[0_2px_4px_rgba(15,23,42,0.12),0_8px_40px_rgba(15,23,42,0.16)] max-md:px-5">

      <Link to="/" className="flex items-center justify-self-start no-underline">
        <img src={claslogo} alt="Directorio Demo" className="h-10 w-auto" />
      </Link>

      <ul className="flex list-none items-center gap-1 justify-self-center max-md:hidden">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <li key={item.to}>
              <NavLink to={item.to} className={linkClass} end={item.end}>
                <Icon aria-hidden="true" className="h-5 w-5 shrink-0" />
                {item.label}
              </NavLink>
            </li>
          );
        })}

        {[1, 2].includes(usuarioActual?.rol_id) && (
          <li>
            <NavLink to="/admin" className={linkClass}>
              <UserCircleIcon className="h-5 w-5 shrink-0" aria-hidden="true" />
              Panel Admin
            </NavLink>
          </li>
        )}

        {usuarioActual && (
          <li>
            <NavLink to="/mi-cuenta" className={linkClass}>
              <UserIcon className="h-5 w-5 shrink-0" aria-hidden="true" />
              <span className="max-w-[140px] truncate">{usuarioActual.nombre_usuario || 'Mi cuenta'}</span>
            </NavLink>
          </li>
        )}
      </ul>

      <div className="justify-self-end flex items-center gap-3">
        {usuarioActual ? (
          <button
            onClick={handleLogout}
            className="font-body text-sm font-semibold px-4 py-2 rounded-xl border border-red-200 text-red-500 hover:bg-red-600 hover:text-white hover:border-red-600 transition-colors max-md:hidden"
          >
            Cerrar sesión
          </button>
        ) : (
          <Link
            to="/login"
            className="font-body text-sm font-semibold px-5 py-2 rounded-xl bg-[#12284b] text-white no-underline hover:bg-[#1a3a6b] transition-colors shadow-sm max-md:hidden"
          >
            Iniciar sesión
          </Link>
        )}

        <button
          ref={menuToggleRef}
          type="button"
          onClick={() => setIsMobileMenuOpen((isOpen) => !isOpen)}
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-nav-menu"
          aria-label={isMobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
          className="hidden max-md:flex items-center justify-center h-10 w-10 rounded-xl text-[#12284b] hover:bg-gray-50 transition-colors"
        >
          {isMobileMenuOpen ? (
            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
          ) : (
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          )}
        </button>
      </div>

      {isMobileMenuOpen && (
        <div
          id="mobile-nav-menu"
          className="hidden max-md:block absolute left-0 right-0 top-full bg-white px-5 py-3 shadow-[0_8px_40px_rgba(15,23,42,0.16)]"
        >
          <ul className="flex list-none flex-col gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.to}>
                  <NavLink to={item.to} className={mobileLinkClass} end={item.end}>
                    <Icon aria-hidden="true" className="h-5 w-5 shrink-0" />
                    {item.label}
                  </NavLink>
                </li>
              );
            })}

            {[1, 2].includes(usuarioActual?.rol_id) && (
              <li>
                <NavLink to="/admin" className={mobileLinkClass}>
                  <UserCircleIcon className="h-5 w-5 shrink-0" aria-hidden="true" />
                  Panel Admin
                </NavLink>
              </li>
            )}

            {usuarioActual && (
              <li>
                <NavLink to="/mi-cuenta" className={mobileLinkClass}>
                  <UserIcon className="h-5 w-5 shrink-0" aria-hidden="true" />
                  <span className="truncate">{usuarioActual.nombre_usuario || 'Mi cuenta'}</span>
                </NavLink>
              </li>
            )}

            <li className="mt-2 border-t border-gray-100 pt-3">
              {usuarioActual ? (
                <button
                  onClick={handleLogout}
                  className="font-body w-full text-left text-sm font-semibold px-4 py-2 rounded-xl border border-red-200 text-red-500 hover:bg-red-600 hover:text-white hover:border-red-600 transition-colors"
                >
                  Cerrar sesión
                </button>
              ) : (
                <Link
                  to="/login"
                  className="font-body flex w-full justify-center text-sm font-semibold px-5 py-2 rounded-xl bg-[#12284b] text-white no-underline hover:bg-[#1a3a6b] transition-colors shadow-sm"
                >
                  Iniciar sesión
                </Link>
              )}
            </li>
          </ul>
        </div>
      )}

    </nav>
  );
}
