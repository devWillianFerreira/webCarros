import { createContext, ReactNode, useEffect, useState } from "react";
import { supabase } from "../services/supabaseConnection";
import { Session, User } from "@supabase/supabase-js";

type AuthContextData = {
  signed: boolean;
  LoadingAuth: boolean;
};
interface authProvideProps {
  children: ReactNode;
}
interface userProps {
  uid: string;
  name: string | null;
  email: string | null;
}

export const authContext = createContext({} as AuthContextData);

function AuthProvider({ children }: authProvideProps) {
  const [user, setUser] = useState<User | null>(null);
  const [LoadingAuth, setLoadingAuth] = useState(true);
  useEffect(() => {
    // Atualiza o estado quando ocorrer uma mudança na autenticação
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        setUser(session.user); // Salva os dados do usuário no estado
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
  return (
    <authContext.Provider value={{ signed: !!user, LoadingAuth }}>
      {children}
    </authContext.Provider>
  );
}

export default AuthProvider;
