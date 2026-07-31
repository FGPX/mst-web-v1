import Image from "next/image";
import Link from "next/link";

const rooms = [
  {
    id: "living-room",
    name: "Living Room",
    image: "/stitch-assets/original/room-living.jpg",
    source: "https://www.musterring.com/en/furniture/living-room",
    categories: [
      ["All connected living furniture", "/furniture"],
      ["Sofas", "/furniture?category=sofa"],
      ["Armchairs", "/furniture?category=armchair"],
      ["Sectional sofas", "/furniture?category=sectional"],
      ["Living walls, sideboards & co.", "/furniture?category=storage"],
      ["Coffee tables & side tables", "/furniture?category=coffee-table"]
    ]
  },
  {
    id: "bedroom",
    name: "Bedroom",
    image: "/stitch-assets/original/room-bedroom.jpg",
    source: "https://www.musterring.com/en/furniture/bedroom",
    categories: [["Bedroom series", "/furniture?category=bedroom-series"], ["Beds", "/furniture?category=bed"], ["Wardrobes", "/furniture?category=wardrobe"]]
  },
  {
    id: "dining-room",
    name: "Dining Room",
    image: "/stitch-assets/original/room-dining.jpg",
    source: "https://www.musterring.com/en/furniture/dining-room",
    categories: [["Dining chairs", "/furniture?category=dining-chair"], ["Dining tables", "/furniture?category=dining-table"]]
  },
  {
    id: "bathroom",
    name: "Bathroom",
    image: "/test-assets/musterring/furniture/image-06.jpg",
    source: "https://www.musterring.com/en/furniture/bathroom",
    categories: [["Bathroom series", "/furniture?category=bathroom"]]
  },
  {
    id: "hallway",
    name: "Hallway",
    image: "/test-assets/musterring/furniture/image-07.jpg",
    source: "https://www.musterring.com/en/furniture/hallway",
    categories: [["Wardrobes", "/furniture?category=wardrobe"]]
  },
  {
    id: "kitchen",
    name: "Kitchen",
    image: "/test-assets/musterring/furniture/image-05.jpg",
    source: "https://www.musterring.com/en/furniture/kitchen",
    categories: [["Kitchen collection", "/furniture?category=kitchen"]]
  },
  {
    id: "outdoor",
    name: "Outdoor",
    image: "/test-assets/musterring/furniture/image-08.jpg",
    source: "https://www.musterring.com/en/furniture/outdoor",
    categories: [["Outdoor furniture", "/furniture?category=outdoor"]]
  },
  {
    id: "home-accessories",
    name: "Home Accessories",
    image: "/test-assets/musterring/furniture/image-02.jpg",
    source: "https://www.musterring.com/en/furniture/home-accessories",
    categories: [["Small furniture", "/furniture?category=small-furniture"], ["Carpets", "/furniture?category=carpet"], ["Lamp collection", "/furniture?category=lamp"], ["Home textiles", "/furniture?category=home-textile"]]
  }
] as const;

export function RoomDirectory() {
  return (
    <div className="stitch-room-directory">
      <section className="stitch-room-directory-hero">
        <div className="stitch-container">
          <p className="stitch-eyebrow">Furniture by room</p>
          <h1>Find your living world.</h1>
          <p>
            Explore the room and product families in Musterring&apos;s current furniture navigation.
            Connected catalogue ranges open here; all other ranges open the official Musterring
            collection until their product data is connected.
          </p>
        </div>
      </section>
      <section className="stitch-room-directory-grid stitch-container" aria-label="Musterring room categories">
        {rooms.map((room) => (
          <article className="stitch-room-directory-card" id={room.id} key={room.id}>
            <div className="stitch-room-directory-image">
              <Image src={room.image} alt={`${room.name} furniture`} fill sizes="(max-width: 760px) 100vw, 50vw" />
            </div>
            <div className="stitch-room-directory-copy">
              <p className="stitch-eyebrow">Room</p>
              <h2>{room.name}</h2>
              <ul>
                {room.categories.map(([label, href]) => (
                  <li key={label}>
                    <Link href={href}>{label}<span>Explore</span></Link>
                  </li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
