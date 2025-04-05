import { useEffect, useState } from "react";
import Container from "../../components/container";
import { supabase } from "../../services/supabaseConnection";
import { Link } from "react-router-dom";

const Home = () => {
  interface carsProps {
    id: string;
    name: string;
    year: string;
    model: string;
    km: string;
    price: string;
    city: string;
    images: imageCarsProps[];
  }

  interface imageCarsProps {
    uid: string;
    name: string;
    url: string;
  }

  const [cars, setCars] = useState<carsProps[]>([]);
  const [loadImagesCar, setLoadImagesCar] = useState<string[]>([]);
  const [inputCar, setInputCar] = useState("");

  async function fetchCars() {
    // Recebendo todos os items da tabela car, do database
    const { data } = await supabase.from("car").select("*");
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
        images: car.images.map((imagesCar: any) => ({
          uid: imagesCar.uid,
          name: imagesCar.name,
          url: imagesCar.url,
        })),
      })) || [];
    setCars(newCar);
  }

  useEffect(() => {
    fetchCars();
  }, []);
  function handleImagesLoad(id: string) {
    setLoadImagesCar((images) => [...images, id]);
  }

  async function searchCar(input: string) {
    if (input && input.trim() !== "") {
      const { data } = await supabase
        .from("car")
        .select()
        .ilike("name", `%${input}%`);
      const cars: carsProps[] =
        data?.map((car) => ({
          id: car.id,
          name: car.name,
          model: car.model,
          year: car.year,
          km: car.km,
          price: car.price,
          city: car.city,
          images: car.images.map((imagesCar: any) => ({
            uid: imagesCar.uid,
            name: imagesCar.name,
            url: imagesCar.url,
          })),
        })) || [];

      setCars(cars);
    } else {
      fetchCars();
    }
  }
  return (
    <Container>
      <section className="max-w-3xl w-full bg-white mx-auto flex p-4 rounded-lg justify-center items-center gap-2">
        <input
          placeholder="Digite o nome do Carro"
          className="w-full border-1 border-gray-200 rounded-lg h-9 px-3 outline-none"
          value={inputCar}
          onChange={(e) => setInputCar(e.target.value)}
        />
        <button
          className="bg-red-500 h-9 px-8 rounded-lg text-white font-medium cursor-pointer"
          onClick={() => searchCar(inputCar)}
        >
          Buscar
        </button>
      </section>
      <h1 className="text-center font-bold mt-6 text-2xl mb-4">
        Carros novos e usados em todo o Brasil
      </h1>
      {cars && cars.length > 0 ? (
        <main className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {cars.map((item) => (
            <Link key={item.id} to={`/carDetail/${item.id}`}>
              <section className="w-full bg-white rounded-lg">
                <div
                  className="w-full h-72 rounded-lg bg-slate-300"
                  style={{
                    display: loadImagesCar.includes(item.id) ? "none" : "block",
                  }}
                ></div>
                <img
                  src={item.images[0].url}
                  alt="Carro"
                  className="w-full max-h-72 mb-2 rounded-lg hover:scale-105 transition-all"
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
                  <strong className="text-black text-xl">
                    R$ {item.price}
                  </strong>
                </div>
                <div className="w-full h-px bg-slate-200 my-2"></div>
                <div className="px-2 pb-2 ">
                  <span className="text-zinc-700">{item.city}</span>
                </div>
              </section>
            </Link>
          ))}
        </main>
      ) : (
        <div className="flex justify-center items-center mt-15">
          <h1 className="font-semibold md:text-2xl">
            {" "}
            Nenhum carro no momento. Por favor, tente novamente mais tarde!{" "}
          </h1>
        </div>
      )}
    </Container>
  );
};

export default Home;
