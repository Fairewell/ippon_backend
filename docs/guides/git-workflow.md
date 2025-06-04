# Git Workflow Guide

## Branching Strategy
Мы используем упрощенный GitHub Flow:
- `main` - стабильная ветка (соответствует production)
- `develop` - основная ветка разработки
- Ветки фич: `feature/<краткое-описание>`
- Ветки исправлений: `fix/<описание-ошибки>`

## Создание веток
1. Всегда создавайте ветки от `develop`:
```bash
git checkout develop
git pull origin develop
git checkout -b feature/my-new-feature
```

2. Именование веток:
- Используйте префиксы: `feature/`, `fix/`, `docs/`, `refactor/`
- Краткое описание в kebab-case (дефисы вместо пробелов)
- Примеры:
  - `feature/user-auth`
  - `fix/booking-validation`
  - `docs/api-reference`

## Работа с ветками
- Делайте небольшие атомарные коммиты
- Регулярно обновляйте ветку через `git rebase develop`
- Перед мержем в `develop`:
  - Проведите code review
  - Убедитесь, что проходят все тесты

## Мерж в develop
Используйте squash merge для сохранения чистоты истории:
```bash
git checkout develop
git merge --squash feature/my-feature
git commit -m "Реализована новая функциональность"
```

## Рекомендации
- Никогда не коммитьте напрямую в `main` или `develop`
- Используйте `.gitignore` для исключения временных файлов
- Пишите осмысленные сообщения коммитов