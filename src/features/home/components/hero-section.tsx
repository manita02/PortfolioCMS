"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { CvDownloadButton } from "@/components/shared/cv-download-button";
import { buttonVariants } from "@/components/ui/button";
import { storageBuckets } from "@/constants/storage-buckets";
import { getPublicStorageUrl } from "@/lib/storage-url";
import { cn } from "@/lib/utils";
import type { Person, Skill } from "@/types/domain";

export function HeroSection({
  person,
  highlightSkills = [],
}: {
  person: Person | null;
  highlightSkills?: Skill[];
}) {
  const reduce = useReducedMotion();
  const name = person
    ? `${person.firstName} ${person.lastName}`
    : "Portfolio";
  const banner = getPublicStorageUrl(
    storageBuckets.person,
    person?.bannerImagePath,
  );
  const avatar = getPublicStorageUrl(
    storageBuckets.person,
    person?.profileImagePath,
  );
  const title = person?.professionalTitle || "Software Engineer";
  const subtitle =
    person?.subtitle ||
    "Diseño y construyo productos digitales con foco en calidad.";
  const techs = highlightSkills;

  return (
    <section id="hero" className="relative scroll-mt-20 overflow-hidden">
      <div className="absolute inset-0 -z-10">
        {banner ? (
          <Image
            src={banner}
            alt=""
            fill
            priority
            className="object-cover"
            sizes="100vw"
            placeholder="empty"
          />
        ) : (
          <div className="from-muted via-background to-background absolute inset-0 bg-gradient-to-br" />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/78 to-background" />
      </div>

      <div className="mx-auto flex min-h-[min(92vh,880px)] w-full max-w-6xl flex-col justify-end px-4 pb-16 pt-28 sm:px-6 sm:pb-24 sm:pt-32">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="grid items-end gap-10 lg:grid-cols-[1fr_auto]"
        >
          <div className="max-w-2xl space-y-5">
            <h1 className="font-heading text-5xl tracking-tight sm:text-7xl">
              {name}
            </h1>
            <p className="text-muted-foreground text-lg sm:text-xl">{title}</p>
            <p className="text-foreground/85 max-w-xl text-base leading-relaxed">
              {subtitle}
            </p>

            {techs.length > 0 ? (
              <ul className="flex flex-wrap gap-2 pt-1" aria-label="Stack">
                {techs.map((skill) => (
                  <li
                    key={skill.id}
                    className="bg-background/70 text-foreground/80 rounded-full border border-border/60 px-3 py-1 text-xs backdrop-blur-sm sm:text-sm"
                  >
                    {skill.label}
                  </li>
                ))}
              </ul>
            ) : null}

            <div className="flex flex-wrap gap-3 pt-3">
              <Link
                href="/proyectos"
                className={cn(buttonVariants({ size: "lg" }))}
              >
                Ver proyectos
              </Link>
              <CvDownloadButton variant="outline" size="lg" />
            </div>
          </div>

          {avatar ? (
            <motion.div
              initial={reduce ? false : { opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.55, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="relative mx-auto size-40 overflow-hidden rounded-[2rem] border border-border/50 shadow-lg sm:size-52 lg:mx-0 lg:size-56"
            >
              <Image
                src={avatar}
                alt={name}
                fill
                priority
                className="object-cover"
                sizes="224px"
              />
            </motion.div>
          ) : null}
        </motion.div>
      </div>
    </section>
  );
}
