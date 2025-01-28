import Image from "next/image";

type Color = {
  name: string;
  imageUrl: string;
};

type Capacity = {
  size: string;
};

type iPhone = {
  id: number;
  model: string;
  colors: Color[];
  capacities: Capacity[];
};

const fetchIphones = async (): Promise<iPhone[]> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/iphones`,
    {
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error("Failed to fetch iPhones");
  }

  const data = await response.json();
  return data.iphones;
};

const iPhonesPage = async () => {
  try {
    const iphones = await fetchIphones();

    return (
      <div className="py-[100px] px-4 bg-custom-bg-4 text-white">
        <h1 className="text-2xl font-bold text-center mb-4">iPhones</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {iphones.map((iphone) => (
            <div key={iphone.id} className="border rounded p-4 shadow">
              <h2 className="font-bold text-lg">{iphone.model}</h2>
              <div className="mt-2">
                <h3 className="font-medium">Colors:</h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  {iphone.colors.map((color, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <Image
                        src={color.imageUrl}
                        alt={color.name}
                        width={100}
                        height={100}
                        className="rounded"
                      />
                      <p className="text-sm">{color.name}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-2">
                <h3 className="font-medium">Capacities:</h3>
                <ul>
                  {iphone.capacities.map((capacity, index) => (
                    <li key={index}>{capacity.size}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  } catch (error) {
    // Converte o erro para uma mensagem legível
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";

    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">iPhones</h1>
        <p className="text-red-500">Failed to load iPhones: {errorMessage}</p>
      </div>
    );
  }
};

export default iPhonesPage;
