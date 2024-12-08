import { Socials } from '../../../declarations/nekotip_backend/nekotip_backend.did';

/* eslint-disable no-unused-vars */
export interface ISerializedUser {
  id: string;
  bio: string | null;
  categories: string[];
  referralCode: string;
  username: string;
  name: string | null;
  createdAt: number;
  socials: Socials | null;
  depositAddress: string;
  referredBy: string | null;
  bannerPic: string | null;
  followersCount: number;
  followingCount: number;
  referralsCount: number;
  profilePic: string | null;
}

export enum EnumContentTier {
  Free = 'FREE',
  Tier1 = 'TIER 1',
  Tier2 = 'TIER 2',
  Tier3 = 'TIER 3',
}
