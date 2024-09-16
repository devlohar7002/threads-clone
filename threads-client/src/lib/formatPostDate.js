export default function formatPostDate(createdAt) {
    const postDate = new Date(createdAt);
    const now = new Date();
    const msPerMinute = 60 * 1000;
    const msPerHour = msPerMinute * 60;
    const msPerDay = msPerHour * 24;
    const msPerWeek = msPerDay * 7;

    const elapsed = now - postDate;

    // Just now (less than 1 minute)
    if (elapsed < msPerMinute) {
        return 'just now';
    }

    // Less than 1 hour ago
    if (elapsed < msPerHour) {
        return Math.round(elapsed / msPerMinute) + ' minutes ago';
    }

    // Same day check
    if (now.toDateString() === postDate.toDateString()) {
        return Math.round(elapsed / msPerHour) + ' hours ago';
    }

    // Same week check
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(startOfToday - (startOfToday.getDay() * msPerDay));
    const postStartOfDay = new Date(postDate.getFullYear(), postDate.getMonth(), postDate.getDate());

    if (postStartOfDay >= startOfWeek) {
        const daysAgo = Math.floor(elapsed / msPerDay);
        return daysAgo + 1 + (daysAgo + 1 === 1 ? ' day ago' : ' days ago');
    }

    // Older than this week
    return postDate.toLocaleDateString('en-GB');  // Formats as dd/mm/yyyy
}

