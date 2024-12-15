import * as React from "react"
import Svg, { G, Path, Defs, ClipPath } from "react-native-svg"
const BackBtn = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    {...props}
  >
    <G clipPath="url(#a)">
      <Path
        fill="#4C3D8F"
        d="M7 24a1 1 0 0 1-.71-1.71l8.17-8.17a3 3 0 0 0 0-4.24L6.29 1.71A1.004 1.004 0 0 1 7.71.29l8.17 8.17a5 5 0 0 1 0 7.08l-8.17 8.17A1 1 0 0 1 7 24Z"
      />
    </G>
    <Defs>
      <ClipPath id="a">
        <Path fill="#fff" d="M0 0h24v24H0z" />
      </ClipPath>
    </Defs>
  </Svg>
)
export default BackBtn
