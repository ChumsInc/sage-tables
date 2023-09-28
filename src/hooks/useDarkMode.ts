import useMediaQuery from "./useMediaQuery";

const COLOR_SCHEME_QUERY = '(prefers-color-scheme: dark)'

function useDarkMode(defaultValue?: boolean): boolean {
    const isDarkOS = useMediaQuery(COLOR_SCHEME_QUERY);
    return isDarkOS ?? defaultValue;
}

export default useDarkMode
