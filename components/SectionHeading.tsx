import type { ReactNode } from "react";

export function SectionHeading({
  index,
  label,
  title,
  lead,
  id,
}: {
  index: string;
  label: string;
  title: ReactNode;
  lead?: string;
  id?: string;
}) {
  return (
    <div className="sec-head">
      <p className="sec-head__meta mono">
        <span className="sec-head__index">{index}</span>
        <span>{label}</span>
      </p>
      <h2 className="sec-head__title" id={id}>
        {title}
      </h2>
      {lead ? <p className="sec-head__lead">{lead}</p> : null}
    </div>
  );
}
