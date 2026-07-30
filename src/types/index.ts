/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Copyright 2026 Sanjib Bayen
 * https://github.com/SanjibBayen/cf-analytics-pro
 */

export interface Sub {
  id: number;
  problem: { contestId: number; index: string; name: string; rating?: number; tags: string[] };
  verdict?: string;
  creationTimeSeconds: number;
}

export interface Problem {
  id: string;
  contestId: number;
  index: string;
  name: string;
  rating: number;
  tags: string[];
  solved: boolean;
  attempts: number;
  firstAttempt: number;
  lastAttempt: number;
}

export interface TagStat {
  tag: string;
  solved: number;
  unsolved: number;
  total: number;
  rate: number;
  problems: Problem[];
}

