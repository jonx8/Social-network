export function formatDate(date) {
    return (date.toISOString().slice(0, 16).replace('T', ' в '));
}

export function dateComparator(a, b) {
    return Date.parse(a) - Date.parse(b)
}