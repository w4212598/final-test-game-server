export interface Game {
    id: number;
    name: string;
    provider: number;
    cover: string;
    coverLarge: string;
    date: string;
}

export interface Provider {
    id: number;
    name: string;
    logo: string;
}

export interface Group {
    id: number;
    name: string;
    games: number[];
}

export interface GameData {
    games: Game[];
    providers: Provider[];
    groups: Group[];
}

export interface User {
    username: string;
    password: string;
}

export interface FiltersParams {
    name?: string;
    providerIds?: number[];
    groupId?: number;
    sortBy?: 'name-asc' | 'name-desc' | 'date-desc';
}
