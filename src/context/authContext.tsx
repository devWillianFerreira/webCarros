import { createContext, ReactNode, useEffect, useState } from "react";
import { supabase } from "../services/supabaseConnection";

type AuthContextData = {
  signed: boolean;
  LoadingAuth: boolean;
  handleInfoUser: ({ id, name, email }: userProps) => void;
  user: userProps | null;
};
interface authProvideProps {
  children: ReactNode;
}

interface userProps {
  id: string;
  name: string;
  email: string;
}

export const authContext = createContext({} as AuthContextData);

function AuthProvider({ children }: authProvideProps) {
  const [user, setUser] = useState<userProps | null>(null);
  const [LoadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    // Atualiza o estado quando ocorrer uma mudança na autenticação
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        const userData: userProps = {
          id: session.user.id, // Obtém o ID do usuário
          name: session.user.user_metadata?.display_name || "Usuário Anônimo", // Obtém o nome do user_metadata ou define um padrão
          email: session.user.email || "", // Obtém o email do usuário
        };
        setUser(userData); // Salva os dados do usuário no estado
        setLoadingAuth(false);
      } else {
        setUser(null); // Reseta o estado caso o usuário saia
        setLoadingAuth(false);
      }
    });

    // Limpeza: cancelar a inscrição no listener ao desmontar o componente
    return () => {
      data.subscription.unsubscribe();
    };
  }, []);

  function handleInfoUser({ id, name, email }: userProps) {
    setUser({
      name,
      email,
      id,
    });
  }
  return (
    <authContext.Provider
      value={{ signed: !!user, LoadingAuth, user, handleInfoUser }}
    >
      {children}
    </authContext.Provider>
  );
}

export default AuthProvider;
