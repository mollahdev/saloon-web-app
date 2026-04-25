'use clients';
import type { PropsWithChildren } from 'react';

export default function AdminLayout(props: PropsWithChildren) {
  return (
    <div>
      <h2>From Layout</h2>
      {props.children}
    </div>
  );
}
