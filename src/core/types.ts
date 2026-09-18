/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Copyright 2026 Sanjib Bayen
 * https://github.com/SanjibBayen/cf-analytics-pro
 */

// ============================================================
// Codeforces API types
// ============================================================

export interface ApiSubmission {
  id: number;
  problem: {
    contestId: number;
    index: string;
    name: string;
    rating?: number;
    tags: string[];
  };
  verdict?: string;
  creationTimeSeconds: number;
}

export interface ApiResponse {
  status: string;
  result?: ApiSubmission[];
  comment?: string;
}

export interface ApiUserInfo {
  handle: string;
  rating?: number;
  maxRating?: number;
  rank?: string;
  maxRank?: string;
  country?: string;
  organization?: string;
}
// ============================================================
// Processed types
// ============================================================

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

// ============================================================
// Feature types
// ============================================================

export type ProblemSite = 'problemset' | 'contest' | 'gym';

export interface ProblemContext {
  id: string;
  contestId: number;
  index: string;
  type: ProblemSite;
}

export interface LastProblem extends ProblemContext {
  timestamp: number;
}

export interface Settings {
  ratings: boolean;
  tags: boolean;
  weak: boolean;
  unsolved: boolean;
  smartSubmit: boolean;
}
