
import Container from "../../components/container";
import logoImg from "../../assets/logo.svg";
import { Link, useNavigate } from "react-router-dom";
import Input from "../../components/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "../../services/supabaseConnection";
import { useContext } from "react";
import { authContext } from "../../context/authContext";

// Criando validação com zod
const schema = z.object({
  name: z.string().nonempty("O campo nome é obrigatório"),
  email: z
    .string()
    .email("Insira um Email Válido")
    .nonempty("O campo email é obrigatório"),
  password: z.string().nonempty("O campo Senha é obrigatório"),
});

type FormData = z.infer<typeof schema>;



const Register = () => {
  const {handleInfoUser}= useContext(authContext)
  const navigate = useNavigate();

  async function onSubmit(data: FormData) {
    await supabase.auth
      .signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            display_name: data.name,
          },
        },
      })
      .then(({ data: { user }, error }) => {
        if (error) {
          console.error("Erro ao cadastrar:", error);
          return;
        }
  
        if (user) {
          handleInfoUser({
            name: data.name,
            email: data.email,
            id: user.id, // Obtém o UID corretamente
          });
          navigate("/dashboard", { replace: true });
        }
      })
      .catch((error) => {
        console.log(error);
      });
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
            name="name"
            placeholder="Digite o seu nome completo"
            type="text"
            error={errors.name?.message}
            register={register}
          />
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
            Cadastrar
          </button>
        </form>
        <span>
          Já possui uma conta?{" "}
          <Link to="/login" className="font-medium ">
            Faça login
          </Link>
        </span>
      </div>
    </Container>
  );
};

export default Register;
