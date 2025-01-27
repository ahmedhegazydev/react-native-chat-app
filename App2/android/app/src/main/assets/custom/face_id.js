import * as React from "react"
import Svg, { Path } from "react-native-svg"
const FaceID = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={22}
    height={22}
    fill="none"
    viewBox="0 0 28 28"
    {...props}
  >
    <Path
      fill="#fff"
      fillRule="evenodd"
      d="M2 9V6.333A4.33 4.33 0 0 1 3.27 3.27 4.33 4.33 0 0 1 6.332 2H9a1 1 0 0 0 0-2H6.333A6.335 6.335 0 0 0 0 6.333V9a1 1 0 0 0 2 0ZM17 2h2.667c1.15 0 2.252.456 3.064 1.27A4.329 4.329 0 0 1 24 6.332V9a1 1 0 0 0 2 0V6.333A6.335 6.335 0 0 0 19.667 0H17a1 1 0 0 0 0 2ZM0 17v2.667A6.335 6.335 0 0 0 6.333 26H9a1 1 0 0 0 0-2H6.333a4.329 4.329 0 0 1-3.064-1.27A4.329 4.329 0 0 1 2 19.668V17a1 1 0 0 0-2 0ZM17 26h2.667A6.335 6.335 0 0 0 26 19.667V17a1 1 0 0 0-2 0v2.667c0 1.15-.456 2.252-1.27 3.064A4.329 4.329 0 0 1 19.668 24H17a1 1 0 0 0 0 2ZM16.666 8.333v1.333a1 1 0 0 0 2 0V8.333a1 1 0 0 0-2 0ZM7.334 8.333v1.333a1 1 0 0 0 2 0V8.333a1 1 0 0 0-2 0ZM12.667 13.714v-3.381a1 1 0 0 1 2 0v4a1 1 0 0 1-.553.894l-1.333.667a1 1 0 1 1-.893-1.79l.78-.39ZM16.96 16.96a1 1 0 0 1 1.414 1.414l-.002.002a7.597 7.597 0 0 1-10.744 0v-.002a1 1 0 0 1 1.414-1.414l.001.001a5.596 5.596 0 0 0 7.915 0h.002Z"
      clipRule="evenodd"
    />
  </Svg>
)
export default FaceID
