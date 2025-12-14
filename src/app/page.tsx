"use client";
import { useMemo, useState } from "react";
import type { Tutor } from "@/types/tutor";
import { tutors as TUTORS } from "@/data/mock-tutors";
import FiltersSidebar from "@/components/filters-sidebar";
import TutorCard from "@/components/TutorCard";
import TutorProfileModal from "@/components/TutorProfileModal";
import { useSearch } from "@/components/search-context";

function collectSubjects(list: Tutor[]) {
  const set = new Set<string>();
  list.forEach((t) => t.subjects.forEach((s) => set.add(s)));
  return Array.from(set).sort();
}

export default function HomePage() {
  const { query } = useSearch();
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [activeTutor, setActiveTutor] = useState<Tutor | null>(null);

  const allSubjects = useMemo(() => collectSubjects(TUTORS), []);
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return TUTORS.filter((t) => {
      const textHit =
        !q ||
        t.name.toLowerCase().includes(q) ||
        t.location.toLowerCase().includes(q) ||
        t.subjects.some((s) => s.toLowerCase().includes(q)) ||
        t.courseCodes.some((c) => c.toLowerCase().includes(q));
      const subjectHit =
        selectedSubjects.length === 0 ||
        t.subjects.some((s) => selectedSubjects.includes(s));
      return textHit && subjectHit;
    });
  }, [query, selectedSubjects]);

  function toggleSubject(s: string) {
    setSelectedSubjects((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  }

  return (
    <>
      <div className="grid gap-6 md:grid-cols-[280px_1fr]">
        <FiltersSidebar allSubjects={allSubjects} selected={selectedSubjects} onToggle={toggleSubject} />
        <section className="space-y-4">
          <div className="flex items-end justify-between">
            <h1 className="text-2xl font-semibold">All Tutors ({filtered.length})</h1>
            {selectedSubjects.length > 0 && (
              <button className="text-sm text-indigo-600 hover:underline" onClick={() => setSelectedSubjects([])}>
                Clear filters
              </button>
            )}
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            {filtered.map((t) => (
              <TutorCard key={t.id} tutor={t} onViewProfile={setActiveTutor} />
            ))}
          </div>
        </section>
      </div>

      <TutorProfileModal tutor={activeTutor} isOpen={!!activeTutor} onClose={() => setActiveTutor(null)} />
    </>
  );
}
