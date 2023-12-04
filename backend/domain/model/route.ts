import { Climber } from "./climber";
import { Builder} from "./builder";

export class Route {
    private route_id: number;
    private route_sectorId: number;
    private route_grade: string;
    private route_createdAt: Date;
    private route_builders: Builder[];
    private route_climbers: Climber[];

    constructor(route_sectorId: number, route_grade: string, route_createdAt: Date, route_builders: Builder[], route_climbers?: Climber[], route_id?: number) {
        this.id = route_id;
        this.sectorId = route_sectorId;
        this.grade = route_grade;
        this.createdAt = route_createdAt;
        this.builders = route_builders;
        this.climbers = route_climbers;
    }

    get id(): number {
        return this.route_id;
    }

    set id(value: number) {
        this.route_id = value;
    }

    get sectorId(): number {
        return this.route_sectorId;
    }

    set sectorId(value: number) {
        this.route_sectorId = value;
    }

    get grade(): string {
        return this.route_grade;
    }

    set grade(value: string) {
        this.route_grade = value;
    }

    get createdAt(): Date {
        return this.route_createdAt;
    }

    set createdAt(value: Date) {
        this.route_createdAt = value;
    }

    get builders(): Builder[] {
        return this.route_builders;
    }

    set builders(value: Builder[]) {
        this.route_builders = value;
    }

    get climbers(): Climber[] {
        return this.route_climbers;
    }

    set climbers(value: Climber[]) {
        this.route_climbers = value;
    }

    static from(route: Route) {
        return new Route(route.sectorId, route.grade, route.createdAt, route.builders, route.climbers, route.id);
    }
}