import { render, screen } from '@testing-library/react';
import { developersData } from '@/shared/data/developers';
import { useLocale } from 'next-intl';
import { Developers } from '@/widgets/developers/Developers';
import '@testing-library/jest-dom';

jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ alt }: { alt: string }) => <img alt={alt} />,
}));

jest.mock('next-intl', () => ({
  useLocale: jest.fn(),
}));

jest.mock('@/shared/i18n/langSwitcher', () => ({
  translate: jest.fn().mockImplementation((language) => {
    if (language === 'ru') {
      return {
        developers: {
          Volha: 'Ольга',
          Timofei: 'Тимофей',
          frontendDeveloper: 'Frontend Разработчик',
        },
      };
    }
    return {
      developers: {
        Volha: 'Volha',
        Timofei: 'Timofei',
        frontendDeveloper: 'Frontend Developer',
      },
    };
  }),
}));

describe('Developers Component', () => {
  beforeEach(() => {
    (useLocale as jest.Mock).mockReturnValue('en');
  });

  it('renders developer names, about, and GitHub links in English', () => {
    render(<Developers />);

    expect(screen.queryAllByText('Frontend Developer')).toHaveLength(2);

    developersData.forEach((developer) => {
      const image = screen.getByAltText(developer.name);
      expect(image).toBeInTheDocument();
    });

    const githubLinks = screen.queryAllByRole('link', { name: /GitHub/i });

    expect(githubLinks).toHaveLength(developersData.length);

    githubLinks.forEach((githubLink, index) => {
      expect(githubLink).toHaveAttribute('href', developersData[index].github);
    });
  });

  it('renders developer names in Russian when the locale is set to "ru"', () => {
    (useLocale as jest.Mock).mockReturnValue('ru');

    render(<Developers />);

    expect(screen.getByText('Ольга')).toBeInTheDocument();
    expect(screen.queryAllByText('Frontend Разработчик')).toHaveLength(2);
  });
});
