import { Link } from "react-router-dom";
import Container from "../../components/container";
import logoImg from "../../assets/logo.svg";
import { useState } from "react";
import { supabase } from "../../services/supabaseConnection";
import toast from "react-hot-toast";

const ForgetPassword = () => {
  const [emailUser, setEmailUser] = useState("");

  async function handleForgetPassword() {
    if (!emailUser) {
      toast.error("Por favor, insira uma email válido");
      return;
    }
    const { error } = await supabase.auth.resetPasswordForEmail(emailUser, {
      redirectTo: "https://web-carros-peach.vercel.app/resetPassword",
    });
    if (error) {
      toast.error("Erro ao enviar o email de redefinição, tente novamente!");
    } else {
      toast.success("Email enviado com sucesso!");
      setEmailUser("");
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
            e.preventDefault(); // Previne o comportamento padrão do formulário
            handleForgetPassword(); // Chama a função de redefinição de senha
          }}
        >
          <input
            name="email"
            placeholder="Digite seu email"
            className="w-full rounded-lg border-1 mb-3 border-gray-200 h-11 px-2"
            value={emailUser}
            onChange={(e) => setEmailUser(e.target.value)}
          />
          <button
            type="submit"
            className="bg-zinc-900 text-white w-full h-11 rounded-md cursor-pointer"
          >
            Enviar senha de redefinição
          </button>
        </form>
      </div>
    </Container>
  );
};

export default ForgetPassword;
