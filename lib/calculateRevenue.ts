/**
 * calculateRevenue
 * -----------------
 * Pure function behind UNBOX's own pricing simulator. Given a total user
 * count, a tier-mix split, and a price per tier, returns total monthly and
 * annual revenue.
 *
 * This is deterministic math, not simulated AI output — unlike
 * generateCoreBrief() and generateResearchBrief(), there is no "Simulated AI
 * Output" label on this feature because nothing here is standing in for an
 * AI call. It's just arithmetic over the inputs the visitor provides.
 *
 * Annual pricing carries a real discount: pay for 10 months, get 12
 * (annualPrice = monthlyPrice * 10), not a flat monthlyPrice * 12. This is
 * the rule the two required pricing-logic tests exist to verify.
 */

import { TierId } from "./pricingData";

export interface RevenueInput {
  totalUsers: number;
  tierMix: Record<TierId, number>; // percents, should sum to 100
  tierPrices: Record<TierId, number>; // monthly price per tier, USD
}

export interface RevenueOutput {
  monthlyRevenue: number;
  annualRevenue: number;
  perTier: Record<TierId, { users: number; monthlyRevenue: number; annualRevenue: number }>;
}

const TIER_IDS: TierId[] = ["sample", "run", "line"];

export function annualPriceFor(monthlyPrice: number): number {
  return monthlyPrice * 10;
}

export function calculateRevenue(input: RevenueInput): RevenueOutput {
  const { totalUsers, tierMix, tierPrices } = input;

  let monthlyRevenue = 0;
  let annualRevenue = 0;
  const perTier = {} as RevenueOutput["perTier"];

  for (const tierId of TIER_IDS) {
    const mixPct = tierMix[tierId] ?? 0;
    const monthlyPrice = tierPrices[tierId] ?? 0;
    const users = Math.round(totalUsers * (mixPct / 100));
    const tierMonthlyRevenue = users * monthlyPrice;
    const tierAnnualRevenue = users * annualPriceFor(monthlyPrice);

    perTier[tierId] = {
      users,
      monthlyRevenue: tierMonthlyRevenue,
      annualRevenue: tierAnnualRevenue,
    };

    monthlyRevenue += tierMonthlyRevenue;
    annualRevenue += tierAnnualRevenue;
  }

  return { monthlyRevenue, annualRevenue, perTier };
}
