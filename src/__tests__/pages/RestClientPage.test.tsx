import { notFound } from 'next/navigation';
import RestResult from '@/app/[locale]/(client)/[...rest]/page';
import '@testing-library/jest-dom';

describe('RestResult', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls notFound if method is invalid', async () => {
    const params = { locale: 'en', rest: ['INVALID'] };

    await RestResult({ params });

    expect(notFound).toHaveBeenCalled();
  });

  it('does not call notFound if method is valid and rest is correct', async () => {
    const params = { locale: 'en', rest: ['GET', 'resource', 'id'] };

    await RestResult({ params });

    expect(notFound).not.toHaveBeenCalled();
  });

  it('calls notFound if more than 3 segments after method', async () => {
    const params = { locale: 'en', rest: ['POST', 'a', 'b', 'c'] };

    await RestResult({ params });

    expect(notFound).toHaveBeenCalled();
  });
});
