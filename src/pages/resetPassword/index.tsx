import { Link, useNavigate } from "react-router-dom";
import Container from "../../components/container";
import logoImg from "../../assets/logo.svg";
import { useEffect, useState } from "react";
import { supabase } from "../../services/supabaseConnection";
import toast from "react-hot-toast";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function checkSession() {
      const { data, error } = await supabase.auth.getSession();
      if (!data.session) {
        toast.error("Token inválido ou expirado. Solicite um novo email!");
        navigate("/");
        return;
      }
      if (error) {
        toast.error(
          "Ocorreu um erro durante o processo de redefinição de senha"
        );
      }
    }
    checkSession();
  }, []);

  async function handleResetPassword() {
    if (newPassword !== confirmPassword) {
      toast.error("As senhas devem ser iguais");
      return;
    }
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (error) {
        toast.error("Ocorreu um erro. Por favor, tente novamente.");
      } else {
        toast.success("Senha redefinida com sucesso!");
        navigate("/"); // Redireciona para a página inicial ou de login
      }
    } catch {
      toast.error(
        "Ocorreu um erro. Por favor, tente novamente. Verifique se sua senha não seja igual a anterior"
      );
    }
  }

  return (
    <Container>
      <div className="flex justify-center items-center flex-col min-h-screen gap-4 w-full">
        <Link to="/" className="max-w-sm w-full mb-6">
          <img src={logoImg} className="w-full" />
        </Link>
        <form
          className="bg-white max-w-xl w-full p-4 rounded-lg"
          onSubmit={(e) => {
            handleResetPassword();
            e.preventDefault(); // Chama a função de redefinição de senha
          }}
        >
          <input
            name="newPassword"
            placeholder="Digite sua nova senha"
            className="w-full rounded-lg border-1 mb-3 border-gray-200 h-11 px-2"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <input
            name="confirmPassword"
            placeholder="Confirme sua senha"
            className="w-full rounded-lg border-1 mb-3 border-gray-200 h-11 px-2"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button
            type="submit"
            className="bg-zinc-900 text-white w-full h-11 rounded-md cursor-pointer"
          >
            Redefinir
          </button>
        </form>
      </div>
    </Container>
  );
};

export default ResetPassword;
