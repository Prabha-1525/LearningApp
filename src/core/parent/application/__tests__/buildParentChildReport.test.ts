import {asChildId} from '@core/domain';

import {buildParentChildReport} from '../buildParentChildReport';

describe('buildParentChildReport', () => {
  it('includes weekly monthly graph recommendations and core metrics', () => {
    const report = buildParentChildReport({
      childId: asChildId('demo-child'),
      childName: 'Ava',
      gamification: null,
    });

    expect(report.weekly.buckets).toHaveLength(7);
    expect(report.monthly.buckets).toHaveLength(4);
    expect(report.recommendations.length).toBeGreaterThan(0);
    expect(report.currentLevel).toBeGreaterThanOrEqual(1);
    expect(report.weekly.lessonsCompleted).toBeGreaterThan(0);
  });
});
