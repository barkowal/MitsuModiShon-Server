export function parseDuration(duration: string) {
    const regex = /(\d+)([smhd])/g;
    let totalMilliseconds = 0;
    let match;

    while ((match = regex.exec(duration)) !== null) {
        const value = parseInt(match[1], 10);
        const unit = match[2];

        switch (unit) {
            case "s": // seconds
                totalMilliseconds += value * 1000;
                break;
            case "m": // minutes
                totalMilliseconds += value * 60 * 1000;
                break;
            case "h": // hours
                totalMilliseconds += value * 60 * 60 * 1000;
                break;
            case "d": // days
                totalMilliseconds += value * 24 * 60 * 60 * 1000;
                break;
            default:
                break;
        }
    }

    return totalMilliseconds;
}
