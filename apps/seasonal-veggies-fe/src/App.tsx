import { useEffect, useState } from "react";

import { PageContainer } from "@/components/shared/page-container";
import { CropList } from "@/components/shared/crop-list";

import { getAllCrops } from "./services/cropService.ts";

import type { Crop } from "./types.ts";

const LABELS = {
  loading: "Cargando",
  loadingError: "No se pudo cargar la lista.",
};

function App() {
  const [crops, setCrops] = useState<Crop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    getAllCrops()
      .then((data) => {
        if (!cancelled) setCrops(data);
      })
      .catch(() => {
        if (!cancelled) setError(LABELS.loadingError);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // TODO: display loading and error labels instead of CropList, maintaining always the page layout and the Season Veggies title
  if (loading) return <p>{LABELS.loading}...</p>;
  if (error) return <p>{error}</p>;

  return (
    <PageContainer>
      <div className="my-4">
        <h1 className="text-3xl font-bold underline">Seasonal Veggies</h1>
      </div>

      <CropList crops={crops} />
    </PageContainer>
  );
}

export default App;
