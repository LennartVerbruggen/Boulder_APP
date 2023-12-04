import { User } from "./user";
import {Route} from "./route";

export class Climber extends User{
    private climber_id: number;

    constructor(climber_name: string, climber_email: string, climber_password: string, climber_routes?: Route[], climber_id?: number) {
        super(climber_name, climber_email, climber_password, climber_routes);
        this.id = climber_id;
    }

    get id(): number {
        return this.climber_id;
    }

    set id(value: number) {
        this.climber_id = value;
    }

    static from(climber: Climber): Climber {
        return new Climber(climber.name, climber.email, climber.password, climber.routes, climber.id);
    }
}