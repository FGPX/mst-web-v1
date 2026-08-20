export const roomNavigation = [
  {
    id: "living-room",
    name: "Living Room",
    image: "/stitch-assets/original/room-living-clean.jpg",
    source: "https://www.musterring.com/en/furniture/living-room",
    categories: [
      ["All connected living furniture", "/furniture"],
      ["Sofas", "/furniture?category=sofa"],
      ["Armchairs", "/furniture?category=armchair"],
      ["Sectional sofas", "/furniture?category=sectional"],
      ["Living walls, sideboards & co.", "/furniture?category=storage&collections=Living%20Room"],
      ["Coffee tables & side tables", "/furniture?category=coffee-table"]
    ]
  },
  {
    id: "bedroom",
    name: "Bedroom",
    image: "/stitch-assets/original/room-bedroom-hq.jpg",
    source: "https://www.musterring.com/en/furniture/bedroom",
    categories: [["Bedroom series", "/furniture?category=bedroom-series"], ["Beds", "/furniture?category=bed"], ["Wardrobes", "/furniture?category=wardrobe"]]
  },
  {
    id: "dining-room",
    name: "Dining Room",
    image: "/stitch-assets/original/room-dining-hq.jpg",
    source: "https://www.musterring.com/en/furniture/dining-room",
    categories: [["Dining chairs", "/furniture?category=dining-chair"], ["Dining tables", "/furniture?category=dining-table"]]
  },
  {
    id: "bathroom",
    name: "Bathroom",
    image: "/musterring-catalog/revento-line/image-01.jpg",
    source: "https://www.musterring.com/en/furniture/bathroom",
    categories: [["Bathroom series", "/furniture?category=bathroom"]]
  },
  {
    id: "hallway",
    name: "Hallway",
    image: "/musterring-catalog/mr-isabelle/image-01.jpg",
    source: "https://www.musterring.com/en/furniture/hallway",
    categories: [["Hallway furniture", "/furniture?category=storage&collections=Hallway"]]
  },
  {
    id: "kitchen",
    name: "Kitchen",
    image: "/musterring-catalog/kira-system/image-01.jpg",
    source: "https://www.musterring.com/en/furniture/kitchen",
    categories: [["Kitchen collection", "/furniture?category=kitchen"]]
  },
  {
    id: "outdoor",
    name: "Outdoor",
    image: "/musterring-catalog/freilicht/image-01.jpg",
    source: "https://www.musterring.com/en/furniture/outdoor",
    categories: [["Outdoor furniture", "/furniture?category=outdoor"]]
  },
  {
    id: "home-accessories",
    name: "Home Accessories",
    image: "/musterring-catalog/lamps-20/image-01.jpg",
    source: "https://www.musterring.com/en/furniture/home-accessories",
    categories: [["Small furniture", "/furniture?category=small-furniture"], ["Carpets", "/furniture?category=carpet"], ["Lamp collection", "/furniture?category=lamp"], ["Home textiles", "/furniture?category=home-textile"]]
  }
] as const;
