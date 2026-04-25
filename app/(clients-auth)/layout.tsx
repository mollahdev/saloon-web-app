import type { PropsWithChildren } from 'react';

export default function ClientsLayout(props: PropsWithChildren) {
  return (
    <div>
      <h2>Client Layout</h2>
      {props.children}
    </div>
  );
}
