import {RefreshTokenResponse, StandardResponse} from "./response/Response";
import InternalServerError from "../libs/error/InternalServerError";

export default class HTTPClient {
    private static client: HTTPClient;
    private apiUrl: string;

    private constructor(apiUrl: string) {
        this.apiUrl = apiUrl;
    }

    public static GetClient(): HTTPClient {
        if(!this.client) {
            this.client = new HTTPClient(import.meta.env.VITE_API_URL? import.meta.env.VITE_API_URL : "http://localhost:3000/");
        }

        return this.client
    }

    public async sendRequest<T>(payload: any, endpoint: string, method: string = "GET", token?: string): Promise<StandardResponse<T>> {
        console.log("SEND REQUEST : ", payload, endpoint, method);
        let url: string = this.apiUrl + endpoint;
        const headers: HeadersInit = {
            "Content-Type": "application/json",
        }

        if(token) {
            headers["Authorization"] = "Bearer " + token;
        }

        const init: RequestInit = {
            method: method,
            headers: headers,
        }

        if(method !== "GET" && payload) {
            init.body = JSON.stringify(payload);
        }else if (payload) {
            const params = new URLSearchParams(
                {
                    ...payload
                }
            );

            url += `?${params}`;
        }

        const response = await fetch(url, init);

        const resResult = new StandardResponse<T>();
        resResult.status = response.status;

        const data = await response.json();

        if(!response.ok && !data) {
            throw new InternalServerError();
        }

        resResult.message = data.message;

        if(Object.prototype.hasOwnProperty.call(data, "data")) {
            resResult.data = data.data as T;
        }

        if(Object.prototype.hasOwnProperty.call(data, "validationErrors")){
            resResult.validationErrors = data.validationErrors;
        }

        return resResult;
    }

    public async isNeedLoginAgain(result: StandardResponse<any>): Promise<boolean> {
        if(result.status === 401) {
            try{
                const result = await HTTPClient.GetClient().sendRequest<RefreshTokenResponse>(null, "refresh", "PUT", localStorage.getItem('refreshToken') as string);

                if(result.status === 401) {
                    return true;
                }

                if(result.status !== 200) {
                    throw new InternalServerError(result.message);
                }

                if(result.data) {
                    localStorage.setItem("accessToken", result.data.token);
                    localStorage.setItem("refreshToken", result.data.refreshToken);
                    return false;
                }else {
                    throw new InternalServerError();
                }
            }catch (err) {
                console.error("FETCH TOKEN ERROR : ", err);
                throw new InternalServerError("error fetching token");
            }
        }

        return false;
    }
}