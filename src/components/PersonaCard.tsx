import type { Persona } from "@/lib/personas";

const gradients = [
  "from-rose-300 via-pink-300 to-rose-400",
  "from-amber-300 via-orange-300 to-rose-300",
  "from-violet-300 via-purple-300 to-pink-300",
  "from-sky-300 via-blue-300 to-indigo-300",
];

const genderLabel: Record<Persona["gender"], string> = {
  female: "여성",
  male: "남성",
  other: "기타",
};

export default function PersonaCard({
  persona,
  index,
  onDelete,
}: {
  persona: Persona;
  index: number;
  onDelete?: (id: string) => void;
}) {
  const gradient = gradients[index % gradients.length];

  return (
    <div className="relative bg-white rounded-3xl shadow-md shadow-rose-100 border border-rose-50 p-3 animate-fade-in-up">
      {onDelete && (
        <button
          onClick={() => onDelete(persona.id)}
          className="absolute top-2 right-2 z-10 w-7 h-7 rounded-full bg-white/80 backdrop-blur text-rose-300 hover:text-rose-500 hover:bg-white flex items-center justify-center text-sm shadow-sm"
          aria-label="삭제"
        >
          ✕
        </button>
      )}
      <div
        className={`aspect-[4/3] rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center`}
      >
        <span className="text-white/90 text-5xl font-bold drop-shadow">
          {persona.name.slice(0, 1)}
        </span>
      </div>
      <div className="px-1.5 pt-3 pb-1">
        <p className="text-sm font-bold text-rose-950">
          {persona.name} · {persona.age} · {genderLabel[persona.gender]}
        </p>
        <p className="text-xs text-rose-900/55 mt-1 mb-2 line-clamp-2 leading-relaxed">
          {persona.summary}
        </p>
        <div className="flex flex-wrap gap-1">
          {persona.tags.map((t) => (
            <span
              key={t}
              className="text-[10px] text-rose-500 bg-rose-50 px-2 py-0.5 rounded-full"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
