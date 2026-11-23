import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Activity, Cpu, Brain, Factory } from 'lucide-react';
import { TRANSLATIONS } from '../data/translations';
import { NeuralNetworkCanvas } from './graphics/NeuralNetworkCanvas';
import { IndustrialIoTMonitor } from './graphics/IndustrialIoTMonitor';
import { VLSIIntegratedCircuitGraphic } from './graphics/VLSIIntegratedCircuitGraphic';
import { playTactileClick } from '../services/soundFx';

/**
 * Interactive visualisations that used to sit in the hero: the VLSI chip simulator (TU Clausthal
 * research), the LSTM network and the industrial IoT monitor, plus the academic facts that went with them.
 */
export const ResearchVisualsSection: React.FC<{ language?: 'en' | 'de' }> = ({ language = 'en' }) => {
  const isDe = language === 'de';
  const t = TRANSLATIONS[language].hero;
  const reduce = useReducedMotion();
  const [active, setActive] = useState<'vlsi' | 'neural' | 'iot'>('vlsi');

  const tabs = [
    { id: 'vlsi' as const, label: isDe ? 'VLSI-Schaltungen' : 'VLSI circuits', icon: Cpu },
    { id: 'neural' as const, label: 'Deep learning', icon: Brain },
    { id: 'iot' as const, label: 'Industrial IoT', icon: Factory },
  ];

  const facts = [
    { label: t.stats.academic, value: t.stats.academicVal, detail: t.stats.academicDetail },
    { label: t.stats.thesis, value: t.stats.thesisVal, detail: t.stats.thesisDetail },
    { label: t.stats.status, value: t.stats.statusVal, detail: t.stats.statusDetail },
    { label: t.stats.ttr, value: t.stats.ttrVal, detail: t.stats.ttrDetail },
  ];

  return (
    <section id="research-visuals" aria-labelledby="research-visuals-title" className="py-16 sm:py-20 border-t border-line relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mb-8"
        >
          <p className="jd-eyebrow inline-flex items-center gap-2 mb-3">
            <Activity className="w-4 h-4" aria-hidden="true" />
            {isDe ? 'Forschung & Systeme, interaktiv' : 'Research & systems, interactive'}
          </p>
          <h2 id="research-visuals-title" className="text-3xl sm:text-4xl font-bold text-fg">
            {isDe ? 'Vom Chip bis zur Fabrikhalle' : 'From silicon to the factory floor'}
          </h2>
          <p className="mt-3 text-base sm:text-lg text-muted leading-relaxed">
            {isDe
              ? 'Von mikroelektronischem VLSI-Design an der TU Clausthal (Prof. Dr. Christian Siemers) bis zu produktiver industrieller IoT-Observability und automatisiertem Alerting bei der WaDaCon GmbH.'
              : 'From microelectronic VLSI circuit design at TU Clausthal (supervised by Prof. Dr. Christian Siemers) to production industrial IoT observability and automated alerting at WaDaCon GmbH.'}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,320px)] gap-6 items-start">
          <div className="min-w-0 space-y-3">
            <div role="tablist" aria-label={isDe ? 'Visualisierung wählen' : 'Choose a visualisation'} className="flex flex-wrap gap-1 p-1 rounded-xl bg-surface border border-line w-fit max-w-full">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = active === tab.id;
                return (
                  <button
                    key={tab.id}
                    id={`tab-graphic-${tab.id}`}
                    role="tab"
                    aria-selected={isActive}
                    aria-controls="research-visual-panel"
                    onClick={() => {
                      playTactileClick();
                      setActive(tab.id);
                    }}
                    className={`relative inline-flex items-center gap-2 min-h-10 px-3.5 rounded-lg text-sm font-semibold transition-colors ${
                      isActive ? 'text-on-accent' : 'text-muted hover:text-fg'
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="researchTabPill"
                        className="absolute inset-0 rounded-lg bg-accent -z-0"
                        transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                      />
                    )}
                    <Icon className="relative w-4 h-4" aria-hidden="true" />
                    <span className="relative">{tab.label}</span>
                  </button>
                );
              })}
            </div>
            <div id="research-visual-panel" role="tabpanel" aria-labelledby={`tab-graphic-${active}`} className="relative min-h-[360px] overflow-hidden rounded-2xl">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: 14, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -14, scale: 0.98 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                >
                  {active === 'vlsi' && <VLSIIntegratedCircuitGraphic />}
                  {active === 'neural' && <NeuralNetworkCanvas />}
                  {active === 'iot' && <IndustrialIoTMonitor />}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
            {facts.map((f, i) => (
              <motion.div
                key={f.label}
                initial={reduce ? false : { opacity: 0, x: 16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.45, delay: reduce ? 0 : i * 0.08 }}
                className="jd-card jd-card--interactive !p-4"
              >
                <dt className="jd-stat__label">{f.label}</dt>
                <dd className="mt-1 font-display text-xl font-bold text-fg">{f.value}</dd>
                <dd className="text-sm text-subtle">{f.detail}</dd>
              </motion.div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
};
