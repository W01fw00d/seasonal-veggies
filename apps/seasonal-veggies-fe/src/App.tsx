import { PageContainer } from "@/components/shared/page-container";
import { CropList } from "@/components/shared/crop-list";

import { useCrops } from "./hooks/useCrops";

const LABELS = {
  loading: "Cargando",
  loadingError: "No se pudo cargar la lista. Pruebe a recargar la página.",
};

function App() {
  const cropsQuery = useCrops();

  return (
    <PageContainer>
      <div className="my-4">
        <h1 className="text-3xl font-bold underline">Seasonal Veggies</h1>
      </div>

      {cropsQuery.isPending ? (
        <p>{LABELS.loading}...</p>
      ) : cropsQuery.isError ? (
        <p>{LABELS.loadingError}</p>
      ) : (
        <CropList crops={cropsQuery.data} />
      )}
    </PageContainer>
  );
}

export default App;
