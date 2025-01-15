import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const iphones = [
    {
      model: "iPhone 11",
      colors: [
        { name: "Black", imageUrl: "/images/iphone/iphone-11-black.png" },
        { name: "Green", imageUrl: "/images/iphone/iphone-11-green.png" },
        { name: "Yellow", imageUrl: "/images/iphone/iphone-11-yellow.png" },
        { name: "Purple", imageUrl: "/images/iphone/iphone-11-purple.png" },
        { name: "White", imageUrl: "/images/iphone/iphone-11-white.png" },
        { name: "Red", imageUrl: "/images/iphone/iphone-11-red.png" },
      ],
      capacities: [{ size: "64GB" }, { size: "128GB" }],
    },
    {
      model: "iPhone 11 Pro",
      colors: [
        { name: "Silver", imageUrl: "/images/iphone/iphone-11-pro-silver.png" },
        {
          name: "Space Gray",
          imageUrl: "/images/iphone/iphone-11-pro-space-gray.png",
        },
        { name: "Gold", imageUrl: "/images/iphone/iphone-11-pro-gold.png" },
        {
          name: "Midnight Green",
          imageUrl: "/images/iphone/iphone-11-pro-midnight-green.png",
        },
      ],
      capacities: [{ size: "64GB" }, { size: "256GB" }, { size: "512GB" }],
    },
    {
      model: "iPhone 11 Pro Max",
      colors: [
        {
          name: "Silver",
          imageUrl: "/images/iphone/iphone-11-pro-max-silver.png",
        },
        {
          name: "Space Gray",
          imageUrl: "/images/iphone/iphone-11-pro-max-space-gray.png",
        },
        { name: "Gold", imageUrl: "/images/iphone/iphone-11-pro-max-gold.png" },
        {
          name: "Midnight Green",
          imageUrl: "/images/iphone/iphone-11-pro-max-midnight-green.png",
        },
      ],
      capacities: [{ size: "64GB" }, { size: "256GB" }, { size: "512GB" }],
    },
    {
      model: "iPhone SE (2nd Generation)",
      colors: [
        {
          name: "Black",
          imageUrl: "/images/iphone/iphone-se-2nd-gen-black.png",
        },
        {
          name: "White",
          imageUrl: "/images/iphone/iphone-se-2nd-gen-white.png",
        },
        { name: "Red", imageUrl: "/images/iphone/iphone-se-2nd-gen-red.png" },
      ],
      capacities: [{ size: "64GB" }, { size: "128GB" }],
    },
    {
      model: "iPhone SE (3rd Generation)",
      colors: [
        {
          name: "Midnight",
          imageUrl: "/images/iphone/iphone-se-3rd-gen-midnight.png",
        },
        {
          name: "Starlight",
          imageUrl: "/images/iphone/iphone-se-3rd-gen-starlight.png",
        },
        { name: "Red", imageUrl: "/images/iphone/iphone-se-3rd-gen-red.png" },
      ],
      capacities: [{ size: "64GB" }, { size: "128GB" }, { size: "256GB" }],
    },
    {
      model: "iPhone 12",
      colors: [
        { name: "Black", imageUrl: "/images/iphone/iphone-12-black.png" },
        { name: "White", imageUrl: "/images/iphone/iphone-12-white.png" },
        { name: "Red", imageUrl: "/images/iphone/iphone-12-red.png" },
        { name: "Green", imageUrl: "/images/iphone/iphone-12-green.png" },
        { name: "Blue", imageUrl: "/images/iphone/iphone-12-blue.png" },
        { name: "Purple", imageUrl: "/images/iphone/iphone-12-purple.png" },
      ],
      capacities: [{ size: "64GB" }, { size: "128GB" }, { size: "256GB" }],
    },
    {
      model: "iPhone 12 Mini",
      colors: [
        { name: "Black", imageUrl: "/images/iphone/iphone-12-mini-black.png" },
        { name: "White", imageUrl: "/images/iphone/iphone-12-mini-white.png" },
        { name: "Red", imageUrl: "/images/iphone/iphone-12-mini-red.png" },
        { name: "Green", imageUrl: "/images/iphone/iphone-12-mini-green.png" },
        { name: "Blue", imageUrl: "/images/iphone/iphone-12-mini-blue.png" },
        {
          name: "Purple",
          imageUrl: "/images/iphone/iphone-12-mini-purple.png",
        },
      ],
      capacities: [{ size: "64GB" }, { size: "128GB" }, { size: "256GB" }],
    },
    {
      model: "iPhone 12 Pro",
      colors: [
        { name: "Silver", imageUrl: "/images/iphone/iphone-12-pro-silver.png" },
        {
          name: "Graphite",
          imageUrl: "/images/iphone/iphone-12-pro-graphite.png",
        },
        { name: "Gold", imageUrl: "/images/iphone/iphone-12-pro-gold.png" },
        {
          name: "Pacific Blue",
          imageUrl: "/images/iphone/iphone-12-pro-pacific-blue.png",
        },
      ],
      capacities: [{ size: "128GB" }, { size: "256GB" }, { size: "512GB" }],
    },
    {
      model: "iPhone 12 Pro Max",
      colors: [
        {
          name: "Silver",
          imageUrl: "/images/iphone/iphone-12-pro-max-silver.png",
        },
        {
          name: "Graphite",
          imageUrl: "/images/iphone/iphone-12-pro-max-graphite.png",
        },
        { name: "Gold", imageUrl: "/images/iphone/iphone-12-pro-max-gold.png" },
        {
          name: "Pacific Blue",
          imageUrl: "/images/iphone/iphone-12-pro-max-pacific-blue.png",
        },
      ],
      capacities: [{ size: "128GB" }, { size: "256GB" }, { size: "512GB" }],
    },
    {
      model: "iPhone 13",
      colors: [
        { name: "Midnight", imageUrl: "/images/iphone/iphone-13-midnight.png" },
        {
          name: "Starlight",
          imageUrl: "/images/iphone/iphone-13-starlight.png",
        },
        { name: "Blue", imageUrl: "/images/iphone/iphone-13-blue.png" },
        { name: "Pink", imageUrl: "/images/iphone/iphone-13-pink.png" },
        { name: "Green", imageUrl: "/images/iphone/iphone-13-green.png" },
        { name: "Red", imageUrl: "/images/iphone/iphone-13-red.png" },
      ],
      capacities: [{ size: "128GB" }, { size: "256GB" }, { size: "512GB" }],
    },
    {
      model: "iPhone 13 Mini",
      colors: [
        {
          name: "Midnight",
          imageUrl: "/images/iphone/iphone-13-mini-midnight.png",
        },
        {
          name: "Starlight",
          imageUrl: "/images/iphone/iphone-13-mini-starlight.png",
        },
        { name: "Blue", imageUrl: "/images/iphone/iphone-13-mini-blue.png" },
        { name: "Pink", imageUrl: "/images/iphone/iphone-13-mini-pink.png" },
        { name: "Green", imageUrl: "/images/iphone/iphone-13-mini-green.png" },
        { name: "Red", imageUrl: "/images/iphone/iphone-13-mini-red.png" },
      ],
      capacities: [{ size: "128GB" }, { size: "256GB" }, { size: "512GB" }],
    },
    {
      model: "iPhone 13 Pro",
      colors: [
        {
          name: "Graphite",
          imageUrl: "/images/iphone/iphone-13-pro-graphite.png",
        },
        { name: "Gold", imageUrl: "/images/iphone/iphone-13-pro-gold.png" },
        { name: "Silver", imageUrl: "/images/iphone/iphone-13-pro-silver.png" },
        {
          name: "Sierra Blue",
          imageUrl: "/images/iphone/iphone-13-pro-sierra-blue.png",
        },
        {
          name: "Alpine Green",
          imageUrl: "/images/iphone/iphone-13-pro-alpine-green.png",
        },
      ],
      capacities: [
        { size: "128GB" },
        { size: "256GB" },
        { size: "512GB" },
        { size: "1TB" },
      ],
    },
    {
      model: "iPhone 13 Pro Max",
      colors: [
        {
          name: "Graphite",
          imageUrl: "/images/iphone/iphone-13-pro-max-graphite.png",
        },
        { name: "Gold", imageUrl: "/images/iphone/iphone-13-pro-max-gold.png" },
        {
          name: "Silver",
          imageUrl: "/images/iphone/iphone-13-pro-max-silver.png",
        },
        {
          name: "Sierra Blue",
          imageUrl: "/images/iphone/iphone-13-pro-max-sierra-blue.png",
        },
        {
          name: "Alpine Green",
          imageUrl: "/images/iphone/iphone-13-pro-max-alpine-green.png",
        },
      ],
      capacities: [
        { size: "128GB" },
        { size: "256GB" },
        { size: "512GB" },
        { size: "1TB" },
      ],
    },
    {
      model: "iPhone 14",
      colors: [
        { name: "Midnight", imageUrl: "/images/iphone/iphone-14-midnight.png" },
        {
          name: "Starlight",
          imageUrl: "/images/iphone/iphone-14-starlight.png",
        },
        { name: "Blue", imageUrl: "/images/iphone/iphone-14-blue.png" },
        { name: "Purple", imageUrl: "/images/iphone/iphone-14-purple.png" },
        { name: "Red", imageUrl: "/images/iphone/iphone-14-red.png" },
        { name: "Yellow", imageUrl: "/images/iphone/iphone-14-yellow.png" },
      ],
      capacities: [{ size: "128GB" }, { size: "256GB" }, { size: "512GB" }],
    },
    {
      model: "iPhone 14 Plus",
      colors: [
        {
          name: "Midnight",
          imageUrl: "/images/iphone/iphone-14-plus-midnight.png",
        },
        {
          name: "Starlight",
          imageUrl: "/images/iphone/iphone-14-plus-starlight.png",
        },
        { name: "Blue", imageUrl: "/images/iphone/iphone-14-plus-blue.png" },
        {
          name: "Purple",
          imageUrl: "/images/iphone/iphone-14-plus-purple.png",
        },
        { name: "Red", imageUrl: "/images/iphone/iphone-14-plus-red.png" },
        {
          name: "Yellow",
          imageUrl: "/images/iphone/iphone-14-plus-yellow.png",
        },
      ],
      capacities: [{ size: "128GB" }, { size: "256GB" }, { size: "512GB" }],
    },
    {
      model: "iPhone 14 Pro",
      colors: [
        {
          name: "Space Black",
          imageUrl: "/images/iphone/iphone-14-pro-space-black.png",
        },
        { name: "Silver", imageUrl: "/images/iphone/iphone-14-pro-silver.png" },
        { name: "Gold", imageUrl: "/images/iphone/iphone-14-pro-gold.png" },
        {
          name: "Deep Purple",
          imageUrl: "/images/iphone/iphone-14-pro-deep-purple.png",
        },
      ],
      capacities: [
        { size: "128GB" },
        { size: "256GB" },
        { size: "512GB" },
        { size: "1TB" },
      ],
    },
    {
      model: "iPhone 14 Pro Max",
      colors: [
        {
          name: "Space Black",
          imageUrl: "/images/iphone/iphone-14-pro-max-space-black.png",
        },
        {
          name: "Silver",
          imageUrl: "/images/iphone/iphone-14-pro-max-silver.png",
        },
        { name: "Gold", imageUrl: "/images/iphone/iphone-14-pro-max-gold.png" },
        {
          name: "Deep Purple",
          imageUrl: "/images/iphone/iphone-14-pro-max-deep-purple.png",
        },
      ],
      capacities: [
        { size: "128GB" },
        { size: "256GB" },
        { size: "512GB" },
        { size: "1TB" },
      ],
    },
    {
      model: "iPhone 15",
      colors: [
        { name: "Black", imageUrl: "/images/iphone/iphone-15-black.png" },
        { name: "Blue", imageUrl: "/images/iphone/iphone-15-blue.png" },
        { name: "Green", imageUrl: "/images/iphone/iphone-15-green.png" },
        { name: "Yellow", imageUrl: "/images/iphone/iphone-15-yellow.png" },
        { name: "Pink", imageUrl: "/images/iphone/iphone-15-pink.png" },
      ],
      capacities: [{ size: "128GB" }, { size: "256GB" }, { size: "512GB" }],
    },
    {
      model: "iPhone 15 Plus",
      colors: [
        { name: "Black", imageUrl: "/images/iphone/iphone-15-plus-black.png" },
        { name: "Blue", imageUrl: "/images/iphone/iphone-15-plus-blue.png" },
        { name: "Green", imageUrl: "/images/iphone/iphone-15-plus-green.png" },
        {
          name: "Yellow",
          imageUrl: "/images/iphone/iphone-15-plus-yellow.png",
        },
        { name: "Pink", imageUrl: "/images/iphone/iphone-15-plus-pink.png" },
      ],
      capacities: [{ size: "128GB" }, { size: "256GB" }, { size: "512GB" }],
    },
    {
      model: "iPhone 15 Pro",
      colors: [
        {
          name: "Natural Titanium",
          imageUrl: "/images/iphone/iphone-15-pro-natural-titanium.png",
        },
        {
          name: "Blue Titanium",
          imageUrl: "/images/iphone/iphone-15-pro-blue-titanium.png",
        },
        {
          name: "White Titanium",
          imageUrl: "/images/iphone/iphone-15-pro-white-titanium.png",
        },
        {
          name: "Black Titanium",
          imageUrl: "/images/iphone/iphone-15-pro-black-titanium.png",
        },
      ],
      capacities: [
        { size: "128GB" },
        { size: "256GB" },
        { size: "512GB" },
        { size: "1TB" },
      ],
    },
    {
      model: "iPhone 15 Pro Max",
      colors: [
        {
          name: "Natural Titanium",
          imageUrl: "/images/iphone/iphone-15-pro-max-natural-titanium.png",
        },
        {
          name: "Blue Titanium",
          imageUrl: "/images/iphone/iphone-15-pro-max-blue-titanium.png",
        },
        {
          name: "White Titanium",
          imageUrl: "/images/iphone/iphone-15-pro-max-white-titanium.png",
        },
        {
          name: "Black Titanium",
          imageUrl: "/images/iphone/iphone-15-pro-max-black-titanium.png",
        },
      ],
      capacities: [{ size: "256GB" }, { size: "512GB" }, { size: "1TB" }],
    },
    {
      model: "iPhone 16",
      colors: [
        { name: "Black", imageUrl: "/images/iphone/iphone-16-black.png" },
        {
          name: "Ultramarine",
          imageUrl: "/images/iphone/iphone-16-ultramarine.png",
        },
        { name: "Teal", imageUrl: "/images/iphone/iphone-16-teal.png" },
        { name: "Pink", imageUrl: "/images/iphone/iphone-16-pink.png" },
        { name: "White", imageUrl: "/images/iphone/iphone-16-white.png" },
      ],
      capacities: [{ size: "128GB" }, { size: "256GB" }, { size: "512GB" }],
    },
    {
      model: "iPhone 16 Plus",
      colors: [
        { name: "Black", imageUrl: "/images/iphone/iphone-16-plus-black.png" },
        {
          name: "ultramarine",
          imageUrl: "/images/iphone/iphone-16-plus-ultramarine.png",
        },
        {
          name: "teal",
          imageUrl: "/images/iphone/iphone-16-plus-teal.png",
        },
        { name: "Pink", imageUrl: "/images/iphone/iphone-16-plus-pink.png" },
        { name: "White", imageUrl: "/images/iphone/iphone-16-plus-white.png" },
      ],
      capacities: [{ size: "128GB" }, { size: "256GB" }, { size: "512GB" }],
    },
    {
      model: "iPhone 16 Pro",
      colors: [
        {
          name: "Black Titanium ",
          imageUrl: "/images/iphone/iphone-16-pro-black-titanium.png",
        },
        {
          name: "White Titanium",
          imageUrl: "/images/iphone/iphone-16-pro-white-titanium.png",
        },
        {
          name: "Natural Titanium",
          imageUrl: "/images/iphone/iphone-16-pro-natural-titanium.png",
        },
        {
          name: "Desert Titanium",
          imageUrl: "/images/iphone/iphone-16-pro-desert-titanium.png",
        },
      ],
      capacities: [
        { size: "128GB" },
        { size: "256GB" },
        { size: "512GB" },
        { size: "1TB" },
      ],
    },
    {
      model: "iPhone 16 Pro Max",
      colors: [
        {
          name: "Black Titanium",
          imageUrl: "/images/iphone/iphone-16-pro-max-black-titanium.png",
        },
        {
          name: "White Titanium",
          imageUrl: "/images/iphone/iphone-16-pro-max-white-titanium.png",
        },
        {
          name: "Natural Titanium",
          imageUrl: "/images/iphone/iphone-16-pro-max-natural-titanium.png",
        },
        {
          name: "Desert Titanium",
          imageUrl: "/images/iphone/iphone-16-pro-max-desert-titanium.png",
        },
      ],
      capacities: [{ size: "256GB" }, { size: "512GB" }, { size: "1TB" }],
    },
  ];

  for (const iphone of iphones) {
    await prisma.iPhone.create({
      data: {
        model: iphone.model,
        colors: {
          create: iphone.colors,
        },
        capacities: {
          create: iphone.capacities.map((capacity) => ({
            size: capacity.size,
            conditions: {
              create: [
                {
                  conditionType: "Novo",
                  costPrice: 0,
                  sellingPrice: 0,
                  maxUpgradePrice: 0,
                },
                {
                  conditionType: "Seminovo",
                  costPrice: 0,
                  sellingPrice: 0,
                  maxUpgradePrice: 0,
                },
              ],
            },
          })),
        },
      },
    });
  }

  console.log("Todos os dados de iPhones foram inseridos com sucesso!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
