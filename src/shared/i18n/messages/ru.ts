import { LanguagesObjType } from './en';

export const ru: LanguagesObjType = {
  basic: {
    signIn: 'Войти',
    signUp: 'Регистрация',
    signOut: 'Выйти',
    restClient: 'REST Клиент',
    variables: 'Переменные',
    history: 'История',
    main: 'Главная',
    unexpectedError: 'Произошла неожиданная ошибка.',
  },
  mainPage: {
    welcome: 'Добро пожаловать',
    welcomeBack: 'С возвращением,',
    aboutProject:
      'Приложение предлагает удобный инструмент для работы с REST API. Оно включает: редактор запросов с поддержкой форматирования и base64-кодирования тела запроса; панель ответов с отображением HTTP-статуса, заголовков и других деталей; возможность выбора метода (GET, POST и др.), ввода URL и настройки заголовков; историю запросов для быстрого доступа к предыдущим запросам.',
    aboutSchool:
      'Проект разработан в рамках обучения в школе Rolling Scopes (RS School) — бесплатной онлайн-школы, которая предлагает уникальный образовательный опыт, сочетающий теорию и практику.',
  },
  auth: {
    name: 'Имя',
    email: 'Почта',
    password: 'Пароль',
    confirmPassword: 'Подтвердите пароль',
    haveAccount: 'У Bас уже есть аккаунт?',
    doNotHaveAccount: 'У Bас нет аккаунта?',
    createAccount: 'Создать аккаунт',
  },
  historyPage: {
    title: 'История запросов',
    emptyHistory: 'Вы не выполнили ни одного запроса. Здесь пусто. Попробуйте:',
  },
  variablesPage: {
    title: 'Переменные',
    tableTitle: 'Переменная',
    tableValue: 'Значение',
    variableNamePlaceholder: 'Добавить новую переменную',
    variablesFilterPlaceholder: 'Фильтровать переменные'
  },
  clientPage: {},
  errorPage: {
    text: 'Страница не найдена',
    link: 'Вернуться на Главную',
  },
  validations: {
    required: 'Обязательное поле',
    nameCapitalized: 'Имя должно начинаться с заглавной буквы',
    emailInvalid: 'Некорректный адрес электронной почты',
    passwordMinLength: 'Минимум 8 символов',
    passwordStrength: 'Должен содержать: 0-9, A-Z, a-z & спец. символ',
    passwordsMustMatch: 'Пароли должны совпадать',
  },
  developers: {
    Volha: 'Ольга Дубавец',
    Timofei: 'Тимофей Нарышкин',
    Polina: 'Полина Рябова',
    frontendDeveloper: 'Frontend Разработчик',
  },
  errors: {
    readError: 'Не удалось загрузить данные',
    saveError: 'Не удалось сохранить данные',
    deleteError: 'Не удалось удалить данные',
  },
};
