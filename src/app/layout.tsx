import "@/styles/globals.css";
import "leaflet/dist/leaflet.css";

interface RootLayoutProps {
  children: React.ReactNode;
}

// <html> and <body> live in [locale]/layout.tsx so `lang` can be set per locale.
const RootLayout = ({ children }: RootLayoutProps) => children;

export default RootLayout;
