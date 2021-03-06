import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: unknown, { metatype }: ArgumentMetadata): Promise<any> {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const object = plainToClass(metatype, value);
    const errors = await validate(object);
    if (errors.length > 0) {
      try {
        const errorObjValues = errors.reduce((prev, cur): any => {
          return { ...prev?.constraints, ...cur?.constraints };
        }, { constraints: {} });
        const error = Object.values(errorObjValues).join('; ');
        throw new BadRequestException(error);
      } catch (error) {
        throw new BadRequestException(error || '请求参数有问题，请检查传参');
      }
    }
    return value;
  }

  private toValidate(metatype: any): boolean {
    const types = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
