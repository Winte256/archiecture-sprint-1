import React from 'react';
const HostApp = React.lazy(() => import('host/App'));

function App() {
  return (
    <React.Suspense>
      <HostApp />
    </React.Suspense>
  );
}

export default App;
