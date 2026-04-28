export const detectDevice = () => {
    if (typeof window === 'undefined') {
        return 'desktop';
    }
    const width = window.innerWidth;
    if (width < 768) {
        return 'mobile';
    } else if (width < 1024) {
        return 'tablet';
    } else {
        return 'desktop';
    }
};
