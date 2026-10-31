import { PageContainer } from "@/components/shared/page-container";
import { CropList } from "@/components/shared/crop-list";

import { useCrops } from "./hooks/useCrops";

const LABELS = {
  loading: "Cargando",
  loadingError: "No se pudo cargar la lista.",
};

function App() {
  const cropsQuery = useCrops();

  // TODO: display loading and error labels instead of CropList, maintaining always the page layout and the Season Veggies title
  if (cropsQuery.isPending) return <p>{LABELS.loading}...</p>;
  if (cropsQuery.isError) return <p>{LABELS.loadingError}</p>;

  return (
    <PageContainer>
      <div className="my-4">
        <h1 className="text-3xl font-bold underline">Seasonal Veggies</h1>
      </div>

      <CropList crops={cropsQuery.data} />
    </PageContainer>
  );
}

export default App;
