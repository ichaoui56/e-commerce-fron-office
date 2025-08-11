// lib/constants/shipping-options.ts

export const shippingOptions = [
    {
      id: "casablanca",
      label: "Casablanca & Surrounding Areas",
      cities: "Casablanca, Mohammedia, Bouskoura",
      price: 25
    },
    {
      id: "rabat",
      label: "Rabat-Sale Region",
      cities: "Rabat, Sale, Temara, Skhirat",
      price: 30
    },
    {
      id: "other_cities",
      label: "Other Cities",
      cities: "Marrakech, Fez, Tangier, Agadir, etc.",
      price: 40
    },
    {
      id: "remote_areas",
      label: "Remote Areas",
      cities: "Rural areas and remote locations",
      price: 60
    }
  ] as const