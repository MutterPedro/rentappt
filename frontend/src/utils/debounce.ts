type ParameterizedFunction = (...args: any) => any;

export default function debounce<
  T extends ParameterizedFunction = ParameterizedFunction
>(func: T, wait: number) {
  let timeout: NodeJS.Timeout | null;

  return (...args: Parameters<typeof func>) => {
    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(() => {
      func(...args);
      timeout = null;
    }, wait);
  };
}
