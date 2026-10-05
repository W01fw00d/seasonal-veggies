import { PageContainer } from "@/components/shared/page-container";
import { VeggieList } from "@/components/shared/veggie-list";

function App() {
  return (
    <PageContainer>
      <div className="my-4">
        <h1 className="text-3xl font-bold underline">Seasonal Veggies</h1>
      </div>

      <VeggieList />
    </PageContainer>
  );
}

export default App;
