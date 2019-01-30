export const isEmptyObj = (obj: any) => {
  for (let i in obj) {
    if (obj[i]) return false;
  }
  return true;
};

export const indexOf = (arr: any, name: any, val: any) => {
  for (let i in arr) {
    if (arr[i][name] === val) {
      return i;
    }
  }
  return -1;
};
