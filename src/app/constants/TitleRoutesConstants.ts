export class TitleRoutesConstants {
  private static APP_NAME ='hammerOn';
  public static HOME_TITLE = TitleRoutesConstants.getRouteTitleName('Home');
  public static LOGIN_TITLE = TitleRoutesConstants.getRouteTitleName('Login');
  public static REGISTER_TITLE = TitleRoutesConstants.getRouteTitleName('Register');

  private static getRouteTitleName(routeName: string) : string {
    return `${TitleRoutesConstants.APP_NAME} - ${routeName}`
  }
}
