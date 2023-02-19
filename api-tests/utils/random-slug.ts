export function generateRandomSlug(num: number) {
  const charList =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  let randomString = '';
  for (let i = 0; i < num; i++) {
    const randomPoz = Math.floor(Math.random() * charList.length);
    randomString += charList.substring(randomPoz, randomPoz + 1);
  }

  return randomString;
}
