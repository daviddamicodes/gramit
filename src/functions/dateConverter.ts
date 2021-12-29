// export default function convertDate(date: string): string {
//   const myDate = new Date(date);
//   const nowDate = new Date(Date.now());
//   const diff = (nowDate.valueOf() - myDate.valueOf()) / 1000 / 60 / 60;
//   return diff.toFixed(0);
// }

export default function convertDate(date: string): string {
  const myDate = new Date(date);
  const nowDate = new Date(Date.now());
  const diff = (nowDate.getTime() - myDate.getTime()) / 1000 / 60 / 60;
  return diff.toFixed(0);
}
