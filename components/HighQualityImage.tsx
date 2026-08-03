import React from "react";
import NextImage, { type ImageProps } from "next/image";

export default function HighQualityImage({ quality = 90, style, ...props }: ImageProps) {
  return (
    <NextImage
      quality={quality}
      style={{ objectFit: "contain", ...style }}
      {...props}
    />
  );
}
