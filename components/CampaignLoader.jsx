'use client';

import dynamic from 'next/dynamic';

// The campaign UI and rules are fetched as a separate script only when this component is rendered, which
// app/layout.jsx does only while at least one campaign is active. Otherwise no campaign code reaches
// the browser at all.
const CampaignHost = dynamic(() => import('@/components/CampaignHost'), { ssr: false });

export default function CampaignLoader({ campaigns }) {
  return <CampaignHost campaigns={campaigns} />;
}
