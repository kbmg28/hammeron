import { UserOnlyIdNameAndEmailDto } from './../_services/swagger-auto-generated/model/userOnlyIdNameAndEmailDto';

export function sortPeopleDefault(): ((a: UserOnlyIdNameAndEmailDto, b: UserOnlyIdNameAndEmailDto) => number) | undefined {
  return (a, b) => {
    if (a.name && b.name) {
      return a.name.localeCompare(b.name);
    }
    return a.email.localeCompare(b.email);
  };
}
