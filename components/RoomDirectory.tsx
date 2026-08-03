import Image from "@/components/HighQualityImage";
import Link from "next/link";
import { roomNavigation } from "@/lib/room-navigation";

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
        {roomNavigation.map((room) => (
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
