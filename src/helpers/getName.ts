export const getNameFromId = (existingValues: Record<string, any>[], id: number | null, type: string): string | null => {
    if(id === null) return null;
    const entry = existingValues.find(item => item[type] === id);
    return entry ? entry.name : null;
};
