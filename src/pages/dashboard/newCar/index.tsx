import {Upload } from "lucide-react";
import DashboardHeader from "../../../components/panelHeader";
import Container from "../../../components/container";

const NewCar = () => {
  return (
    <Container>
      <div>
      <DashboardHeader />
      <div className="w-full bg-white p-3 rounded-lg flex flex-col sm:flex-row items-center gap-2">
        <button className="border-2 w-48 rounded-lg flex items-center justify-center cursor-pointer border-gay-600 h-32 md:w-48">
          <div className="absolute cursor-pointer">
            <Upload size={30} color="#000"/>
          </div>
          <div className="cursor-pointer">
            <input type="file" accept="image/" className="opacity-0 cursor-pointer"/>
          </div>
        </button>
      </div>
    </div>
    <div className="w-full bg-white p-3 rounded-lg flex flex-col sm:flex-row items-center gap-2 mt-2">

    </div>
    </Container>
  );
};

export default NewCar;
