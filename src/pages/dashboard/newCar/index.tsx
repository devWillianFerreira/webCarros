import { Trash, Upload } from "lucide-react";
import DashboardHeader from "../../../components/panelHeader";
import Container from "../../../components/container";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "../../../components/input";
import { ChangeEvent, useContext, useState } from "react";
import { authContext } from "../../../context/authContext";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "../../../services/supabaseConnection";

const schema = z.object({
  name: z.string().nonempty("O nome é obrigatório").toUpperCase(),
  model: z.string().nonempty("O modelo é obrigatório"),
  year: z.string().nonempty("O ano é obrigatório"),
  km: z.string().nonempty("O km é obrigatório"),
  price: z.string().nonempty("O preço é obrigatório"),
  city: z.string().nonempty("A cidade é obrigatório"),
  whatsapp: z
    .string()
    .min(1, "O telefone é obrigatório")
    .refine((value) => /^(\d{11,12})$/.test(value), {
      message: "Número de telefone inválido",
    }),
  description: z.string().nonempty("A descrição é obrigatória"),
});

type formData = z.infer<typeof schema>;

const NewCar = () => {
  const { user } = useContext(authContext);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<formData>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });
  interface carImageProps {
    uid: string;
    name: string;
    previewUrl: string;
    url: string;
  }
  const [carImages, setCarImage] = useState<carImageProps[]>([]);

  async function handleFile(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      const image = e.target.files[0];
      if (image.type === "image/jpeg" || image.type === "image/png") {
        await handleUploadFile(image);
      } else {
        alert("Envie uma imagem jpeg ou png");
      }
    }
  }

  async function handleUploadFile(image: File) {
    if (!user?.id) {
      console.error("Usuário não autenticado!");
      return;
    }

    const currentId = user.id;
    const uidImage = uuidv4();
    const filePath = `${currentId}/${uidImage}`;

    await supabase.storage
      .from("images")
      .upload(filePath, image, {
        upsert: false,
      })
      .then(() => {
        const urlImage = supabase.storage.from("images").getPublicUrl(filePath);
        const imageItem = {
          name: uidImage,
          uid: currentId,
          previewUrl: URL.createObjectURL(image),
          url: urlImage.data.publicUrl,
        };
        setCarImage((images) => [...images, imageItem]);
      });
  }

  async function handleDeleteImage(item: carImageProps) {
    const userId = user?.id;

    const uidImage = item.uid;
    const filePath = `${userId}/${uidImage}`;
    await supabase.storage.from("images").remove([filePath]);
    setCarImage(
      carImages.filter((image) => image.previewUrl != item.previewUrl)
    );
  }

  async function onSubmit(data: formData) {
    //Verificando se possui alguma imagem no
    if (carImages.length === 0) {
      alert("Imagens são obrigatórias para cadastro de um carro");
      return;
    }

    const carListImage = carImages.map((car) => {
      return {
        uid: car.uid,
        name: car.name,
        url: car.url,
      };
    });
    const newCar = {
      id: uuidv4(),
      ...data,
      owner: user?.name,
      uidUser: user?.id,
      images: carListImage,
    };
    try {
      const { error } = await supabase.from("car").insert(newCar);

      if (error) {
        console.error("Erro ao cadastrar o carro:", error.message);
        alert("Erro ao cadastrar o carro!");
      } else {
        reset();
        alert("Carro cadastrado com sucesso!");
        setCarImage([]);
      }
    } catch (error) {
      console.error("Erro inesperado:", error);
      alert("Erro inesperado ao cadastrar o carro!");
    }
  }

  return (
    <Container>
      <div>
        <DashboardHeader />
        <div className="w-full bg-white p-3 rounded-lg flex flex-col sm:flex-row items-center gap-2">
          <button className="border-2 w-48 rounded-lg flex items-center justify-center cursor-pointer border-gay-600 h-32 md:w-48">
            <div className="absolute cursor-pointer">
              <Upload size={30} color="#000" />
            </div>
            <div className="cursor-pointer">
              <input
                type="file"
                accept="image/"
                className="opacity-0 cursor-pointer"
                onChange={handleFile}
              />
            </div>
          </button>
          {carImages.map((item) => (
            <div
              key={item.name}
              className="w-full h-32 flex justify-center items-center relative"
            >
              <button
                className="absolute cursor-pointer"
                onClick={() => handleDeleteImage(item)}
              >
                <Trash size={28} color="white" />
              </button>
              <img
                src={item.previewUrl}
                className="rounded-lg w-full h-32 object-cover"
              />
            </div>
          ))}
        </div>
      </div>
      <div className="w-full bg-white p-3 rounded-lg flex flex-col sm:flex-row items-center gap-2 mt-2">
        <form onSubmit={handleSubmit(onSubmit)} className="w-full">
          <div className="mb-3">
            <p className="mb-2 font-medium">Nome do carro</p>
            <Input
              name="name"
              type="text"
              register={register}
              placeholder="Onix Cinza "
              error={errors.name?.message}
            />
          </div>
          <div className="mb-3">
            <p className="mb-2 font-medium">Modelo</p>
            <Input
              name="model"
              type="text"
              register={register}
              placeholder="Onix 1.4"
              error={errors.model?.message}
            />
          </div>
          <div className="flex flex-row w-full gap-4 justify-center items-center">
            <div className="mb-3 w-full">
              <p className="mb-2 font-medium">Ano</p>
              <Input
                name="year"
                type="text"
                register={register}
                placeholder="2015/2016"
                error={errors.year?.message}
              />
            </div>
            <div className="mb-3 w-full">
              <p className="mb-2 font-medium">KM rodados</p>
              <Input
                name="km"
                type="text"
                register={register}
                placeholder="20.460"
                error={errors.km?.message}
              />
            </div>
          </div>
          <div className="flex flex-row w-full gap-4 justify-center items-center">
            <div className="mb-3 w-full">
              <p className="mb-2 font-medium">Telefone/Whatsapp</p>
              <Input
                name="whatsapp"
                type="text"
                register={register}
                placeholder="(11) 94569-0834"
                error={errors.whatsapp?.message}
              />
            </div>
            <div className="mb-3 w-full">
              <p className="mb-2 font-medium">Cidade</p>
              <Input
                name="city"
                type="text"
                register={register}
                placeholder="São Gonçalo do Rio Preto"
                error={errors.city?.message}
              />
            </div>
          </div>
          <div className="mb-3 w-full">
            <p className="mb-2 font-medium">Preço</p>
            <Input
              name="price"
              type="text"
              register={register}
              placeholder="R$ 70.000,00"
              error={errors.price?.message}
            />
          </div>
          <div className="mb-3 w-full">
            <p className="mb-2 font-medium">Descrição</p>
            <textarea
              className="border-2 border-gray-200 rounded-lg w-full h-24 px-2"
              {...register("description")}
              name="description"
              id="description"
              placeholder="O Chevrolet Onix 1.4 é um carro com motor de 4 cilindros em linha, que pode utilizar gasolina ou etanol... "
            />
            {errors.description && (
              <p className="text-red-600 mb-1">{errors.description.message}</p>
            )}
          </div>
          <button
            type="submit"
            className="bg-zinc-900 text-white w-full h-11 rounded-md cursor-pointer"
          >
            Cadastrar
          </button>
        </form>
      </div>
    </Container>
  );
};

export default NewCar;
