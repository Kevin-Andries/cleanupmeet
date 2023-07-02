const UID_REGEX =
    /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;

export function getEventIdentifierForPrisma(eventIdOrSlug: string) {
    const isUID = UID_REGEX.test(eventIdOrSlug);

    if (isUID) {
        return { id: eventIdOrSlug };
    }

    return { slug: eventIdOrSlug };
}
