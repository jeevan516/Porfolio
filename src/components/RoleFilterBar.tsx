import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Brain, Database, Server, Sparkles } from 'lucide-react';
import { TargetRole } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { playTactileClick } from '../services/soundFx';

/** "Filter by hiring discipline": tailors the Projects and Skills sections that follow it. */
export const RoleFilterBar: React.FC<{
  activeRole: TargetRole;
  setActiveRole: (role: TargetRole) => void;
  language?: 'en' | 'de';
}> = ({ activeRole, setActiveRole, language = 'en' }) => {
  const t = TRANSLATIONS[language].hero;
  const items = [
    { id: 'all', label: t.allRoles, icon: Sparkles },
    { id: 'ai-ml', label: t.aiRole, icon: Brain },
    { id: 'it-devops', label: t.devopsRole, icon: Server },
    { id: 'observability', label: t.obsRole, icon: Activity },
    { id: 'data-eng', label: t.dataRole, icon: Database },
  ];
  return (
    <div className="relative z-[2] border-t border-line">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="jd-card !p-4 sm:!p-5" role="group" aria-labelledby="role-filter-heading">
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 mb-3">
            <h2 id="role-filter-heading" className="!font-sans text-base font-semibold text-fg flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-accent-fg" aria-hidden="true" />
              {t.filterHeading.replace(/:$/, '')}
            </h2>
            <p className="text-sm text-subtle">{t.filterSub}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {items.map((item) => {
              const Icon = item.icon;
              const isActive = activeRole === item.id;
              return (
                <motion.button
                  key={item.id}
                  type="button"
                  id={`filter-role-${item.id}`}
                  onClick={() => {
                    playTactileClick();
                    setActiveRole(item.id as TargetRole);
                  }}
                  aria-pressed={isActive}
                  whileTap={{ scale: 0.96 }}
                  className={`relative inline-flex items-center gap-2 min-h-10 px-3.5 rounded-lg text-sm font-semibold transition-colors ${
                    isActive ? 'text-on-accent' : 'border border-line-strong text-muted hover:text-fg hover:bg-surface-2'
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="activeRolePill"
                      className="absolute inset-0 rounded-lg bg-accent"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <Icon className="relative w-4 h-4" aria-hidden="true" />
                  <span className="relative">{item.label}</span>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
