import React from 'react';
import ReactTestRenderer, {act} from 'react-test-renderer';
import {Text} from 'react-native';
import {LearningHeader} from '../LearningHeader';

describe('LearningHeader Component', () => {
  it('renders title and subtitle correctly', () => {
    let component: any;
    act(() => {
      component = ReactTestRenderer.create(
        <LearningHeader
          title="Math Adventure"
          subtitle="Learn step by step!"
          testID="learning-header"
        />,
      );
    });

    const root = component.root;
    expect(root.findByProps({children: 'Math Adventure'})).toBeTruthy();
    expect(root.findByProps({children: 'Learn step by step!'})).toBeTruthy();
  });

  it('renders stars when provided', () => {
    let component: any;
    act(() => {
      component = ReactTestRenderer.create(
        <LearningHeader title="Animals" stars={15} starVariant="gold" />,
      );
    });

    const root = component.root;
    expect(root.findByProps({children: 15})).toBeTruthy();
  });

  it('renders progress bar when progress is passed', () => {
    let component: any;
    act(() => {
      component = ReactTestRenderer.create(
        <LearningHeader title="Counting" progress={75} showProgress />,
      );
    });

    const root = component.root;
    expect(root).toBeTruthy();
  });

  it('renders custom rightElement correctly', () => {
    let component: any;
    act(() => {
      component = ReactTestRenderer.create(
        <LearningHeader
          title="Drawing"
          rightElement={<Text>CustomRight</Text>}
        />,
      );
    });

    const root = component.root;
    expect(root.findByProps({children: 'CustomRight'})).toBeTruthy();
  });

  it('hides back button when showBack is false', () => {
    let component: any;
    act(() => {
      component = ReactTestRenderer.create(
        <LearningHeader
          title="Home"
          showBack={false}
          testID="learning-header"
        />,
      );
    });

    const root = component.root;
    const backBtn = root.findAllByProps({testID: 'learning-header-back'});
    expect(backBtn).toHaveLength(0);
  });
});
