import {Pipe, PipeTransform} from '@angular/core';
import {Message} from "../interfaces/dialog";

@Pipe({
    name: 'dateSort'
})
export class DateSortPipe implements PipeTransform {

    transform(value: Array<Message>, order: 'asc' | 'desc' = 'asc'): Array<Message> {
        return value.sort((a, b) => {
            if (order === 'asc') {
                return Date.parse(a.createdAt) - Date.parse(b.createdAt);
            }
            return Date.parse(b.createdAt) - Date.parse(a.createdAt);
        })
    }

}
