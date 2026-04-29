import { redirect, RedirectType } from 'next/navigation';

export default function AuthIndexPage() {
    redirect('/auth/login', RedirectType.replace);
}
