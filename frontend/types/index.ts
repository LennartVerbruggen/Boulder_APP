export interface Sector {
    sector_id: number;
    sector_karakteristieken: string;
    sector_routes: Route[];
}

export interface Route {
    route_id: number;
    route_sectorId: number;
    route_grade: string;
    route_createdAt: Date;
    route_builders: Builder[];
    route_climbers: Climber[];
}

export interface RouteCreate {
    sectorId: string;
    grade: string;
    builders: string
    id? : number;
    climbers?: Climber[];
    createdAt?: Date;
}

export interface Builder {
    builder_id: number;
    user_name: string;
    user_email: string;
    user_password: string;
    user_routes: Route[];
}

export interface Climber {
    climber_id: number;
    user_name: string;
    user_email: string;
    user_password: string;
    user_routes: Route[];
}