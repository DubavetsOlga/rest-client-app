export const formatTime = (
  timestamp: number,
  locale: string = 'en-US',
  showSeconds: boolean = true
): string => {
  if (isNaN(timestamp)) {
    return 'Invalid time';
  }

  const options: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    second: showSeconds ? '2-digit' : undefined,
    hour12: locale.startsWith('en'),
  };

  return new Date(timestamp).toLocaleTimeString(locale, options);
};

const monthsCases = {
  genitive: [
    'января',
    'февраля',
    'марта',
    'апреля',
    'мая',
    'июня',
    'июля',
    'августа',
    'сентября',
    'октября',
    'ноября',
    'декабря',
  ],
};

export const formatDate = (
  isoDateString: string,
  locale: string = 'en-US'
): string => {
  if (!isoDateString) {
    return 'Invalid date';
  }

  const date = new Date(isoDateString);

  if (isNaN(date.getTime())) {
    return 'Invalid date';
  }

  if (locale.startsWith('ru')) {
    const day = date.getDate();
    const month = monthsCases.genitive[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  } else {
    return date.toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
};
