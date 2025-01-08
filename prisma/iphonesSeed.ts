import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const iphones = [
    {
      model: "iPhone 11",
      colors: [
        { name: "Black", imageUrl: "/images/iphone/iphone-11-black.jpg" },
        { name: "Green", imageUrl: "/images/iphone/iphone-11-green.jpg" },
        { name: "Yellow", imageUrl: "/images/iphone/iphone-11-yellow.jpg" },
        { name: "Purple", imageUrl: "/images/iphone/iphone-11-purple.jpg" },
        { name: "White", imageUrl: "/images/iphone/iphone-11-white.jpg" },
        { name: "Red", imageUrl: "/images/iphone/iphone-11-red.jpg" },
      ],
      capacities: [{ size: "64GB" }, { size: "128GB" }],
    },
    {
      model: "iPhone 11 Pro",
      colors: [
        { name: "Silver", imageUrl: "/images/iphone/iphone-11-pro-silver.jpg" },
        {
          name: "Space Gray",
          imageUrl: "/images/iphone/iphone-11-pro-space-gray.jpg",
        },
        { name: "Gold", imageUrl: "/images/iphone/iphone-11-pro-gold.jpg" },
        {
          name: "Midnight Green",
          imageUrl: "/images/iphone/iphone-11-pro-midnight-green.jpg",
        },
      ],
      capacities: [{ size: "64GB" }, { size: "256GB" }, { size: "512GB" }],
    },
    {
      model: "iPhone 11 Pro Max",
      colors: [
        {
          name: "Silver",
          imageUrl: "/images/iphone/iphone-11-pro-max-silver.jpg",
        },
        {
          name: "Space Gray",
          imageUrl: "/images/iphone/iphone-11-pro-max-space-gray.jpg",
        },
        { name: "Gold", imageUrl: "/images/iphone/iphone-11-pro-max-gold.jpg" },
        {
          name: "Midnight Green",
          imageUrl: "/images/iphone/iphone-11-pro-max-midnight-green.jpg",
        },
      ],
      capacities: [{ size: "64GB" }, { size: "256GB" }, { size: "512GB" }],
    },
    {
      model: "iPhone SE (2nd Generation)",
      colors: [
        {
          name: "Black",
          imageUrl: "/images/iphone/iphone-se-2nd-gen-black.jpg",
        },
        {
          name: "White",
          imageUrl: "/images/iphone/iphone-se-2nd-gen-white.jpg",
        },
        { name: "Red", imageUrl: "/images/iphone/iphone-se-2nd-gen-red.jpg" },
      ],
      capacities: [{ size: "64GB" }, { size: "128GB" }],
    },
    {
      model: "iPhone SE (3rd Generation)",
      colors: [
        {
          name: "Midnight",
          imageUrl: "/images/iphone/iphone-se-3rd-gen-midnight.jpg",
        },
        {
          name: "Starlight",
          imageUrl: "/images/iphone/iphone-se-3rd-gen-starlight.jpg",
        },
        { name: "Red", imageUrl: "/images/iphone/iphone-se-3rd-gen-red.jpg" },
      ],
      capacities: [{ size: "64GB" }, { size: "128GB" }, { size: "256GB" }],
    },
    {
      model: "iPhone 12",
      colors: [
        { name: "Black", imageUrl: "/images/iphone/iphone-12-black.jpg" },
        { name: "White", imageUrl: "/images/iphone/iphone-12-white.jpg" },
        { name: "Red", imageUrl: "/images/iphone/iphone-12-red.jpg" },
        { name: "Green", imageUrl: "/images/iphone/iphone-12-green.jpg" },
        { name: "Blue", imageUrl: "/images/iphone/iphone-12-blue.jpg" },
        { name: "Purple", imageUrl: "/images/iphone/iphone-12-purple.jpg" },
      ],
      capacities: [{ size: "64GB" }, { size: "128GB" }, { size: "256GB" }],
    },
    {
      model: "iPhone 12 Mini",
      colors: [
        { name: "Black", imageUrl: "/images/iphone/iphone-12-mini-black.jpg" },
        { name: "White", imageUrl: "/images/iphone/iphone-12-mini-white.jpg" },
        { name: "Red", imageUrl: "/images/iphone/iphone-12-mini-red.jpg" },
        { name: "Green", imageUrl: "/images/iphone/iphone-12-mini-green.jpg" },
        { name: "Blue", imageUrl: "/images/iphone/iphone-12-mini-blue.jpg" },
        {
          name: "Purple",
          imageUrl: "/images/iphone/iphone-12-mini-purple.jpg",
        },
      ],
      capacities: [{ size: "64GB" }, { size: "128GB" }, { size: "256GB" }],
    },
    {
      model: "iPhone 12 Pro",
      colors: [
        { name: "Silver", imageUrl: "/images/iphone/iphone-12-pro-silver.jpg" },
        {
          name: "Graphite",
          imageUrl: "/images/iphone/iphone-12-pro-graphite.jpg",
        },
        { name: "Gold", imageUrl: "/images/iphone/iphone-12-pro-gold.jpg" },
        {
          name: "Pacific Blue",
          imageUrl: "/images/iphone/iphone-12-pro-pacific-blue.jpg",
        },
      ],
      capacities: [{ size: "128GB" }, { size: "256GB" }, { size: "512GB" }],
    },
    {
      model: "iPhone 12 Pro Max",
      colors: [
        {
          name: "Silver",
          imageUrl: "/images/iphone/iphone-12-pro-max-silver.jpg",
        },
        {
          name: "Graphite",
          imageUrl: "/images/iphone/iphone-12-pro-max-graphite.jpg",
        },
        { name: "Gold", imageUrl: "/images/iphone/iphone-12-pro-max-gold.jpg" },
        {
          name: "Pacific Blue",
          imageUrl: "/images/iphone/iphone-12-pro-max-pacific-blue.jpg",
        },
      ],
      capacities: [{ size: "128GB" }, { size: "256GB" }, { size: "512GB" }],
    },
    {
      model: "iPhone 13",
      colors: [
        { name: "Midnight", imageUrl: "/images/iphone/iphone-13-midnight.jpg" },
        {
          name: "Starlight",
          imageUrl: "/images/iphone/iphone-13-starlight.jpg",
        },
        { name: "Blue", imageUrl: "/images/iphone/iphone-13-blue.jpg" },
        { name: "Pink", imageUrl: "/images/iphone/iphone-13-pink.jpg" },
        { name: "Green", imageUrl: "/images/iphone/iphone-13-green.jpg" },
        { name: "Red", imageUrl: "/images/iphone/iphone-13-red.jpg" },
      ],
      capacities: [{ size: "128GB" }, { size: "256GB" }, { size: "512GB" }],
    },
    {
      model: "iPhone 13 Mini",
      colors: [
        {
          name: "Midnight",
          imageUrl: "/images/iphone/iphone-13-mini-midnight.jpg",
        },
        {
          name: "Starlight",
          imageUrl: "/images/iphone/iphone-13-mini-starlight.jpg",
        },
        { name: "Blue", imageUrl: "/images/iphone/iphone-13-mini-blue.jpg" },
        { name: "Pink", imageUrl: "/images/iphone/iphone-13-mini-pink.jpg" },
        { name: "Green", imageUrl: "/images/iphone/iphone-13-mini-green.jpg" },
        { name: "Red", imageUrl: "/images/iphone/iphone-13-mini-red.jpg" },
      ],
      capacities: [{ size: "128GB" }, { size: "256GB" }, { size: "512GB" }],
    },
    {
      model: "iPhone 13 Pro",
      colors: [
        {
          name: "Graphite",
          imageUrl: "/images/iphone/iphone-13-pro-graphite.jpg",
        },
        { name: "Gold", imageUrl: "/images/iphone/iphone-13-pro-gold.jpg" },
        { name: "Silver", imageUrl: "/images/iphone/iphone-13-pro-silver.jpg" },
        {
          name: "Sierra Blue",
          imageUrl: "/images/iphone/iphone-13-pro-sierra-blue.jpg",
        },
        {
          name: "Alpine Green",
          imageUrl: "/images/iphone/iphone-13-pro-alpine-green.jpg",
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
          imageUrl: "/images/iphone/iphone-13-pro-max-graphite.jpg",
        },
        { name: "Gold", imageUrl: "/images/iphone/iphone-13-pro-max-gold.jpg" },
        {
          name: "Silver",
          imageUrl: "/images/iphone/iphone-13-pro-max-silver.jpg",
        },
        {
          name: "Sierra Blue",
          imageUrl: "/images/iphone/iphone-13-pro-max-sierra-blue.jpg",
        },
        {
          name: "Alpine Green",
          imageUrl: "/images/iphone/iphone-13-pro-max-alpine-green.jpg",
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
        { name: "Midnight", imageUrl: "/images/iphone/iphone-14-midnight.jpg" },
        {
          name: "Starlight",
          imageUrl: "/images/iphone/iphone-14-starlight.jpg",
        },
        { name: "Blue", imageUrl: "/images/iphone/iphone-14-blue.jpg" },
        { name: "Purple", imageUrl: "/images/iphone/iphone-14-purple.jpg" },
        { name: "Red", imageUrl: "/images/iphone/iphone-14-red.jpg" },
        { name: "Yellow", imageUrl: "/images/iphone/iphone-14-yellow.jpg" },
      ],
      capacities: [{ size: "128GB" }, { size: "256GB" }, { size: "512GB" }],
    },
    {
      model: "iPhone 14 Plus",
      colors: [
        {
          name: "Midnight",
          imageUrl: "/images/iphone/iphone-14-plus-midnight.jpg",
        },
        {
          name: "Starlight",
          imageUrl: "/images/iphone/iphone-14-plus-starlight.jpg",
        },
        { name: "Blue", imageUrl: "/images/iphone/iphone-14-plus-blue.jpg" },
        {
          name: "Purple",
          imageUrl: "/images/iphone/iphone-14-plus-purple.jpg",
        },
        { name: "Red", imageUrl: "/images/iphone/iphone-14-plus-red.jpg" },
        {
          name: "Yellow",
          imageUrl: "/images/iphone/iphone-14-plus-yellow.jpg",
        },
      ],
      capacities: [{ size: "128GB" }, { size: "256GB" }, { size: "512GB" }],
    },
    {
      model: "iPhone 14 Pro",
      colors: [
        {
          name: "Space Black",
          imageUrl: "/images/iphone/iphone-14-pro-space-black.jpg",
        },
        { name: "Silver", imageUrl: "/images/iphone/iphone-14-pro-silver.jpg" },
        { name: "Gold", imageUrl: "/images/iphone/iphone-14-pro-gold.jpg" },
        {
          name: "Deep Purple",
          imageUrl: "/images/iphone/iphone-14-pro-deep-purple.jpg",
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
          imageUrl: "/images/iphone/iphone-14-pro-max-space-black.jpg",
        },
        {
          name: "Silver",
          imageUrl: "/images/iphone/iphone-14-pro-max-silver.jpg",
        },
        { name: "Gold", imageUrl: "/images/iphone/iphone-14-pro-max-gold.jpg" },
        {
          name: "Deep Purple",
          imageUrl: "/images/iphone/iphone-14-pro-max-deep-purple.jpg",
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
        { name: "Black", imageUrl: "/images/iphone/iphone-15-black.jpg" },
        { name: "Blue", imageUrl: "/images/iphone/iphone-15-blue.jpg" },
        { name: "Green", imageUrl: "/images/iphone/iphone-15-green.jpg" },
        { name: "Yellow", imageUrl: "/images/iphone/iphone-15-yellow.jpg" },
        { name: "Pink", imageUrl: "/images/iphone/iphone-15-pink.jpg" },
      ],
      capacities: [{ size: "128GB" }, { size: "256GB" }, { size: "512GB" }],
    },
    {
      model: "iPhone 15 Plus",
      colors: [
        { name: "Black", imageUrl: "/images/iphone/iphone-15-plus-black.jpg" },
        { name: "Blue", imageUrl: "/images/iphone/iphone-15-plus-blue.jpg" },
        { name: "Green", imageUrl: "/images/iphone/iphone-15-plus-green.jpg" },
        {
          name: "Yellow",
          imageUrl: "/images/iphone/iphone-15-plus-yellow.jpg",
        },
        { name: "Pink", imageUrl: "/images/iphone/iphone-15-plus-pink.jpg" },
      ],
      capacities: [{ size: "128GB" }, { size: "256GB" }, { size: "512GB" }],
    },
    {
      model: "iPhone 15 Pro",
      colors: [
        {
          name: "Natural Titanium",
          imageUrl: "/images/iphone/iphone-15-pro-natural-titanium.jpg",
        },
        {
          name: "Blue Titanium",
          imageUrl: "/images/iphone/iphone-15-pro-blue-titanium.jpg",
        },
        {
          name: "White Titanium",
          imageUrl: "/images/iphone/iphone-15-pro-white-titanium.jpg",
        },
        {
          name: "Black Titanium",
          imageUrl: "/images/iphone/iphone-15-pro-black-titanium.jpg",
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
          imageUrl: "/images/iphone/iphone-15-pro-max-natural-titanium.jpg",
        },
        {
          name: "Blue Titanium",
          imageUrl: "/images/iphone/iphone-15-pro-max-blue-titanium.jpg",
        },
        {
          name: "White Titanium",
          imageUrl: "/images/iphone/iphone-15-pro-max-white-titanium.jpg",
        },
        {
          name: "Black Titanium",
          imageUrl: "/images/iphone/iphone-15-pro-max-black-titanium.jpg",
        },
      ],
      capacities: [{ size: "256GB" }, { size: "512GB" }, { size: "1TB" }],
    },
    {
      model: "iPhone 16",
      colors: [
        { name: "Black", imageUrl: "/images/iphone/iphone-16-black.jpg" },
        {
          name: "Ultramarine",
          imageUrl: "/images/iphone/iphone-16-ultramarine.jpg",
        },
        { name: "Teal", imageUrl: "/images/iphone/iphone-16-teal.jpg" },
        { name: "Pink", imageUrl: "/images/iphone/iphone-16-pink.jpg" },
        { name: "White", imageUrl: "/images/iphone/iphone-16-white.jpg" },
      ],
      capacities: [{ size: "128GB" }, { size: "256GB" }, { size: "512GB" }],
    },
    {
      model: "iPhone 16 Plus",
      colors: [
        { name: "Black", imageUrl: "/images/iphone/iphone-16-plus-black.jpg" },
        {
          name: "ultramarine",
          imageUrl: "/images/iphone/iphone-16-plus-ultramarine.jpg",
        },
        {
          name: "teal",
          imageUrl: "/images/iphone/iphone-16-plus-teal.jpg",
        },
        { name: "Pink", imageUrl: "/images/iphone/iphone-16-plus-pink.jpg" },
        { name: "White", imageUrl: "/images/iphone/iphone-16-plus-white.jpg" },
      ],
      capacities: [{ size: "128GB" }, { size: "256GB" }, { size: "512GB" }],
    },
    {
      model: "iPhone 16 Pro",
      colors: [
        {
          name: "Black Titanium ",
          imageUrl: "/images/iphone/iphone-16-pro-black-titanium.jpg",
        },
        {
          name: "White Titanium",
          imageUrl: "/images/iphone/iphone-16-pro-white-titanium.jpg",
        },
        {
          name: "Natural Titanium",
          imageUrl: "/images/iphone/iphone-16-pro-natural-titanium.jpg",
        },
        {
          name: "Desert Titanium",
          imageUrl: "/images/iphone/iphone-16-pro-desert-titanium.jpg",
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
          imageUrl: "/images/iphone/iphone-16-pro-max-black-titanium.jpg",
        },
        {
          name: "White Titanium",
          imageUrl: "/images/iphone/iphone-16-pro-max-white-titanium.jpg",
        },
        {
          name: "Natural Titanium",
          imageUrl: "/images/iphone/iphone-16-pro-max-natural-titanium.jpg",
        },
        {
          name: "Desert Titanium",
          imageUrl: "/images/iphone/iphone-16-pro-max-desert-titanium.jpg",
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
                  conditionType: "Semi-novo",
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
