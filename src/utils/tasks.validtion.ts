import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { Task } from 'src/tasks/entities/task.entity';

@ValidatorConstraint({ async: true })
export class IsTaskAlreadyExistConstraint
  implements ValidatorConstraintInterface
{
  async validate(title: any, args: ValidationArguments) {
    const title_1 = await Task.findOne({
      where: {
        title: title,
      },
    });
    if (title_1) return false;
    return true;
  }
}

export function IsTaskAlreadyExist(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsTaskAlreadyExistConstraint,
    });
  };
}
