/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      { source: '/public/:path*', destination: '/:path*' },
    ];
  },
  async redirects() { return [
  {
    "source": "/admin/dashboard.html",
    "destination": "/admin/dashboard",
    "permanent": true
  },
  {
    "source": "/admin/index.html",
    "destination": "/admin",
    "permanent": true
  },
  {
    "source": "/admin.html",
    "destination": "/admin",
    "permanent": true
  },
  {
    "source": "/dashboard.html",
    "destination": "/dashboard",
    "permanent": true
  },
  {
    "source": "/events/ice-bath-experience.html",
    "destination": "/events/ice-bath-experience",
    "permanent": true
  },
  {
    "source": "/events/ice-bath.html",
    "destination": "/events/ice-bath",
    "permanent": true
  },
  {
    "source": "/events/nature-chocolate.html",
    "destination": "/events/nature-chocolate",
    "permanent": true
  },
  {
    "source": "/events/sound-healing.html",
    "destination": "/events/sound-healing",
    "permanent": true
  },
  {
    "source": "/events.html",
    "destination": "/local-retreats",
    "permanent": true
  },
  {
    "source": "/events",
    "destination": "/local-retreats",
    "permanent": true
  },
  {
    "source": "/events/:path*",
    "destination": "/local-retreats",
    "permanent": true
  },
  {
    "source": "/experiences",
    "destination": "/local-retreats",
    "permanent": false
  },
  {
    "source": "/inner-retreats",
    "destination": "/local-retreats",
    "permanent": true
  },
  {
    "source": "/inner-retreats/:path*",
    "destination": "/local-retreats",
    "permanent": true
  },
  {
    "source": "/mountain-voice-registration.html",
    "destination": "/mountain-voice-registration",
    "permanent": true
  },
  {
    "source": "/nawal.html",
    "destination": "/nawal",
    "permanent": true
  },
  {
    "source": "/register/ice-bath.html",
    "destination": "/register/ice-bath",
    "permanent": true
  },
  {
    "source": "/register/mountain-voice.html",
    "destination": "/register/mountain-voice",
    "permanent": true
  },
  {
    "source": "/register/wadi-rum.html",
    "destination": "/register/wadi-rum",
    "permanent": true
  },
  {
    "source": "/retreat-dahab.html",
    "destination": "/retreat-dahab",
    "permanent": true
  },
  {
    "source": "/retreat-wadi-rum.html",
    "destination": "/retreat-wadi-rum",
    "permanent": true
  },
  {
    "source": "/retreat.html",
    "destination": "/retreat",
    "permanent": true
  },
  {
    "source": "/retreats/dahab.html",
    "destination": "/retreats/dahab",
    "permanent": true
  },
  {
    "source": "/retreats/wadi-rum.html",
    "destination": "/retreats/wadi-rum",
    "permanent": true
  },
  {
    "source": "/retreats/zanzibar.html",
    "destination": "/retreats/zanzibar",
    "permanent": true
  },
  {
    "source": "/retreats.html",
    "destination": "/retreats",
    "permanent": true
  },
  {
    "source": "/wadi-rum-registration.html",
    "destination": "/wadi-rum-registration",
    "permanent": true
  },
  {
    "source": "/workshops/al-tira.html",
    "destination": "/workshops/al-tira",
    "permanent": true
  },
  {
    "source": "/workshops/haifa.html",
    "destination": "/workshops/haifa",
    "permanent": true
  },
  {
    "source": "/workshops/jiva.html",
    "destination": "/workshops/jiva",
    "permanent": true
  },
  {
    "source": "/zanzibar-retreat-review-nw2606.html",
    "destination": "/zanzibar-retreat-review-nw2606",
    "permanent": true
  },
  {
    "source": "/Zanzibar.html",
    "destination": "/Zanzibar",
    "permanent": true
  },
  {
    "source": "/shop.html",
    "destination": "/",
    "permanent": true
  },
  {
    "source": "/shop",
    "destination": "/",
    "permanent": false
  },
  {
    "source": "/shop/thanks",
    "destination": "/",
    "permanent": false
  },
  {
    "source": "/feedback/index.html",
    "destination": "/feedback",
    "permanent": true
  },
  {
    "source": "/feedback/dahab.html",
    "destination": "/feedback/dahab",
    "permanent": true
  },
  {
    "source": "/feedback/wadi-rum.html",
    "destination": "/feedback/wadi-rum",
    "permanent": true
  },
  {
    "source": "/feedback/zanzibar.html",
    "destination": "/feedback/zanzibar",
    "permanent": true
  },
  {
    "source": "/feedback/sound-healing.html",
    "destination": "/feedback/sound-healing",
    "permanent": true
  },
  {
    "source": "/feedback/nature-chocolate.html",
    "destination": "/feedback/nature-chocolate",
    "permanent": true
  },
  {
    "source": "/feedback/feedback-ice.html",
    "destination": "/feedback/ice-bath",
    "permanent": true
  },
  {
    "source": "/feedback/ice-bath.html",
    "destination": "/feedback/ice-bath",
    "permanent": true
  },
]; },
};
export default nextConfig;
