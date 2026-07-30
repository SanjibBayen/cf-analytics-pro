/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Copyright 2026 Sanjib Bayen
 * https://github.com/SanjibBayen/cf-analytics-pro
 */

import type { Sub, Problem, TagStat } from '@/types';

export function processSubmissions(subs: Sub[]): Problem[] {
  const map = new Map<string, Problem>();
  const sorted = [...subs].sort((a, b) => a.creationTimeSeconds - b.creationTimeSeconds);
  
  for (const s of sorted) {
    const id = s.problem.contestId + '-' + s.problem.index;
    
    if (!map.has(id)) {
      map.set(id, {
        id,
        contestId: s.problem.contestId,
        index: s.problem.index,
        name: s.problem.name,
        rating: s.problem.rating ?? 0,
        tags: s.problem.tags,
        solved: false,
        attempts: 0,
        firstAttempt: s.creationTimeSeconds,
        lastAttempt: s.creationTimeSeconds,
      });
    }
    
    const p = map.get(id)!;
    p.attempts++;
    p.lastAttempt = Math.max(p.lastAttempt, s.creationTimeSeconds);
    
    if (s.verdict === 'OK') {
      p.solved = true;
    }
  }
  
  return Array.from(map.values());
}

export function getSolvedCount(problems: Problem[]): number {
  // Only count unique problems that are solved AND have been attempted
  return problems.filter((p) => p.solved && p.attempts > 0).length;
}

export function getUnsolvedCount(problems: Problem[]): number {
  return problems.filter((p) => !p.solved && p.attempts > 0).length;
}

export function getTotalUnique(problems: Problem[]): number {
  return problems.filter((p) => p.attempts > 0).length;
}

export function buildTagStats(problems: Problem[]): TagStat[] {
  const map = new Map<string, Problem[]>();
  
  for (const p of problems) {
    if (p.attempts === 0) continue;
    for (const tag of p.tags) {
      if (!map.has(tag)) map.set(tag, []);
      map.get(tag)!.push(p);
    }
  }
  
  return Array.from(map.entries())
    .map(([tag, probs]) => {
      const solved = probs.filter((p) => p.solved).length;
      const unsolved = probs.filter((p) => !p.solved).length;
      const total = probs.length;
      
      return {
        tag,
        solved,
        unsolved,
        total,
        rate: total > 0 ? (solved / total) * 100 : 0,
        problems: probs,
      };
    })
    .sort((a, b) => b.total - a.total);
}

