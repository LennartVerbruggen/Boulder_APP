import {Route} from "./route";

export class User {
    private user_name: string;
    private user_email: string;
    private user_password: string;
    private user_routes: Route[];

    constructor(user_name: string, user_email: string, user_password: string, user_routes: Route[]) {
        this.name = user_name;
        this.email = user_email;
        this.password = user_password;
        this.routes = user_routes;
    }

    get name(): string {
        return this.user_name;
    }

    set name(value: string) {
        this.user_name = value;
    }

    get email(): string {
        return this.user_email;
    }

    set email(value: string) {
        this.user_email = value;
    }

    get password(): string {
        return this.user_password;
    }

    set password(value: string) {
        this.user_password = value;
    }

    get routes(): Route[] {
        return this.user_routes;
    }

    set routes(value: Route[]) {
        this.user_routes = value;
    }
}