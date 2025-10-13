// components/filters-sidebar.tsx
'use client';
import { useMemo } from 'react';

type Props = {
  allSubjects: string[];
  selected: string[];
  onToggle: (subject: string) => void;
};

export default function FiltersSidebar({ allSubjects, selected, onToggle }: Props) {
  // 排序：已選在前，其他依字母
  const subjects = useMemo(() => {
    const set = new Set(selected);
    return [...allSubjects].sort((a, b) => {
      const av = set.has(a) ? 0 : 1;
      const bv = set.has(b) ? 0 : 1;
      return av - bv || a.localeCompare(b);
    });
  }, [allSubjects, selected]);

  return (
    <aside className="rounded-2xl border p-4 md:p-5 bg-card/50">
      <h3 className="font-semibold mb-3">Filters</h3>
      <div className="space-y-2">
        <div className="text-sm text-muted-foreground">Subjects</div>
        <ul className="space-y-2">
          {subjects.map((s) => (
            <li key={s} className="flex items-center gap-3">
              <input
                id={`sub-${s}`}
                type="checkbox"
                checked={selected.includes(s)}
                onChange={() => onToggle(s)}
                className="h-4 w-4 rounded border-muted-foreground/30"
              />
              <label htmlFor={`sub-${s}`} className="text-sm cursor-pointer">{s}</label>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
