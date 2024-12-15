import * as React from "react"
import Svg, { Path } from "react-native-svg"
const WarningCircle = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={128}
    height={128}
    fill="none"
    {...props}
  >
    <Path
      fill="#4C3C8D"
      d="M64 12a52 52 0 1 0 52 52 52.056 52.056 0 0 0-52-52Zm-4 28a4 4 0 0 1 8 0v28a4 4 0 1 1-8 0V40Zm4 52a6 6 0 1 1 0-12 6 6 0 0 1 0 12Z"
    />
  </Svg>
)
export default WarningCircle
