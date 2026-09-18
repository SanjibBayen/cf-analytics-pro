/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Copyright 2026 Sanjib Bayen
 * https://github.com/SanjibBayen/cf-analytics-pro
 */

import type { ApiSubmission, Problem, TagStat } from './types';

export function processSubmissions(subs: ApiSubmission[]): Problem[] {
  const map = new Map<string, Problem>();
  const sorted = [...subs].sort((a, b) => a.creationTimeSeconds - b.creationTimeSeconds);

  for (const s of sorted) {
    const cid = s.problem.contestId || 0;
    const id = cid + '-' + s.problem.index;

    let p = map.get(id);
    if (!p) {
      p = {
        id,
        contestId: cid,
        index: s.problem.index,
        name: s.problem.name,
        rating: s.problem.rating ?? 0,
        tags: s.problem.tags,
        solved: false,
        attempts: 0,
        firstAttempt: s.creationTimeSeconds,
        lastAttempt: s.creationTimeSeconds,
      };
      map.set(id, p);
    }

    p.attempts++;
    if (s.creationTimeSeconds > p.lastAttempt) p.lastAttempt = s.creationTimeSeconds;
    if (s.verdict === 'OK') p.solved = true;
  }

  return Array.from(map.values());
}

export function countSolved(problems: Problem[]): number {
  let n = 0;
  for (const p of problems) if (p.solved) n++;
  return n;
}

export function countUnsolved(problems: Problem[]): number {
  let n = 0;
  for (const p of problems) if (!p.solved && p.attempts > 0) n++;
  return n;
}

export function buildTagStats(problems: Problem[]): TagStat[] {
  const map = new Map<string, Problem[]>();

  for (const p of problems) {
    if (p.attempts === 0) continue;
    for (const tag of p.tags) {
      let list = map.get(tag);
      if (!list) {
        list = [];
        map.set(tag, list);
      }
      list.push(p);
    }
  }

  const result: TagStat[] = [];
  map.forEach((probs, tag) => {
    let solved = 0;
    for (const p of probs) if (p.solved) solved++;
    const total = probs.length;
    result.push({
      tag,
      solved,
      unsolved: total - solved,
      total,
      rate: total > 0 ? (solved / total) * 100 : 0,
      problems: probs,
    });
  });

  result.sort((a, b) => b.total - a.total);
  return result;
}
