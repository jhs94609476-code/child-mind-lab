// CSS 파일 side-effect import를 위한 타입 선언
declare module "*.css" {}
declare module "*.module.css" {
  const classes: { [key: string]: string };
  export default classes;
}
