/* eslint-disable @typescript-eslint/no-unused-vars */
import Container from "../../components/container";
import logoImg from "../../assets/logo.svg";
import { Link, useNavigate } from "react-router-dom";
import Input from "../../components/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "../../services/supabaseConnection";

// Criando validação com zod
const schema = z.object({
  email: z
    .string()
    .email("Insira um Email Válido")
    .nonempty("O campo email é obrigatório"),
  password: z.string().nonempty("O campo Senha é obrigatório"),
});

type FormData = z.infer<typeof schema>;

const Login = () => {
  const navigate = useNavigate();
  async function onSubmit(data: FormData) {
    try {
      // Recebendo as informações do usuário e colocando no data
      const { data: signInData, error } =
        await supabase.auth.signInWithPassword({
          email: data.email,
          password: data.password,
        });

      if (error) {
        // Exibe mensagem de erro caso algo dê errado
        console.error("Erro na autenticação:", error.message);
        alert(
          "Falha na autenticação. Verifique suas credenciais e tente novamente."
        );
        return;
      }

      if (signInData.user) {
        // Redireciona o usuário para o dashboard somente se ele foi autenticado com sucesso
        navigate("/dashboard", { replace: true });
      }
    } catch {
      alert("Ocorreu um erro inesperado. Tente novamente mais tarde.");
    }
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });
  return (
    <Container>
      <div className="flex justify-center items-center flex-col min-h-screen gap-4 w-full">
        <Link to="/" className="max-w-sm w-full mb-6">
          <img src={logoImg} className="w-full" />
        </Link>
        <form
          className="bg-white max-w-xl w-full p-4 rounded-lg"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Input
            name="email"
            placeholder="Digite o seu email"
            type="email"
            error={errors.email?.message}
            register={register}
          />
          <Input
            name="password"
            placeholder="Digite a sua senha"
            type="password"
            error={errors.password?.message}
            register={register}
          />
          <button
            type="submit"
            className="bg-zinc-900 text-white w-full h-11 rounded-md cursor-pointer"
          >
            Acessar
          </button>
        </form>
        <span>
          Ainda não possui uma conta?{" "}
          <Link to="/register" className="font-medium ">
            Cadastre-se
          </Link>
        </span>
      </div>
    </Container>
  );
};

export default Login;
