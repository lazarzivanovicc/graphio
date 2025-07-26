import { HttpParams } from '@angular/common/http';

export class HttpUtils {

    static getHttpParams(obj: any): HttpParams {
        let httpParams = new HttpParams();
        Object.keys(obj).forEach(key => {
            const value = obj[key];
            if (value != null && typeof value != undefined) {
                httpParams = httpParams.set(key, Array.isArray(value) ? value.join(',') : value);
            }
        });
        return httpParams;
    }

    static getHttpParamsFromArray(name: string, array: any[], httpParams = new HttpParams()) {
        return httpParams.set(name, array.join(','));
    }

    static getUrlParamsFrom(obj: any) {
        return Object.keys(obj).reduce((seed, current) => {
            if (seed) {
                seed += '&';
            }
            if (obj[current]) {
                seed += `${current}=${obj[current]}`;
            }
            return seed;
        }, '');
    }

    static appendHttpToUrlIfNotExists(url: string) {
        if (!url) {
            return;
        }
        const hasHttpInUrl = url.includes('http://');
        const hasHttpsInUrl = url.includes('https://');
        return (!hasHttpInUrl && !hasHttpsInUrl) ? 'http://' + url : url;
    }
}