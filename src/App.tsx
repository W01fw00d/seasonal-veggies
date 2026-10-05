import { useState } from "react";

import { Button } from "@/components/ui/button";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <section>
        <h1 className="text-3xl font-bold underline">Seasonal Veggies</h1>
      </section>

      <section>
        <Button className="mt-2" onClick={() => setCount((count) => count + 1)}>
          Count is {count}
        </Button>
      </section>
    </>
  );
}

export default App;
