// import React, {Component} from 'react';
// import {View, Text} from 'react-native';
// import styles from './styles';

// class ErrorBoundary extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {hasError: false};
//   }

//   static getDerivedStateFromError() {
//     return {hasError: true};
//   }

//   componentDidCatch(error, errorInfo) {
//     console.error('Error caught in ErrorBoundary:', error, errorInfo);
//   }

//   render() {
//     if (this.state.hasError) {
//       return (
//         <View style={styles.container}>
//           <Text>Something went wrong.</Text>
//         </View>
//       );
//     }
//     return this.props.children;
//   }
// }

// export default ErrorBoundary;
