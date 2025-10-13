import * as React from "react";

type Props = React.ImgHTMLAttributes<HTMLImageElement> & {
  fallbackSrc?: string;
};

export function ImageWithFallback({ fallbackSrc = "/favicon.ico", ...props }: Props) {
  const [src, setSrc] = React.useState(props.src);
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      {...props}
      src={src}
      onError={() => setSrc(fallbackSrc)}
      alt={props.alt ?? ""}
    />
  );
}
