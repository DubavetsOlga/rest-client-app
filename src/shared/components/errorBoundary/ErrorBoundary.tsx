'use client';

import { Component, ErrorInfo, ReactNode } from 'react';
import s from './ErrorBoundary.module.css';
import { Button } from '@/shared/components';
type Props = {
  children?: ReactNode;
};

type State = {
  hasError: boolean;
};

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className={s.root}>
          <h2>Oops, there is an error!</h2>
          <Button onClick={() => this.setState({ hasError: false })}>
            Try again?
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
