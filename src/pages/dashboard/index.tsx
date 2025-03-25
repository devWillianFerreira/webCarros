import { useContext, useEffect, useState } from "react";
import Container from "../../components/container";
import DashboardHeader from "../../components/panelHeader";
import { supabase } from "../../services/supabaseConnection";
import { authContext } from "../../context/authContext";
import { Trash2 } from "lucide-react";

const Dashboard = () => {
  interface carsProps {
    id: string;
    name: string;
    year: string;
    model: string;
    km: string;
    price: string;
    city: string;
    images: imageCarsProps[];
    uidUser: string;
  }

  interface imageCarsProps {
    uid: string;
    name: string;
    url: string;
  }

  const [cars, setCars] = useState<carsProps[]>([]);
  const [loadImagesCar, setLoadImagesCar] = useState<string[]>([]);
  const { user } = useContext(authContext);

  useEffect(() => {
    async function fetchCars() {
      const { data } = await supabase
        .from("car")
        .select("*")
        .eq("uidUser", user?.id);

      // Definindo as propriedas que serão salvas em uma nova const
      const newCar: carsProps[] =
        data?.map((car) => ({
          id: car.id,
          name: car.name,
          model: car.model,
          year: car.year,
          km: car.km,
          price: car.price,
          city: car.city,
          uidUser: car.uidUser,
          images: car.images.map((imagesCar: any) => ({
            uid: imagesCar.uid,
            name: imagesCar.name,
            url: imagesCar.url,
          })),
        })) || [];
      setCars(newCar);
    }
    fetchCars();
  }, []);

  async function handleDeleteCar(itemCar: carsProps) {
    await supabase.from("car").delete().eq("id", itemCar.id);
    itemCar.images.map(async (images) => {
      const imagePath = `${images.uid}/${images.name}`;
      try {
        await supabase.storage.from("images").remove([imagePath]);
        setCars(cars.filter((car) => car.id != itemCar.id));
      } catch (error) {
        console.log(error);
      }
    });
  }

  function handleImagesLoad(id: string) {
    setLoadImagesCar((images) => [...images, id]);
  }
  return (
    <Container>
      <DashboardHeader />
      <main className="grid grid-cols-1  gap-6 md:grid-cols-2  lg:grid-cols-3">
        {cars.map((item) => (
          <section
            className="w-full relative bg-white rounded-lg"
            key={item.id}
          >
            <button
              className="absolute bg-white rounded-full flex items-center justify-center w-12 h-12 right-2 top-2 drop-shadow cursor-pointer "
              onClick={() => handleDeleteCar(item)}
            >
              <Trash2 size={20} />
            </button>
            <div
              className="w-full h-72 rounded-lg bg-slate-300"
              style={{
                display: loadImagesCar.includes(item.id) ? "none" : "block",
              }}
            ></div>

            <img
              src={item.images[0].url}
              alt="Carro"
              className="w-full max-h-72 mb-2 rounded-lg"
              onLoad={() => handleImagesLoad(item.id)}
              style={{
                display: loadImagesCar.includes(item.id) ? "block" : "none",
              }}
            />
            <p className="font-bold mt-1 mb-2 px-2">{item.name}</p>
            <div className="flex flex-col px-2">
              <span className="text-zinc-700 mb-6">
                Ano {item.year} | {item.km} KM
              </span>
              <strong className="text-black text-xl">R$ {item.price}</strong>
            </div>
            <div className="w-full h-px bg-slate-200 my-2"></div>
            <div className="px-2 pb-2 ">
              <span className="text-zinc-700">{item.city}</span>
            </div>
          </section>
        ))}
      </main>
    </Container>
  );
};

export default Dashboard;
