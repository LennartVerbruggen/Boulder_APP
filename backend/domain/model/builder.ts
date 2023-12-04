import { User } from "./user";
import {Route} from "./route";

export class Builder extends User{
    private builder_id: number;

    constructor(builder_name: string, builder_email: string, builder_password: string, builder_routes?: Route[], builder_id?: number) {
        super(builder_name, builder_email, builder_password, builder_routes);
        this.id = builder_id;
    }

    get id(): number {
        return this.builder_id;
    }

    set id(value: number) {
        this.builder_id = value;
    }

    static from(builder: Builder): Builder {
        return new Builder(builder.name, builder.email, builder.password, builder.routes, builder.id)
    }

}