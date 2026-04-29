'use client';
import { useState } from 'react';
import { useAppDispatch } from '@/app/lib/store';
import { logoutAction } from '@/app/lib/store/auth-slice/auth-action';

export default function Appointments() {
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useAppDispatch();

    const handleLogout = () => {
        setIsLoading(true);
        dispatch(logoutAction())
            .unwrap()
            .then(() => {
                setIsLoading(false);
                // reload
                window.location.reload();
            })
            .catch(() => {
                setIsLoading(false);
            });
    };

    return (
        <div>
            <button
                onClick={handleLogout}
                disabled={isLoading}
                className="bg-black text-white px-5 py-2 cursor-pointer"
            >
                {isLoading ? 'Loading...' : 'Logout'}
            </button>
            <h1>Admin Panel</h1>
            <h1>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquam officiis doloremque
                nisi sit, expedita totam, eos voluptates voluptate voluptatem temporibus repellat
                necessitatibus amet rerum in, numquam quod cumque. Natus, aperiam. Lorem ipsum dolor
                sit amet consectetur adipisicing elit. Aliquam officiis doloremque nisi sit,
                expedita totam, eos voluptates voluptate voluptatem temporibus repellat
                necessitatibus amet rerum in, numquam quod cumque. Natus, aperiam. Lorem ipsum dolor
                sit amet consectetur adipisicing elit. Aliquam officiis doloremque nisi sit,
                expedita totam, eos voluptates voluptate voluptatem temporibus repellat
                necessitatibus amet rerum in, numquam quod cumque. Natus, aperiam. Lorem ipsum dolor
                sit amet consectetur adipisicing elit. Aliquam officiis doloremque nisi sit,
                expedita totam, eos voluptates voluptate voluptatem temporibus repellat
                necessitatibus amet rerum in, numquam quod cumque. Natus, aperiam. Lorem ipsum dolor
                sit amet consectetur adipisicing elit. Aliquam officiis doloremque nisi sit,
                expedita totam, eos voluptates voluptate voluptatem temporibus repellat
                necessitatibus amet rerum in, numquam quod cumque. Natus, aperiam. Lorem ipsum dolor
                sit amet consectetur adipisicing elit. Aliquam officiis doloremque nisi sit,
                expedita totam, eos voluptates voluptate voluptatem temporibus repellat
                necessitatibus amet rerum in, numquam quod cumque. Natus, aperiam. Lorem ipsum dolor
                sit amet consectetur adipisicing elit. Aliquam officiis doloremque nisi sit,
                expedita totam, eos voluptates voluptate voluptatem temporibus repellat
                necessitatibus amet rerum in, numquam quod cumque. Natus, aperiam. Lorem ipsum dolor
                sit amet consectetur adipisicing elit. Aliquam officiis doloremque nisi sit,
                expedita totam, eos voluptates voluptate voluptatem temporibus repellat
                necessitatibus amet rerum in, numquam quod cumque. Natus, aperiam. Lorem ipsum dolor
                sit amet consectetur adipisicing elit. Aliquam officiis doloremque nisi sit,
                expedita totam, eos voluptates voluptate voluptatem temporibus repellat
                necessitatibus amet rerum in, numquam quod cumque. Natus, aperiam. Lorem ipsum dolor
                sit amet consectetur adipisicing elit. Aliquam officiis doloremque nisi sit,
                expedita totam, eos voluptates voluptate voluptatem temporibus repellat
                necessitatibus amet rerum in, numquam quod cumque. Natus, aperiam. Lorem ipsum dolor
                sit amet consectetur adipisicing elit. Aliquam officiis doloremque nisi sit,
                expedita totam, eos voluptates voluptate voluptatem temporibus repellat
                necessitatibus amet rerum in, numquam quod cumque. Natus, aperiam. Lorem ipsum dolor
                sit amet consectetur adipisicing elit. Aliquam officiis doloremque nisi sit,
                expedita totam, eos voluptates voluptate voluptatem temporibus repellat
                necessitatibus amet rerum in, numquam quod cumque. Natus, aperiam. Lorem ipsum dolor
                sit amet consectetur adipisicing elit. Aliquam officiis doloremque nisi sit,
                expedita totam, eos voluptates voluptate voluptatem temporibus repellat
                necessitatibus amet rerum in, numquam quod cumque. Natus, aperiam. Lorem ipsum dolor
                sit amet consectetur adipisicing elit. Aliquam officiis doloremque nisi sit,
                expedita totam, eos voluptates voluptate voluptatem temporibus repellat
                necessitatibus amet rerum in, numquam quod cumque. Natus, aperiam. Lorem ipsum dolor
                sit amet consectetur adipisicing elit. Aliquam officiis doloremque nisi sit,
                expedita totam, eos voluptates voluptate voluptatem temporibus repellat
                necessitatibus amet rerum in, numquam quod cumque. Natus, aperiam. Lorem ipsum dolor
                sit amet consectetur adipisicing elit. Aliquam officiis doloremque nisi sit,
                expedita totam, eos voluptates voluptate voluptatem temporibus repellat
                necessitatibus amet rerum in, numquam quod cumque. Natus, aperiam. Lorem ipsum dolor
                sit amet consectetur adipisicing elit. Aliquam officiis doloremque nisi sit,
                expedita totam, eos voluptates voluptate voluptatem temporibus repellat
                necessitatibus amet rerum in, numquam quod cumque. Natus, aperiam. Lorem ipsum dolor
                sit amet consectetur adipisicing elit. Aliquam officiis doloremque nisi sit,
                expedita totam, eos voluptates voluptate voluptatem temporibus repellat
                necessitatibus amet rerum in, numquam quod cumque. Natus, aperiam. Lorem ipsum dolor
                sit amet consectetur adipisicing elit. Aliquam officiis doloremque nisi sit,
                expedita totam, eos voluptates voluptate voluptatem temporibus repellat
                necessitatibus amet rerum in, numquam quod cumque. Natus, aperiam. Lorem ipsum dolor
                sit amet consectetur adipisicing elit. Aliquam officiis doloremque nisi sit,
                expedita totam, eos voluptates voluptate voluptatem temporibus repellat
                necessitatibus amet rerum in, numquam quod cumque. Natus, aperiam. Lorem ipsum dolor
                sit amet consectetur adipisicing elit. Aliquam officiis doloremque nisi sit,
                expedita totam, eos voluptates voluptate voluptatem temporibus repellat
                necessitatibus amet rerum in, numquam quod cumque. Natus, aperiam. Lorem ipsum dolor
                sit amet consectetur adipisicing elit. Aliquam officiis doloremque nisi sit,
                expedita totam, eos voluptates voluptate voluptatem temporibus repellat
                necessitatibus amet rerum in, numquam quod cumque. Natus, aperiam. Lorem ipsum dolor
                sit amet consectetur adipisicing elit. Aliquam officiis doloremque nisi sit,
                expedita totam, eos voluptates voluptate voluptatem temporibus repellat
                necessitatibus amet rerum in, numquam quod cumque. Natus, aperiam. Lorem ipsum dolor
                sit amet consectetur adipisicing elit. Aliquam officiis doloremque nisi sit,
                expedita totam, eos voluptates voluptate voluptatem temporibus repellat
                necessitatibus amet rerum in, numquam quod cumque. Natus, aperiam. Lorem ipsum dolor
                sit amet consectetur adipisicing elit. Aliquam officiis doloremque nisi sit,
                expedita totam, eos voluptates voluptate voluptatem temporibus repellat
                necessitatibus amet rerum in, numquam quod cumque. Natus, aperiam. Lorem ipsum dolor
                sit amet consectetur adipisicing elit. Aliquam officiis doloremque nisi sit,
                expedita totam, eos voluptates voluptate voluptatem temporibus repellat
                necessitatibus amet rerum in, numquam quod cumque. Natus, aperiam. Lorem ipsum dolor
                sit amet consectetur adipisicing elit. Aliquam officiis doloremque nisi sit,
                expedita totam, eos voluptates voluptate voluptatem temporibus repellat
                necessitatibus amet rerum in, numquam quod cumque. Natus, aperiam. Lorem ipsum dolor
                sit amet consectetur adipisicing elit. Aliquam officiis doloremque nisi sit,
                expedita totam, eos voluptates voluptate voluptatem temporibus repellat
                necessitatibus amet rerum in, numquam quod cumque. Natus, aperiam. Lorem ipsum dolor
                sit amet consectetur adipisicing elit. Aliquam officiis doloremque nisi sit,
                expedita totam, eos voluptates voluptate voluptatem temporibus repellat
                necessitatibus amet rerum in, numquam quod cumque. Natus, aperiam. Lorem ipsum dolor
                sit amet consectetur adipisicing elit. Aliquam officiis doloremque nisi sit,
                expedita totam, eos voluptates voluptate voluptatem temporibus repellat
                necessitatibus amet rerum in, numquam quod cumque. Natus, aperiam. Lorem ipsum dolor
                sit amet consectetur adipisicing elit. Aliquam officiis doloremque nisi sit,
                expedita totam, eos voluptates voluptate voluptatem temporibus repellat
                necessitatibus amet rerum in, numquam quod cumque. Natus, aperiam. Lorem ipsum dolor
                sit amet consectetur adipisicing elit. Aliquam officiis doloremque nisi sit,
                expedita totam, eos voluptates voluptate voluptatem temporibus repellat
                necessitatibus amet rerum in, numquam quod cumque. Natus, aperiam. Lorem ipsum dolor
                sit amet consectetur adipisicing elit. Aliquam officiis doloremque nisi sit,
                expedita totam, eos voluptates voluptate voluptatem temporibus repellat
                necessitatibus amet rerum in, numquam quod cumque. Natus, aperiam. Lorem ipsum dolor
                sit amet consectetur adipisicing elit. Aliquam officiis doloremque nisi sit,
                expedita totam, eos voluptates voluptate voluptatem temporibus repellat
                necessitatibus amet rerum in, numquam quod cumque. Natus, aperiam. Lorem ipsum dolor
                sit amet consectetur adipisicing elit. Aliquam officiis doloremque nisi sit,
                expedita totam, eos voluptates voluptate voluptatem temporibus repellat
                necessitatibus amet rerum in, numquam quod cumque. Natus, aperiam. Lorem ipsum dolor
                sit amet consectetur adipisicing elit. Aliquam officiis doloremque nisi sit,
                expedita totam, eos voluptates voluptate voluptatem temporibus repellat
                necessitatibus amet rerum in, numquam quod cumque. Natus, aperiam. Lorem ipsum dolor
                sit amet consectetur adipisicing elit. Aliquam officiis doloremque nisi sit,
                expedita totam, eos voluptates voluptate voluptatem temporibus repellat
                necessitatibus amet rerum in, numquam quod cumque. Natus, aperiam. Lorem ipsum dolor
                sit amet consectetur adipisicing elit. Aliquam officiis doloremque nisi sit,
                expedita totam, eos voluptates voluptate voluptatem temporibus repellat
                necessitatibus amet rerum in, numquam quod cumque. Natus, aperiam. Lorem ipsum dolor
                sit amet consectetur adipisicing elit. Aliquam officiis doloremque nisi sit,
                expedita totam, eos voluptates voluptate voluptatem temporibus repellat
                necessitatibus amet rerum in, numquam quod cumque. Natus, aperiam. Lorem ipsum dolor
                sit amet consectetur adipisicing elit. Aliquam officiis doloremque nisi sit,
                expedita totam, eos voluptates voluptate voluptatem temporibus repellat
                necessitatibus amet rerum in, numquam quod cumque. Natus,
            </h1>
        </div>
    );
}
