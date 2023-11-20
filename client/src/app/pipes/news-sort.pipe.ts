import {Pipe, PipeTransform} from '@angular/core';
import {NewsInfo} from "../interfaces/news-info";

@Pipe({
    name: 'newsSort'
})
export class NewsSortPipe implements PipeTransform {

    transform(value: NewsInfo[]): NewsInfo[] {
        return value.sort((a, b) => {
            return Date.parse(b.published) - Date.parse(a.published);
        });
    }

}
