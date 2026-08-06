"use client";

import Image from "next/image";
import { Boxes, Code2, Layers, Sparkles, Wrench } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { Reveal } from "@/components/shared/reveal";
import { SectionHeader } from "@/components/shared/section-header";
import { storageBuckets } from "@/constants/storage-buckets";
import { getPublicStorageUrl } from "@/lib/storage-url";
import type { Skill } from "@/types/domain";

const fallbackIcons = [Code2, Layers, Wrench, Sparkles, Boxes] as const;

function iconForGroup(index: number) {
  return fallbackIcons[index % fallbackIcons.length];
}

export function SkillsSection({
  title,
  skills,
  emptyLabel,
}: {
  title: string;
  skills: Skill[];
  emptyLabel: string;
}) {
  const byType = new Map<
    string,
    { typeId: string; typeName: string; typeSortOrder: number; items: Skill[] }
  >();

  for (const skill of skills) {
    const existing = byType.get(skill.typeId);
    if (existing) {
      existing.items.push(skill);
    } else {
      byType.set(skill.typeId, {
        typeId: skill.typeId,
        typeName: skill.typeName,
        typeSortOrder: skill.typeSortOrder,
        items: [skill],
      });
    }
  }

  const groups = [...byType.values()].sort(
    (a, b) => a.typeSortOrder - b.typeSortOrder || a.typeName.localeCompare(b.typeName),
  );

  return (
    <section
      id="skills"
      className="mx-auto w-full max-w-6xl scroll-mt-20 px-4 py-16 sm:px-6 sm:py-20"
    >
      <Reveal>
        <SectionHeader title={title} />
        {groups.length === 0 ? (
          <EmptyState message={emptyLabel} />
        ) : (
          <div className="space-y-10">
            {groups.map((group, groupIndex) => {
              const Icon = iconForGroup(groupIndex);
              return (
                <Reveal
                  key={group.typeId}
                  delay={Math.min(groupIndex * 0.05, 0.2)}
                >
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Icon
                        className="text-muted-foreground size-4"
                        aria-hidden
                      />
                      <h3 className="font-heading text-lg tracking-tight">
                        {group.typeName}
                      </h3>
                    </div>
                    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                      {group.items.map((skill) => {
                        const icon = getPublicStorageUrl(
                          storageBuckets.icons,
                          skill.iconPath,
                        );
                        return (
                          <li key={skill.id}>
                            <div className="group bg-card/40 hover:border-foreground/20 hover:bg-card flex h-full items-center gap-3 rounded-2xl border border-border/60 px-3 py-3 transition-all hover:-translate-y-0.5 hover:shadow-sm">
                              <div className="bg-muted relative flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-xl">
                                {icon ? (
                                  <Image
                                    src={icon}
                                    alt=""
                                    fill
                                    className="object-contain p-1.5"
                                    sizes="36px"
                                  />
                                ) : (
                                  <Icon className="text-muted-foreground size-4" />
                                )}
                              </div>
                              <span className="text-sm font-medium leading-tight">
                                {skill.label}
                              </span>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </Reveal>
              );
            })}
          </div>
        )}
      </Reveal>
    </section>
  );
}
