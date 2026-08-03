import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { StitchHeader } from "@/components/stitch/StitchHeader";

vi.mock("next/navigation", () => ({
  usePathname: () => "/furniture"
}));

describe("StitchHeader furniture navigation", () => {
  it("opens the furniture categories on click and closes them with Escape", () => {
    render(<StitchHeader />);

    const trigger = screen.getByRole("button", { name: /^Furniture$/i });
    const menu = document.getElementById("furniture-mega-menu");

    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(menu).not.toHaveClass("is-open");

    fireEvent.click(trigger);

    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(menu).toHaveClass("is-open");
    expect(screen.getAllByRole("link", { name: "Bedroom Series" }).length).toBeGreaterThan(0);

    fireEvent.keyDown(document, { key: "Escape" });

    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(menu).not.toHaveClass("is-open");

    const roomsTrigger = screen.getByRole("button", { name: /^Rooms$/i });
    const roomsMenu = document.getElementById("rooms-mega-menu");

    fireEvent.click(roomsTrigger);

    expect(roomsTrigger).toHaveAttribute("aria-expanded", "true");
    expect(roomsMenu).toHaveClass("is-open");
    expect(menu).not.toHaveClass("is-open");
    expect(screen.getAllByRole("link", { name: "Living Room" }).length).toBeGreaterThan(0);
  });
});
