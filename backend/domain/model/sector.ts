import { Route } from './route';

export class Sector {

    private sector_id: number;
    private sector_karakteristieken: String;
    private sector_routes: Route[];

    constructor(sector_id: number, karakteristieken: String, routes: Route[]) {
        this.sector_id = sector_id;
        this.sector_karakteristieken = karakteristieken;
        this.sector_routes = routes;
    }

    get id(): number {
        return this.sector_id;
    }

    set id(value: number) {
        this.sector_id = value;
    }

    get karakteristieken(): String {
        return this.sector_karakteristieken;
    }

    set karakteristieken(karakteristieken: String) {
        this.sector_karakteristieken = karakteristieken;
    }

    get routes(): Route[] {
        return this.sector_routes;
    }

    set routes(routes: Route[]) {
        this.sector_routes = routes;
    }

    static from(sector: Sector){
        //console.log(sector.id, sector.karakteristieken, sector.routes);
        return new Sector(sector.id, sector.karakteristieken, sector.routes);
    }
}