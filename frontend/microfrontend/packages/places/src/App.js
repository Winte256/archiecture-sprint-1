import React from 'react';
const Shell = React.lazy(() => import('shell/Shell'));

function App() {
  return (
    <React.Suspense fallback={'Loading'}>
      <Shell />
    </React.Suspense>
  );
}

export default App;
