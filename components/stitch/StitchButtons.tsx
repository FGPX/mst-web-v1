import React from "react";
import Link from "next/link";
import type { ComponentProps } from "react";

type LinkButtonProps = ComponentProps<typeof Link> & {
  variant?: "primary" | "secondary" | "ghost";
};

export function StitchLinkButton({ className = "", variant = "primary", ...props }: LinkButtonProps) {
  return <Link className={`stitch-button stitch-button-${variant} ${className}`} {...props} />;
}

type ButtonProps = ComponentProps<"button"> & {
  variant?: "primary" | "secondary" | "ghost";
};

export function StitchButton({ className = "", variant = "primary", ...props }: ButtonProps) {
  return <button className={`stitch-button stitch-button-${variant} ${className}`} {...props} />;
}
