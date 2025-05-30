import { Link } from "react-router-dom";
import { supabase } from "../../services/supabaseConnection";

const DashboardHeader = () => {
  async function handleLogout() {
    await supabase.auth.signOut();
  }
  return (
    <div className="bg-red-500 flex items-center font-medium gap-4 rounded-lg h-11 px-4 mb-4 text-white">
      <Link to="/dashboard">Dashboard</Link>
      <Link to="/dashboard/newCar">Cadastrar Carro</Link>
      <button onClick={handleLogout} className="ml-auto cursor-pointer">
        Sair da conta
      </button>
    </div>
  );
};

export default DashboardHeader;
