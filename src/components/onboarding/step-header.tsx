type Props = {
  eyebrow?: string | null;
  title: string;
  description?: string;
};

export function StepHeader({ eyebrow, title, description }: Props) {
  return (
    <div className="mb-8">
      {eyebrow ? (
        <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-brand-400 mb-2">{eyebrow}</div>
      ) : null}
      <h1 className="text-[26px] font-semibold text-gray-800 leading-tight mb-2">{title}</h1>
      {description ? <p className="text-[15px] text-gray-500 leading-relaxed">{description}</p> : null}
    </div>
  );
}
