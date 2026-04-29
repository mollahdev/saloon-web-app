import { redirect, RedirectType } from 'next/navigation';

export default function AdminIndex() {
    redirect('/admin/appointments', RedirectType.replace);
}
