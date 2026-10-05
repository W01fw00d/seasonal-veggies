import { useState } from "react";

import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/shared/page-container";

function App() {
  const [count, setCount] = useState(0);

  return (
    <PageContainer>
      <h1 className="text-3xl font-bold underline">Seasonal Veggies</h1>

      <Button className="mt-2" onClick={() => setCount((count) => count + 1)}>
        Count is {count}
      </Button>
    </PageContainer>
  );
}

export default App;
