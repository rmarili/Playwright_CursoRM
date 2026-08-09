import { request, type APIRequestContext} from "@playwright/test";
import { BaseService } from "./BaseService";
import { LoginResponse, User} from "../types"

export class AuthService extends BaseService{
    protected basePath(): string {
        return "/api/auth"
    }

    static async create(baseURL: string): Promise<AuthService>{
        const api = await request.newContext({baseURL});
        return new AuthService(api, baseURL);
    }

    async login(user: User): Promise<LoginResponse>{
        const res = await this.api.post(this.url("/login"),{
            data: { username: user.username, password: user.password},
        });
        if(!res.ok()){
            const body = await res.text();
            throw new Error(`Login failed (${res.status()}): ${body}`);   
        }
        return (await res.json()) as LoginResponse;
    }
}

export async function createAuthedContext(baseURL: string, token: string, extraHeaders: Record<string, string> ={},): Promise<APIRequestContext>{
    return request.newContext({
        baseURL, extraHTTPHeaders:{
            Authorization: `Bearer ${token}`,
            ...extraHeaders,
        },
    })
}