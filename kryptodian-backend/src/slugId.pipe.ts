import { PipeTransform, Injectable, Type } from '@nestjs/common';
import * as slugid from 'slugid';

export interface ArgumentMetadata {
    type: 'param' ;
    metatype?: Type<unknown>;
    data?: string;
  }

@Injectable()
export class SlugIdPipe implements PipeTransform {
  transform(value: string, metadata: ArgumentMetadata) {
    console.log(metadata);
    return slugid.decode(value);
  }
}