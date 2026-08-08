import * as React from 'react';
export interface ProcessStep { k: string; d: string; }
export interface ProcessStepsProps {
  eyebrow?: string;
  title?: string;
  steps?: ProcessStep[];
}
/**
 * Numbered "how it works" spine (assess, load calc, install, service).
 * @startingPoint section="Sections" subtitle="Numbered process spine" viewport="1140x340"
 */
export function ProcessSteps(props: ProcessStepsProps): JSX.Element;
