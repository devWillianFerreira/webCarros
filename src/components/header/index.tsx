import { Link } from "react-router-dom";
import logoImg from "../../assets/logo.svg";
import { LogInIcon, User } from "lucide-react";

const Header = () => {
  const signed = true;
  const loadingAuth = false;

  return (
    <div className="flex w-full justify-center h-16 items-center bg-white drop-shadow mb-4">
      <header className="flex justify-between items-center w-full max-w-7xl px-4 mx-auto">
        <Link to="/">
          <img src={logoImg} alt="webCarros" />
        </Link>
        {!loadingAuth && signed && (
          <Link
            to="/dashboard"
            className="border-2 rounded-full border-gray-900 p-1"
          >
            <User size={26} />
          </Link>
        )}

        {!loadingAuth && !signed && (
          <Link to="/login">
            <LogInIcon size={26} />
          </Link>
        )}
      </header>
    </div>
  );
};

export default Header;
