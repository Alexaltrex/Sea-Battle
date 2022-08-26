export const getModelColors = (
    placingError: boolean,
    enemy: boolean,
    killed: boolean
) => {
    if (!enemy && killed) {
        return ({
            color1: '#303030',
            color2: '#303030',
        })
    }
    const color1 = placingError ? "red" : enemy ? "#EE82EE" : "#3DBE4D";
    const color2 = placingError ? "red" : enemy ? "#8A2BE2" : "#006400";
    return {color1, color2}
}