import Image from 'next/image';

export function HeroHeader() {
    return (
        <header className="relative w-full h-[220px] sm:h-[260px] md:h-[280px] bg-black overflow-hidden flex items-center justify-center shadow-lg select-none">
            {/* Background image */}
            <div className="absolute inset-0 w-full h-full">
                <Image
                    src="/images/hero-background.png"
                    alt="Big Apple Barbershop Background"
                    fill
                    priority
                    sizes="100vw"
                    className="object-cover object-center brightness-90 contrast-110"
                />
                {/* Subtle dark gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 pointer-events-none" />
            </div>

            {/* Centered White Logo */}
            <div className="relative z-10 flex items-center justify-center p-4">
                <div className="w-[240px] sm:w-[300px] md:w-[350px] drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)]">
                    <Image
                        src="/images/white-logo.png"
                        alt="Big Apple Barbers - Haircut & Shave"
                        width={350}
                        height={140}
                        priority
                        className="w-full h-auto object-contain"
                    />
                </div>
            </div>
        </header>
    );
}
