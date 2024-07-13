import React from 'react';

const Profile = React.lazy(() => import('profile/Profile').catch(() => {
  return { default: () => <>Profile is not available!</> };
}));
const Places = React.lazy(() => import('places/Places').catch(() => {
  return { default: () => <>Places is not available!</> };
}));

export default function MainContent() {
  return (
    <main className="content">
      <React.Suspense fallback={'Profile Loading'}>
        <Profile />
      </React.Suspense>
      <React.Suspense fallback={'Profile Loading'}>
        <Places />
      </React.Suspense>
    </main>
  );
}
