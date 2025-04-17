import { render, screen } from '@testing-library/react';
import { developersData } from '@/shared/data/developers';
import { Footer } from '@/widgets/footer/Footer';
import '@testing-library/jest-dom';

type MockImageProps = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  layout?: 'intrinsic' | 'fixed' | 'responsive' | 'fill';
  quality?: number | string;
  objectFit?: string;
  objectPosition?: string;
  loading?: 'lazy' | 'eager';
};

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: MockImageProps) => {
    const { priority, alt, ...restProps } = props;
    return <img {...restProps} alt={alt} />;
  },
}));

describe('Footer Component', () => {
  beforeEach(() => {
    render(<Footer />);
  });

  it('renders without crashing', () => {
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });

  it('displays the current year', () => {
    const currentYear = new Date().getFullYear().toString();
    expect(screen.getByText(currentYear)).toBeInTheDocument();
  });

  it('contains the RS School logo with correct link', () => {
    const rsLink = screen.getByRole('link', { name: /rs-school/i });
    expect(rsLink).toHaveAttribute('href', 'https://rs.school/courses/reactjs');
    expect(screen.getByAltText('rs-school')).toBeInTheDocument();
  });

  it('contains the GitHub logo with correct link', () => {
    const githubLink = screen.getByRole('link', { name: /github/i });
    expect(githubLink).toHaveAttribute(
      'href',
      'https://github.com/DubavetsOlga/rest-client-app/'
    );
    expect(screen.getByAltText('github')).toBeInTheDocument();
  });

  it('displays all developer links with correct data', () => {
    developersData.forEach((dev) => {
      const devLink = screen.getByRole('link', { name: dev.name });
      expect(devLink).toHaveAttribute('href', dev.github);
    });
  });

  it('has the correct number of developer links', () => {
    const devLinks = screen.getAllByRole('link');
    expect(devLinks.length).toBe(2 + developersData.length);
  });

  it('has all links with rel="noreferrer" and target="_blank"', () => {
    const allLinks = screen.getAllByRole('link');
    allLinks.forEach((link) => {
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noreferrer');
    });
  });
});
