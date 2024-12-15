import * as React from "react"
import Svg, { Path } from "react-native-svg"
const WifiSlash = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={64}
    height={64}
    fill="none"
    {...props}
  >
    <Path
      fill="#4C3C8D"
      d="M54.22 51.983a3 3 0 1 1-4.44 4.035L36.945 41.9a14.016 14.016 0 0 0-13.178 1.775 3 3 0 1 1-3.535-4.85 19.838 19.838 0 0 1 10.48-3.78l-4.835-5.32a26.046 26.046 0 0 0-10.015 4.887 3 3 0 0 1-3.725-4.702 32.116 32.116 0 0 1 9.265-5.108l-4.327-4.75a37.783 37.783 0 0 0-9.17 5.57 3.003 3.003 0 0 1-3.808-4.645 43.88 43.88 0 0 1 8.75-5.595L9.78 12.018a3 3 0 1 1 4.44-4.035l40 44ZM32 47a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm16.137-12.388a3 3 0 0 0 3.725-4.702 31.818 31.818 0 0 0-9.362-5.148 3 3 0 0 0-1.968 5.668 25.908 25.908 0 0 1 7.605 4.182Zm11.765-13.635a44.083 44.083 0 0 0-30.867-9.88 3.006 3.006 0 1 0 .397 6 38.06 38.06 0 0 1 26.663 8.53 2.999 2.999 0 1 0 3.807-4.637v-.012Z"
    />
  </Svg>
)
export default WifiSlash