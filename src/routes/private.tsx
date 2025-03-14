import { ReactNode, useContext } from "react";
import { authContext } from "../context/authContext";
import { Navigate } from "react-router-dom";

interface privateProps {
  children: ReactNode;
}

const Private = ({ children }: privateProps) => {
  const { signed, LoadingAuth } = useContext(authContext);
  if (LoadingAuth) {
    return (
      <div className="h-screen w-full flex justify-center items-center">
        <p className="font-semibold text-2xl">Carregando...</p>
      </div>
    );
  }
  if (!signed) {
    return <Navigate to="/login" />;
  }
  return <div>{children}</div>;
};

export default Private;
