import * as React from "react"
import Svg, { G, Path, Defs, ClipPath } from "react-native-svg"
const NotificationIcon = (props) => (
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
        d="m22.555 13.662-1.9-6.836a9.321 9.321 0 0 0-18.08.474l-1.47 6.615A5 5 0 0 0 5.985 20H7.1a5 5 0 0 0 9.8 0h.838a5 5 0 0 0 4.818-6.338h-.001ZM12 22a2.999 2.999 0 0 1-2.816-2h5.632A3 3 0 0 1 12 22Zm8.126-5.185A2.977 2.977 0 0 1 17.736 18H5.987a2.999 2.999 0 0 1-2.928-3.651l1.47-6.616a7.321 7.321 0 0 1 14.2-.372l1.9 6.836a2.978 2.978 0 0 1-.502 2.618Z"
      />
    </G>
    <Defs>
      <ClipPath id="a">
        <Path fill="#fff" d="M0 0h24v24H0z" />
      </ClipPath>
    </Defs>
  </Svg>
)
export default NotificationIcon
