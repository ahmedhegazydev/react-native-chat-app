import React, { Component, ReactNode, ErrorInfo } from 'react';
import { View, Text } from 'react-native';
import styles from './styles';

// Define types for the state and props
interface ErrorBoundaryState {
  hasError: boolean;
}

interface ErrorBoundaryProps {
  children: ReactNode;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Error caught in ErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <Text>Something went wrong.</Text>
        </View>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
