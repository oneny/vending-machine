export const toKRW = (num) => {
  if (num.length <= 3) return num;

  let result = "";
  for (let i = 0; i < num.length; i++) {

    if (i % 3 === 0 && i !== 0) {
      result = num[num.length - i - 1] + "," + result;
      continue;
    }

    result = num[num.length - i - 1] + result; 
  }
  
  return result;
};