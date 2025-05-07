import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'isIntro',
})
export class IsIntroPipe implements PipeTransform {
  transform(value: boolean): string {
    return value ? 'intro' : 'estrofe';
  }
}
