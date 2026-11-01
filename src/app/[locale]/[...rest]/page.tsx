import { notFound } from "next/navigation";

// Catch-all so unknown localized paths render [locale]/not-found.tsx
const CatchAllPage = () => notFound();

export default CatchAllPage;
