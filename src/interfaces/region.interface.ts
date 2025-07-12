export interface Region {
    id: number;
    name: string;
    status: boolean;
    municipalities: Municipality[];
}

export interface Municipality {
    id: number;
    name: string;
    status: boolean;
    regionId: number;
}