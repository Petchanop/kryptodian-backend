import { PipeTransform, Injectable, BadRequestException, ArgumentMetadata, ExecutionContext, CallHandler } from '@nestjs/common';
import * as slugid from 'slugid';

@Injectable()
export class IdPipe implements PipeTransform {
  transform(value: object, metadata : ArgumentMetadata) {
    console.log("pipe", value, metadata);
    return this.transFormId(value);
  }

  private transFormId(value: object): object {
    if (value['id']) {
        value['id'] = slugid.decode(value['id']);
    } 
    return value;
  }
}