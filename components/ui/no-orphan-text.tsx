import type { ReactNode } from "react";

type NoOrphanTextProps = {
  text: string;
  tailLength?: number;
};

export function NoOrphanText({
  text,
  tailLength = 4,
}: NoOrphanTextProps): ReactNode {
  if (text.length <= tailLength) {
    return <span className="whitespace-nowrap">{text}</span>;
  }

  const splitAt = text.length - tailLength;

  return (
    <>
      {text.slice(0, splitAt)}
      <span className="whitespace-nowrap">{text.slice(splitAt)}</span>
    </>
  );
}
