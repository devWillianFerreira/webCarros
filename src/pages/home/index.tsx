import Container from "../../components/container";

const Home = () => {
  return (
    <Container>
      <section className="max-w-3xl w-full bg-white mx-auto flex p-4 rounded-lg justify-center items-center gap-2">
        <input
          placeholder="Digite o nome do Carro"
          className="w-full border-1 border-gray-200 rounded-lg h-9 px-3 outline-none"
        />
        <button className="bg-red-500 h-9 px-8 rounded-lg text-white font-medium ">
          Buscar
        </button>
      </section>
      <h1 className="text-center font-bold mt-6 text-2xl mb-4">
        Carros novos e usados em todo o Brasil
      </h1>
      <main className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <section className="w-full bg-white rounded-lg">
          <img
            src="https://image.webmotors.com.br/_fotos/anunciousados/gigante/2025/202501/20250124/audi-q5-2.0-55-tfsie-phev-performance-quattro-s-tronic-wmimagem21402243326.jpg?s=fill&w=552&h=414&q=60"
            alt="Carro"
            className="w-full max-h-72 mb-2 rounded-lg hover:scale-105 transition-all"
          />
          <p className="font-bold mt-1 mb-2 px-2">JAGUAR F-PACE</p>
          <div className="flex flex-col px-2">
            <span className="text-zinc-700 mb-6">
              Ano 2016/2017 | 25.000 Km
            </span>
            <strong className="text-black text-xl">R$ 230.00,00</strong>
          </div>
          <div className="w-full h-px bg-slate-200 my-2"></div>
          <div className="px-2 pb-2 ">
            <span className="text-zinc-700">Mauá - São Paulo</span>
          </div>
        </section>
      </main>
    </Container>
  );
};

export default Home;
