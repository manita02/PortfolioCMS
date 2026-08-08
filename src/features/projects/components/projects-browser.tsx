"use client";

import { useMemo, useState } from "react";
import { EmptyState } from "@/components/shared/empty-state";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProjectCard } from "@/features/projects/components/project-card";
import type { Project, Skill } from "@/types/domain";

const ALL_SKILLS_VALUE = "all";

export function ProjectsBrowser({
  projects,
  skills,
  seeLabel,
}: {
  projects: Project[];
  skills: Skill[];
  seeLabel: string;
}) {
  const [query, setQuery] = useState("");
  const [skillId, setSkillId] = useState<string>(ALL_SKILLS_VALUE);

  const selectItems = useMemo(
    () => [
      { value: ALL_SKILLS_VALUE, label: "Todas" },
      ...skills.map((skill) => ({
        value: skill.id,
        label: skill.label,
      })),
    ],
    [skills],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return projects.filter((project) => {
      const matchesQuery =
        !q ||
        project.name.toLowerCase().includes(q) ||
        project.summary.toLowerCase().includes(q) ||
        project.description.toLowerCase().includes(q) ||
        project.skills.some((s) => s.label.toLowerCase().includes(q));
      const matchesSkill =
        skillId === ALL_SKILLS_VALUE ||
        project.skills.some((s) => s.id === skillId);
      return matchesQuery && matchesSkill;
    });
  }, [projects, query, skillId]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar"
          aria-label="Buscar"
          className="w-full sm:max-w-sm"
        />
        <Select
          value={skillId}
          onValueChange={(v) => setSkillId(v ?? ALL_SKILLS_VALUE)}
          items={selectItems}
        >
          <SelectTrigger
            className="w-full min-w-0 max-w-full sm:w-56 [&_[data-slot=select-value]]:min-w-0 [&_[data-slot=select-value]]:truncate"
            aria-label="Filtrar por habilidad"
          >
            <SelectValue placeholder="Filtrar por habilidad" />
          </SelectTrigger>
          <SelectContent alignItemWithTrigger>
            {selectItems.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState message="Sin resultados." />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              seeLabel={seeLabel}
            />
          ))}
        </div>
      )}
    </div>
  );
}
