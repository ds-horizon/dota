export const mockApiData = <T>(data: T) => {
  return (): Promise<T> =>
    new Promise((res) => {
      setTimeout(() => {
        res(data);
      }, 1000);
    });
};
