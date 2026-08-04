"use client";

import Image from "@/components/HighQualityImage";
import Link from "next/link";
import { useState } from "react";
import { roomNavigation } from "@/lib/room-navigation";

export function RoomDirectory() {
  const [expandedRooms, setExpandedRooms] = useState<Set<string>>(new Set());
  const toggleRoom = (roomId: string) => {
    setExpandedRooms((current) => {
      const next = new Set(current);
      if (next.has(roomId)) next.delete(roomId);
      else next.add(roomId);
      return next;
    });
  };

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
        {roomNavigation.map((room) => {
          const expanded = expandedRooms.has(room.id);
          const initialVisibleCount = Math.min(2, room.categories.length);
          const visibleCategories = expanded ? room.categories : room.categories.slice(0, initialVisibleCount);
          const remainingCategories = Math.max(0, room.categories.length - initialVisibleCount);
          return <article className="stitch-room-directory-card" id={room.id} key={room.id}>
            <div className="stitch-room-directory-image">
              <Image src={room.image} alt={`${room.name} furniture`} fill sizes="(max-width: 760px) 100vw, 50vw" />
            </div>
            <div className="stitch-room-directory-copy">
              <p className="stitch-eyebrow">Room</p>
              <h2>{room.name}</h2>
              <ul>
                {visibleCategories.map(([label, href]) => (
                  <li key={label}>
                    <Link href={href}>{label}<span>Explore</span></Link>
                  </li>
                ))}
              </ul>
              <div className="stitch-room-directory-footer">
                <span>{room.categories.length} {room.categories.length === 1 ? "category" : "categories"}</span>
                {remainingCategories ? <button type="button" aria-expanded={expanded} onClick={() => toggleRoom(room.id)}>{expanded ? "Show less" : `View ${remainingCategories} more`}</button> : null}
              </div>
            </div>
          </article>
        })}
      </section>
    </div>
  );
}
