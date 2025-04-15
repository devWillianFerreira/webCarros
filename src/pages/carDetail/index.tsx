import { useParams } from "react-router-dom";
import Container from "../../components/container";
import { useEffect, useState } from "react";
import { supabase } from "../../services/supabaseConnection";
import { Phone } from "lucide-react";
import Slider from "react-slick";

interface carProps {
  id: string;
  name: string;
  year: string;
  model: string;
  km: string;
  price: string | number;
  city: string;
  description: string;
  whatsapp: string;
  images: imageCarsProps[];
  uidUser: string;
  created: string;
  owner: string;
}
interface imageCarsProps {
  uid: string;
  name: string;
  url: string;
}

const CarDetail = () => {
  const { id } = useParams();
  const [car, setCar] = useState<carProps>();
  const [slidesPerView, setSlidesPerView] = useState<number>(2);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    async function loadCar() {
      try {
        //Buscando carro pelo id
        // .single() significa que será retornado apenas uma linha da tabela
        const { data, error } = await supabase
          .from("car")
          .select("*")
          .eq("id", id)
          .single();
        if (error) {
          console.error("Erro na Busca: ", error);
          return;
        }
        setCar({
          id: data.id,
          city: data.city,
          name: data.name,
          model: data.model,
          km: data.km,
          year: data.year,
          price: data.price,
          description: data.description,
          whatsapp: data.whatsapp,
          uidUser: data.uidUser,
          owner: data.owner,
          created: data.created,
          images: data.images,
        });
      } catch (error) {
        console.log(error);
      }
    }
    loadCar();
  }, []);

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth < 720) {
        setIsMobile(window.innerWidth < 720);
        setSlidesPerView(1);
      } else {
        setIsMobile(false);
        setSlidesPerView(2);
      }
    }
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  const CustomPrevArrow = (props: any) => {
    const { className, style, onClick } = props;

    return (
      <div
        className={className}
        style={{
          ...style,
          background: isMobile ? "none" : "red",
          color: "white",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "50px",
          height: "50px",
          borderRadius: "100%",
          zIndex: 10, // Garante que o botão fique acima das imagens
          left: isMobile ? "0px" : "15px",
        }}
        onClick={onClick}
      />
    );
  };
  const CustomNextArrow = (props: any) => {
    const { className, style, onClick } = props;

    return (
      <div
        className={className}
        style={{
          ...style,
          background: isMobile ? "none" : "red",
          color: "white",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "50px",
          height: "50px",
          borderRadius: "50%",
          zIndex: 10, // Garante que o botão fique acima das imagens
          right: isMobile ? "0px" : "15px",
        }}
        onClick={onClick}
      />
    );
  };

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: slidesPerView,
    slidesToScroll: 1,

    nextArrow: <CustomNextArrow />,
    prevArrow: <CustomPrevArrow />,
  };
  return (
    <Container>
      <Slider key={`slider-${slidesPerView}`} {...settings} className="mb-6">
        {car?.images.map((image) => (
          <img
            src={image.url}
            className="w-full h-96 relative"
            key={image.name}
            onLoad={() => console.log("Carregada")}
          />
        ))}
      </Slider>
      {car && (
        <main className="w-full bg-white rounded-lg p-6 my-4">
          <div className="flex flex-col items-center   sm:flex-row mb-4 justify-between font-bold text-3xl text-black ">
            <h1>{car?.name}</h1>
            <h1>R$ {car?.price}</h1>
          </div>
          <p>{car?.model}</p>
          <div className="flex w-full gap-6 my-4">
            <div className="flex flex-col gap-4">
              <div>
                <p>Cidade</p>
                <strong>{car?.city}</strong>
              </div>
              <div>
                <p>Ano</p>
                <strong>{car?.year}</strong>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div>
                <p>Km</p>
                <strong>{car?.km}</strong>
              </div>
            </div>
          </div>
          <strong>Descrição:</strong>
          <p className="mb-4">{car?.description}</p>
          <strong>Telefone:</strong>
          <p>{car?.whatsapp}</p>
          <a
            className="w-full bg-green-500 text-white flex items-center justify-center rounded-lg gap-2 my-6 h-11 text-xl font-medium cursor-pointer"
            href={`https://api.whatsapp.com/send?phone=${car.whatsapp}&text=Olá, vi o anúncio do ${car.name} no WebCarros e fiquei interessado. Gostaria de mais informações sobre o veículo e detalhes de pagamento. Aguardo sua resposta. Obrigado!" `}
            target="_blank"
          >
            <Phone color="white" />
            Enviar mensagem ao vendedor
          </a>
        </main>
      )}
    </Container>
  );
};

export default CarDetail;
