// services/reward.js
export function rewardForTier(tier) {
  // 예: 실버(6~10)면 10exp/2coin
  if (tier <= 5)   return { exp:5,  coin:1,  policyVersion:"v1" };   // Bronze
  if (tier <= 10)  return { exp:10, coin:2,  policyVersion:"v1" };   // Silver
  if (tier <= 15)  return { exp:20, coin:3,  policyVersion:"v1" };   // Gold
  if (tier <= 20)  return { exp:35, coin:5,  policyVersion:"v1" };   // Platinum
  return { exp:0, coin:0, policyVersion:"v1" };
}