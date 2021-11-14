"use strict";

var _require = require("discord.js"),
    MessageEmbed = _require.MessageEmbed;

var _require2 = require('../config'),
    COIN = _require2.COIN,
    BANK = _require2.BANK,
    STAR = _require2.STAR,
    status = _require2.status,
    CRYSTAL = _require2.CRYSTAL,
    HELL = _require2.HELL;

var _require3 = require("../functions/functions"),
    makeTimestamp = _require3.makeTimestamp,
    formatNumber = _require3.formatNumber,
    rubToDollar = _require3.rubToDollar;

var _require4 = require('../JSON/colours.json'),
    greenlight = _require4.greenlight,
    redlight = _require4.redlight,
    main = _require4.main;

var heroes = require('../JSON/heroes.json');

var item = require('../JSON/items');

var _require5 = require("../rewards.json"),
    games = _require5.games;

module.exports = {
  "previous": "Предыдущая",
  "next": "Следующая",
  "notUser": "Участник не найден.",
  "specify": "Укажите участника.",
  "specifyT": "Укажите текст.",
  "vipOne": "Эта команда доступна только для __VIP__ пользователей.",
  "vipTwo": "Эта команда доступна только для __Премиум__ пользователей.",
  "maxLimit": function maxLimit(num) {
    return "\u041C\u0430\u043A\u0441\u0438\u043C\u0430\u043B\u044C\u043D\u043E\u0435 \u043A\u043E\u043B\u0438\u0447\u0435\u0441\u0442\u0432\u043E \u0442\u0435\u043A\u0441\u0442\u0430 __".concat(num, "__ \u0441\u0438\u043C\u0432\u043E\u043B\u043E\u0432!");
  },
  "perm": "У вас недостаточно прав.",
  "specifyL": "Укажите ссылку.",
  "waiting": "Ждите...",
  "loading": "Ищу противника",
  "and": "и",
  "again": "Попробуй снова",
  "buttonYes": "Да",
  "buttonNo": "Нет",
  "noStar": "У вас недостаточно голды.",
  "noCandy": "У тебя мало конфет.",
  "noCrystal": "У вас недостаточно селендианов.",
  "cardcooldown": "Пожалуйста закончите действия с картами.",
  "cooldown": function cooldown(time, cmd) {
    return "\u041F\u043E\u0434\u043E\u0436\u0434\u0438\u0442\u0435 __".concat(time, "__ \u0441\u0435\u043A\u0443\u043D\u0434, \u0447\u0442\u043E\u0431\u044B \u0438\u0441\u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u044C __").concat(cmd, "__.");
  },
  "cardFix": "Ваш платеж будет выполнен в течении нескольких минут.",
  "banned": "Ваш аккаунт был забанен до",
  "timeOut": "Время вышло.",
  "ERROR": "Ошибка взаимодействия",
  "interError": "Эта кнопка не доступна для вас!",
  "crystal": "Селендиан:",
  "afkMess": function afkMess(name, res) {
    return "\u041F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C **".concat(name, "** \u0432 \u0434\u0430\u043D\u043D\u044B\u0439 \u043C\u043E\u043C\u0435\u043D\u0442 \u0432 \u0440\u0435\u0436\u0438\u043C\u0435 \u0410\u0424\u041A\n\u041F\u043E \u043F\u0440\u0438\u0447\u0438\u043D\u0435: **").concat(res, "**");
  },
  "promoClass": {
    "noCode": "Укажите промокод.",
    "noPromo": "Такой промокод не существует.",
    "subReq": "Этот промокод доступен только подписчикам",
    "noAvailable": "Этот промокод уже не доступен.",
    "already": "Вы уже использовали этот промокод.",
    "done": "Вы успешно использовали промокод, ваша награда"
  },
  "special": {
    "desc": "Специальное временное предложение.",
    "usage": "",
    "access": "Для всех"
  },
  "vote": {
    "desc": "Голосовать за бота.",
    "usage": "",
    "access": "Для всех"
  },
  "forbs": {
    "desc": "Список самых богатых участников.",
    "usage": "",
    "access": "Для всех"
  },
  "breeding": {
    "desc": "Скрещивать героев.",
    "usage": "[первый герой] [второй герой]",
    "access": "Для всех"
  },
  "skip": {
    "desc": "Пропустить скрещивание.",
    "usage": "",
    "access": "Для всех"
  },
  "collect": {
    "desc": "Забрать героя.",
    "usage": "[номер скрещиваний]",
    "access": "Для всех"
  },
  "throw": {
    "desc": "Бросать героя.",
    "usage": "[номер скрещиваний]",
    "access": "Для всех"
  },
  "captcha": {
    "desc": "Решить капчу и получать золото.",
    "usage": "",
    "access": "Для всех"
  },
  "bank": {
    "desc": "Вложить деньги и получить больше.",
    "usage": "[invest | card]",
    "access": "Для всех"
  },
  "2v2": {
    "desc": "Пойти в бой против ботов с кем-то.",
    "usage": "[ID | упоминане]",
    "access": "Для всех"
  },
  "heroes-rate": {
    "desc": "Рейтинг героев.",
    "usage": "",
    "access": "Для всех"
  },
  "combine": {
    "desc": "Комбинировать 2 героев.",
    "usage": "[название основного героя] [название второстепенного героя]",
    "access": "Для всех",
    "time": "Попробуй снова",
    "spec": "Укажите героев!",
    "err": "Герои не найдены!",
    "private": "Приватный герой не может быть комбинирован!"
  },
  "slots": {
    "desc": "Играть в слоты.",
    "usage": "<ставка>",
    "access": "Для всех",
    "win": "Ты выиграл",
    "lose": "Ты проиграл"
  },
  "collection": {
    "desc": "Посмотреть коллекции.",
    "usage": "(check)",
    "access": "Для всех"
  },
  "locations": {
    "desc": "Изучать локации и получать награды.",
    "usage": "",
    "access": "Для всех"
  },
  "partner": {
    "desc": "Посмотреть свой персональный код донатов.",
    "usage": "(create)",
    "access": "Для всех"
  },
  "mail": {
    "desc": "Просто почта.",
    "usage": "",
    "access": "Для всех"
  },
  "promocode": {
    "desc": "Использовать промокод.",
    "usage": "[промокод]",
    "access": "Для всех"
  },
  "explore": {
    "desc": "Изучать души.",
    "usage": "",
    "access": "Для всех",
    "ends": "Изучение закончится",
    "place": "Что изучать..."
  },
  "stats": {
    "desc": "Посмотреть свою статистику.",
    "usage": "",
    "access": "Для всех",
    "trial": "Макс. этап испытаний:"
  },
  "guess": {
    "desc": "Игра \"Угадай число\".",
    "usage": "",
    "access": "Для всех",
    "lose": "Вы проиграли...",
    "guess": function guess(f, s) {
      return "\u0423\u0433\u0430\u0434\u0430\u0439\u0442\u0435 \u0447\u0438\u0441\u043B\u043E \u043C\u0435\u0436\u0434\u0443 ".concat(f, " \u0438 ").concat(s, ".");
    },
    "win": "Вы ответили правильно и выиграли",
    "wrong": "Вы ответили неправильно."
  },
  "cardClass": {
    "specCode": "Укажите номер другой карты. \`0123-4567\`",
    "specAmount": "Укажите сумму.",
    "already": "Вы уже имеете эту карточку.",
    "done1": "Карта успешно создана!",
    "choose": "Выберите нужную карточку",
    "chs": "Укажите способ оплаты",
    "custom1": "dep",
    "noCard": "У вас нет карточки.",
    "custom2": "giving",
    "min": "Минимальная сумма - 1",
    "dm": "Откройте вашу личку.",
    "findError": "Карточка не найдена.",
    "addContent": "Выберите карточку, чтобы заплатить.",
    "max": "На указанной карте нет столько места.",
    "maxGive": "Максимальная сумма перевода этой карты - ",
    "typePin": "Введите пин-код вашей карточки, у вас 30 секунд.\nВведите \`cancel\`, чтобы отклонить действие.",
    "declined": "Действие успешно отклонено.",
    "done2": "Платеж выполнен.",
    "timeOut": "Время вышло.",
    "custom3": "closing",
    "contentClose": "Выберите карточку чтобы закрыть.",
    "closed": "Карточка успешно закрыта.",
    "bal": "Баланс:",
    "custom4": "dep",
    "specDep": "Укажите карту, которую хотите пополнить.",
    "wait": "Пожалуйста подождите.",
    "another": "Укажите другую карточку.",
    "custom5": "with",
    "cont": "Укажите карту, с которой нужно вывести."
  },
  "cards": {
    "desc": "Посмотреть свои кредитные карты.",
    "usage": "",
    "access": "Для всех",
    "number": "Номер:",
    "balance": "Баланс:",
    "createdAt": "Создана в",
    "maxSpace": "Макс. баланс:",
    "maxAmount": "Макс. сумма переводов:",
    "perc": "Процент:"
  },
  "link": {
    "desc": "Добавить ссылки на соц. сети в профиль.",
    "usage": "[соц. сеть] [ссылка]",
    "access": "Для всех",
    "link": "Укажите соц. сеть."
  },
  "close": {
    "desc": "Закрыть кредитку.",
    "usage": "",
    "access": "Для всех"
  },
  "gcard": {
    "desc": "Пополнить кредитку.",
    "usage": "[сумма]",
    "access": "Для всех"
  },
  "take": {
    "desc": "Вывести голду с карты.",
    "usage": "[сумма]",
    "access": "Для всех"
  },
  "open": {
    "desc": "Открыть кредитную карточку.",
    "usage": "",
    "access": "Для всех",
    "cost": "Цена:"
  },
  "pins": {
    "desc": "Получить пин-коды своих карт.",
    "usage": "",
    "access": "Для всех"
  },
  "send": {
    "desc": "Перевести голду на другую карту.",
    "usage": "[номер карты] <сумма>",
    "access": "Для всех"
  },
  "trial": {
    "desc": "Начать испытание за 500 голды.",
    "trial": function trial(time) {
      return "\u041F\u043E\u043F\u0440\u043E\u0431\u0443\u0439\u0442\u0435 \u0441\u043D\u043E\u0432\u0430 <t:".concat(makeTimestamp(time), ":R>");
    },
    "usage": "",
    "access": "Для всех"
  },
  "heroModel": {
    "force": "Сила:",
    "health": "Жизнь:",
    "damage": "Атака:",
    "level": "Уровень:",
    "battle": "Битва началась!",
    "winrate": "Процент побед:",
    "reward": "Выигрыш:",
    "noHero": "Вы не имеете героя.",
    "common": "Обычный",
    "elite": "Элитный",
    "furious": "Яростный",
    "mythical": "Мифический",
    "private": "Легендарный"
  },
  "clanModel": {
    "noClan": "Вы не состоите в гильдии.",
    "clan": "Вы уже состоите в гильдии.",
    "notClan": "Гильдия не найдена.",
    "leader": "Лидер:",
    "level": "Уровень:",
    "budget": "Бюджет:",
    "reward": "Награда:",
    "members": "Участники",
    "noMembers": "Пусто",
    "specN": "Укажите номер.",
    "notLeader": "Вы не лидер гильдии.",
    "noApps": "Нет заявок.",
    "noHero": "Нет героя"
  },
  "teamModel": {
    "noTeam": "Ваша гильдия не имеет военную тиму.",
    "kicked": "Участник успешно убран.",
    "gg": "Тима заполнена!",
    "done1": "Участник успешно добавлен в тиму.",
    "notThisLeader": "Лидер этой гильдии не находится на этом сервере.",
    "thisClanNotTeam": "Эта гильдия не имеет военную тиму.",
    "youBudget": "У вас недостаточно рубинов.",
    "targetBudget": "Эта гильдия не имеет столько рубинов.",
    "declined": "Лидер этой гильдии отказался.",
    "winner": "Победитель",
    "req": function req(bet) {
      return "\u0432\u0430\u0448\u0435\u0439 \u0433\u0438\u043B\u044C\u0434\u0438\u0438 \u0431\u0440\u043E\u0441\u0438\u043B\u0438 \u0432\u044B\u0437\u043E\u0432 \u043D\u0430 __".concat(bet, "__.");
    },
    "waiting": "Подождите..."
  },
  "tchange": {
    "desc": "Изменить тиму гильдии.",
    "usage": "[номер участника | clear]",
    "access": "Для всех",
    "check": "Укажите номер или `clear`"
  },
  "team": {
    "desc": "Посмотреть тиму гильдии.",
    "usage": "",
    "access": "Для всех"
  },
  "war": {
    "desc": "Начать войну гильдий.",
    "usage": "[номер гильдии] <ставка>",
    "access": "Для всех",
    "bet": "Укажите ставку.",
    "betError": "Максимальная ставка - 50000"
  },
  "tasks": {
    "desc": "Посмотреть свои задания.",
    "usage": "",
    "access": "Для всех"
  },
  "leaderboard": {
    "desc": "Отображает все топы.",
    "usage": "",
    "access": "Для всех",
    "no": "Пожалуйста укажите тип топа(`total`).",
    "games": "Топ по играм",
    "journey": "Топ по приключениям"
  },
  "channel-enable": {
    "desc": "Включить канал для команд.",
    "usage": "[упоминание | ID]",
    "access": "Для Администратора",
    "no": "Укажите канал.",
    "all": "Этот канал уже включен.",
    "err": "Не найден."
  },
  "channel-disable": {
    "desc": "Отключить канал для команд.",
    "usage": "[упоминание | ID]",
    "access": "Для Администратора",
    "no": "Укажите канал.",
    "all": "Этот канал уже отключен.",
    "err": "Не найден."
  },
  "enable": {
    "desc": "Включить команду.",
    "usage": "[название команды]",
    "access": "Для Администратора",
    "no": "Укажите команду.",
    "all": "Эта команда уже включена.",
    "err": "Не найдена."
  },
  "disable": {
    "desc": "Отключить команду.",
    "usage": "[название команды]",
    "access": "Для Администратора",
    "no": "Укажите команду.",
    "all": "Эта команда уже отключена.",
    "err": "Не найдена."
  },
  "give": {
    "desc": "Отдать героя участнику за количество селендианов.",
    "usage": "[имя героя] [упоминание | ID] [цена]",
    "access": "Для всех",
    "specH": "Укажите героя.",
    "cost": "Укажите цену.",
    "noHero": "Герой не найден.",
    "min": "Минимальная сумма __10__.",
    "not": "Вы не можете продать этого героя.",
    "double": "Цена не может быть больше чем два раза.",
    "sure": function sure(trans, cost) {
      return "\u043F\u0440\u0435\u0434\u043B\u0430\u0433\u0430\u0435\u0442 \u0432\u0430\u043C \u0433\u0435\u0440\u043E\u044F __".concat(trans, "__ \u0437\u0430 __").concat(cost, "__");
    },
    "find": "Ищу участника...",
    "place": "Этот участник имеет достаточно героев.",
    "already": "Этот участник уже имеет этого героя.",
    "star": "Этот участник не имеет столько селендианов.",
    "sell": function sell(name, cost) {
      return "\u0412\u044B \u043F\u0440\u043E\u0434\u0430\u043B\u0438 \u0433\u0435\u0440\u043E\u044F: __".concat(name, "__ \u0437\u0430 __").concat(cost, "__ (20% \u043D\u0430\u043B\u043E\u0433)");
    }
  },
  "reputation": {
    "desc": "Поднять репутацию сервера.",
    "usage": "",
    "access": "Для всех",
    "done": "Вы успешно подняли репутацию сервера.",
    "time": function time(_time) {
      return "\u041F\u043E\u043F\u0440\u043E\u0431\u0443\u0439\u0442\u0435 \u0441\u043D\u043E\u0432\u0430 \u0447\u0435\u0440\u0435\u0437 **".concat(_time.getUTCHours(), " \u0447\u0430\u0441\u0430(-\u043E\u0432) ").concat(_time.getMinutes(), " \u043C\u0438\u043D\u0443\u0442.**");
    }
  },
  "bag": {
    "desc": "Посмотреть свои предметы.",
    "usage": "",
    "access": "Для всех"
  },
  "use": {
    "desc": "Использовать предмет.",
    "usage": "[кол-во предметов]",
    "access": "Для всех",
    "err": "Вы не имеете этот предмет.",
    "boxDone": "Вам выпало:",
    "hero": function hero(name) {
      return "\u0412\u044B \u043F\u043E\u043B\u0443\u0447\u0438\u043B\u0438 \u0433\u0435\u0440\u043E\u044F \u2014 __".concat(name, "__");
    }
  },
  "language": {
    "desc": "Менять язык бота на сервере.",
    "usage": "[ru | en]",
    "access": "Для Администратора",
    "err": "Укажите язык: **en, ru**",
    "done": "Язык успешно изменён."
  },
  "heroes": {
    "desc": "Информация о героев.",
    "usage": "",
    "access": "Для всех",
    "cost": "Цена:",
    "avail": "Доступен:",
    "donate": "Донат",
    "noavail": "Нет",
    "nocost": "Не известна",
    "pack": "Временный пак",
    "loc": "Можно найти изучая локации",
    "yes": "Да",
    "t1": "Предыдущая",
    "t2": "Следующая"
  },
  "enemies": {
    "desc": "Информация о врагах.",
    "usage": "",
    "access": "Для всех",
    "t1": "Предыдущая",
    "t2": "Следующая",
    "boss": "Босс"
  },
  "donate": {
    "desc": "Информация о платежей.",
    "usage": "",
    "access": "Для всех",
    "donate1": function donate1() {
      return new MessageEmbed().setColor(main).addFields({
        name: "\u041F\u043E\u0434\u0434\u0435\u0440\u0436\u0438\u0432\u0430\u0442\u044C \u0440\u0430\u0437\u0440\u0430\u0431\u043E\u0442\u0447\u0438\u043A\u0430, \u0438 \u043A\u0443\u043F\u0438\u0442\u044C \u043F\u0440\u0435\u043C\u0438\u0443\u043C \u0434\u043E\u0441\u0442\u0443\u043F.",
        value: '**[Ссылка на донат](https://www.donationalerts.com/r/adanadiscord)**',
        inline: false
      }, {
        name: "\u0412\u0441\u0451, \u0447\u0442\u043E \u043D\u0443\u0436\u043D\u043E \u0443\u043A\u0430\u0437\u0430\u0442\u044C!",
        value: '• Ваш ID\n• Что именно вы хотите, например **VIP** или **Премиум**.',
        inline: false
      }).setFooter("Отправьте ваши вопросы командой ?сообщение");
    },
    "donate2": function donate2() {
      return new MessageEmbed().setColor(main).addFields({
        name: "\u041F\u043E\u0434\u0434\u0435\u0440\u0436\u0438\u0432\u0430\u0442\u044C \u0440\u0430\u0437\u0440\u0430\u0431\u043E\u0442\u0447\u0438\u043A\u0430",
        value: '**[30₽ Ежемесячно](https://boosty.to/iamdann/purchase/575340?ssource=DIRECT&share=subscription_link)**',
        inline: false
      }, {
        name: "\u041A\u043B\u0430\u0441\u0441\u0438\u0447\u0435\u0441\u043A\u0438\u0439 \u0411\u0443\u0441\u0442 \uD83D\uDC9B",
        value: '**[50₽ Ежемесячно](https://boosty.to/iamdann/purchase/575346?ssource=DIRECT&share=subscription_link)**\n**Доступ к приватным героям**\n**+1 слот скрещиваний**\n**+1 слот майнинга**\n+10% Душа Тайруса\n+10% Душа Анкалгона\n+5% Душа Дариуса\nДоступ к приватному каналу',
        inline: false
      }, {
        name: "\u0421\u0440\u0435\u0434\u043D\u0438\u0439 \u0411\u0443\u0441\u0442 \uD83D\uDC9A",
        value: '**[100₽ Ежемесячно](https://boosty.to/iamdann/purchase/575347?ssource=DIRECT&share=subscription_link)**\n**Доступ к приватным героям**\n**+2 слот скрещиваний**\n**+2 слот майнинга**\n+15% Душа Тайруса\n+15% Душа Анкалгона\n+10% Душа Дариуса\nДоступ к приватному каналу',
        inline: false
      }, {
        name: "\u041C\u0430\u043A\u0441\u0438\u043C\u0430\u043B\u044C\u043D\u044B\u0439 \u0411\u0443\u0441\u0442 \uD83D\uDC9C",
        value: '**[200₽ Ежемесячно](https://boosty.to/iamdann/purchase/575348?ssource=DIRECT&share=subscription_link)**\n**Доступ к приватным героям**\n**+3 слот скрещиваний**\n**+3 слот майнинга**\n+20% Душа Тайруса\n+20% Душа Анкалгона\n+15% Душа Дариуса\nДоступ к приватному каналу',
        inline: false
      }).setTitle("Любая подписка дает доступ к секретным промокодам!").setDescription("\u041F\u043E\u0436\u0430\u043B\u0443\u0439\u0441\u0442\u0430 \u0431\u0443\u0434\u044C\u0442\u0435 \u043D\u0430 [\u0421\u0435\u0440\u0432\u0435\u0440\u0435 \u043F\u043E\u0434\u0434\u0435\u0440\u0436\u043A\u0438](https://discord.gg/Q6Guf7MmsT), \u0447\u0442\u043E\u0431\u044B \u043F\u043E\u043B\u0443\u0447\u0430\u0442\u044C \u0411\u0443\u0441\u0442\u044B").setFooter("Отправьте ваши вопросы командой ?сообщение");
    }
  },
  "shop": {
    "desc": "Магазин плюшек.",
    "usage": "[pack | packs]",
    "access": "Для всех",
    "shop": function shop() {
      return new MessageEmbed().setColor(main).setAuthor("Вся информация о переводах и месячных подписок: ?donate").addFields({
        name: "Boosty \u0410\u043A\u043A\u0430\u0443\u043D\u0442 \u0420\u0430\u0437\u0440\u0430\u0431\u043E\u0442\u0447\u0438\u043A\u0430:",
        value: "**[boosty.to/iamdann](https://boosty.to/iamdann)**",
        inline: false
      }, {
        name: "".concat(status.vip, " VIP"),
        value: "\u0414\u0430\u0451\u0442 \u0434\u043E\u0441\u0442\u0443\u043F \u043A \u043A\u043E\u043C\u0430\u043D\u0434\u0430\u043C - AFK, embed, channel, \u0438 profile-bio, \u0438 \u0442\u0430\u043A \u0436\u0435 \u0443\u0432\u0435\u043B\u0438\u0447\u0438\u0432\u0430\u0435\u0442 \u0441\u0442\u043E\u0438\u043C\u043E\u0441\u0442\u044C \u0440\u044B\u0431(\u043D\u0430 33%), \u0443\u0432\u0435\u043B\u0438\u0447\u0438\u0432\u0430\u0435\u0442 \u043C\u0430\u043A\u0441. \u0441\u0443\u043C\u043C\u0430 \u043F\u043E\u0434\u0430\u0440\u043A\u0430 \u0434\u043E 5000, \u0430 \u0442\u0430\u043A\u0436\u0435 \u0441\u0442\u0430\u0432\u043A\u0443 \u0432\u0441\u0435\u0445 \u0438\u0433\u0440.",
        inline: false
      }, {
        name: "".concat(status.premium, " \u041F\u0440\u0435\u043C\u0438\u0443\u043C"),
        value: "\u0414\u0430\u0451\u0442 \u0434\u043E\u0441\u0442\u0443\u043F \u043A \u0443\u043D\u0438\u043A\u0430\u043B\u044C\u043D\u044B\u043C \u0433\u0435\u0440\u043E\u044F\u043C, \u0443\u043C\u0435\u043D\u044C\u0448\u0430\u0435\u0442 **cooldown** \u0434\u043B\u044F \u0432\u0441\u0435\u0445 \u043A\u043E\u043C\u0430\u043D\u0434 **\u0434\u0432\u0430** \u0440\u0430\u0437\u0430, \u0430 \u0442\u0430\u043A \u0436\u0435 \u0443\u043C\u0435\u043D\u044C\u0448\u0430\u0435\u0442 \u043E\u0433\u0440\u0430\u043D\u0438\u0447\u0435\u043D\u0438\u0435 \u0441\u0442\u0430\u0432\u043E\u043A \u0434\u043B\u044F \u0432\u0441\u0435\u0445 \u0438\u0433\u0440, \u0443\u0432\u0435\u043B\u0438\u0447\u0438\u0432\u0430\u0435\u0442 \u043C\u0430\u043A\u0441. \u0441\u0443\u043C\u043C\u0430 \u043F\u043E\u0434\u0430\u0440\u043A\u0430 \u0434\u043E 10000.",
        inline: false
      }, {
        name: "\u0426\u0435\u043D\u044B \u0432 \u0440\u0443\u0431\u043B\u044F\u0445.",
        value: "\u2022 VIP + 10000 ".concat(STAR, " - ").concat(rubToDollar(45, formatNumber, "ru"), " \n \u2022 \u041F\u0440\u0435\u043C\u0438\u0443\u043C + 20000 ").concat(STAR, " - ~~").concat(rubToDollar(100, formatNumber, "ru"), "~~ ").concat(rubToDollar(90, formatNumber, "ru"), "\n \u2022 1 ").concat(CRYSTAL, " = 10 ").concat(HELL.candy, " (`?\u043A\u0443\u043F\u0438\u0442\u044C \u043A\u043E\u043D\u0444\u0435\u0442\u044B 10`)\n \u2022 1 ").concat(CRYSTAL, " = 5.000 ").concat(STAR, " (`?\u043A\u0443\u043F\u0438\u0442\u044C \u0433\u043E\u043B\u0434\u044B 100000`)\n \u2022 1000 ").concat(CRYSTAL, " - ").concat(rubToDollar(120, formatNumber, "ru"), "\n \u2022 350 ").concat(CRYSTAL, " - ").concat(rubToDollar(45, formatNumber, "ru"), "\n \u2022 100 ").concat(CRYSTAL, " - ").concat(rubToDollar(20, formatNumber, "ru"), "\n \u2022 \u0414\u043E\u043D\u0430\u0442-\u0431\u043E\u043A\u0441 (50k-200k) - ").concat(rubToDollar(15, formatNumber, "ru")),
        inline: false
      }).setTimestamp().setFooter("Отправьте ваши вопросы командой ?сообщение");
    },
    "items": function items() {
      return new MessageEmbed().setColor(main).setAuthor("Магазин баффов").addField("".concat(item.box.emoji, " ").concat(item.box.NAME, ": ").concat(item.box.cost, " ").concat(STAR), "\u0414\u0430\u0451\u0442 \u0440\u0430\u043D\u0434\u043E\u043C\u043D\u044B\u0439 \u043F\u0440\u0435\u0434\u043C\u0435\u0442, \u0438 \u0434\u043E ".concat(item.box.max, " \u0433\u043E\u043B\u0434\u044B")).addField("".concat(item.megabox.emoji, " ").concat(item.megabox.NAME, ": ").concat(item.megabox.cost, " ").concat(STAR), "\u0414\u0430\u0451\u0442 \u0440\u0430\u043D\u0434\u043E\u043C\u043D\u044B\u0435 \u043F\u0440\u0435\u0434\u043C\u0435\u0442\u044B \u0434\u043E 5, \u0438 \u0434\u043E ".concat(item.megabox.max, " \u0433\u043E\u043B\u0434\u044B")).addField("".concat(item.hlt.emoji, " ").concat(item.hlt.NAME, " : ").concat(item.hlt.cost, " ").concat(STAR), "\u0414\u043E\u0431\u0430\u0432\u043B\u044F\u0435\u0442 \u0433\u0435\u0440\u043E\u044E ".concat(item.hlt.effect, " \u0435\u0434\u0438\u043D\u0438\u0446 \u0436\u0438\u0437\u043D\u0438")).addField("".concat(item.dmg.emoji, " ").concat(item.dmg.NAME, " : ").concat(item.dmg.cost, " ").concat(STAR), "\u0414\u043E\u0431\u0430\u0432\u043B\u044F\u0435\u0442 \u0433\u0435\u0440\u043E\u044E ".concat(item.dmg.effect, " \u0435\u0434\u0438\u043D\u0438\u0446 \u0430\u0442\u0430\u043A\u0443")).addField("".concat(item.lvl.emoji, " ").concat(item.lvl.NAME, " : \u041C\u043E\u0436\u043D\u043E \u043F\u043E\u043B\u0443\u0447\u0438\u0442\u044C \u043E\u0442\u043A\u0440\u044B\u0432\u0430\u044F \u044F\u0449\u0438\u043A\u0438."), "\u0423\u0432\u0435\u043B\u0438\u0447\u0438\u0432\u0430\u0435\u0442 \u0443\u0440\u043E\u0432\u0435\u043D\u044C \u0433\u0435\u0440\u043E\u044F ".concat(item.lvl.effect, " \u0440\u0430\u0437")).addField("".concat(item.meat.emoji, " ").concat(item.meat.NAME, " : \u041C\u043E\u0436\u043D\u043E \u043F\u043E\u043B\u0443\u0447\u0438\u0442\u044C \u043F\u043E\u0431\u0435\u0436\u0434\u0430\u044F \u0431\u043E\u0441\u0441\u043E\u0432 \u0438\u043B\u0438 \u043E\u0442\u043A\u0440\u044B\u0432\u0430\u044F \u044F\u0449\u0438\u043A\u0438."), "\u0414\u043E\u0431\u0430\u0432\u043B\u044F\u0435\u0442 \u0433\u0435\u0440\u043E\u044E ".concat(item.meat.effect, " \u0435\u0434\u0438\u043D\u0438\u0446 \u0436\u0438\u0437\u043D\u0438")).addField("\u041F\u0430\u043A\u0438", "** **").addField("".concat(item.pack1.emoji, " ").concat(item.pack1.NAME, " : ").concat(item.pack1.cost, " ").concat(STAR), "\u041E\u0442\u043A\u0440\u043E\u0439\u0442\u0435 \u0438 \u043F\u043E\u043B\u0443\u0447\u0438\u0442\u0435 \u043E\u0434\u043D\u043E\u0433\u043E \u0438\u0437 \u044D\u0442\u0438\u0445 \u043E\u0431\u044B\u0447\u043D\u044B\u0445 \u0433\u0435\u0440\u043E\u0435\u0432: `".concat(item.pack1.list.map(function (i) {
        return heroes[i].nameRus;
      }).join(", "), "`")).addField("".concat(item.pack2.emoji, " ").concat(item.pack2.NAME, " : ").concat(item.pack2.cost, " ").concat(STAR), "\u041E\u0442\u043A\u0440\u043E\u0439\u0442\u0435 \u0438 \u043F\u043E\u043B\u0443\u0447\u0438\u0442\u0435 \u043E\u0434\u043D\u043E\u0433\u043E \u0438\u0437 \u044D\u0442\u0438\u0445 \u044D\u043B\u0438\u0442\u043D\u044B\u0445 \u0433\u0435\u0440\u043E\u0435\u0432: `".concat(item.pack2.list.map(function (i) {
        return heroes[i].nameRus;
      }).join(", "), "`")).addField("".concat(item.pack3.emoji, " ").concat(item.pack2.NAME, " : ").concat(item.pack3.cost, " ").concat(STAR), "\u041E\u0442\u043A\u0440\u043E\u0439\u0442\u0435 \u0438 \u043F\u043E\u043B\u0443\u0447\u0438\u0442\u0435 \u043E\u0434\u043D\u043E\u0433\u043E \u0438\u0437 \u044D\u0442\u0438\u0445 \u041F\u0440\u0435\u043C\u0438\u0443\u043C \u0433\u0435\u0440\u043E\u0435\u0432: `".concat(item.pack3.list.map(function (i) {
        return heroes[i].nameRus;
      }).join(", "), "`")).addField("".concat(item.heroPack.emoji, " ").concat(item.heroPack.NAME, " : ").concat(item.heroPack.cost, " ").concat(CRYSTAL), "\u041E\u0442\u043A\u0440\u043E\u0439\u0442\u0435 \u0438 \u043F\u043E\u043B\u0443\u0447\u0438\u0442\u0435 \u043E\u0434\u043D\u043E\u0433\u043E \u043B\u044E\u0431\u043E\u0433\u043E \u0433\u0435\u0440\u043E\u044F.").addField("".concat(item.halloween.emoji, " ").concat(item.halloween.NAME, " : ").concat(item.halloween.cost, " ").concat(HELL.candy, " __\u0434\u043E\u0441\u0442\u0443\u043F\u0435\u043D \u0434\u043E 30.11.2021__"), "\u041E\u0442\u043A\u0440\u043E\u0439\u0442\u0435 \u0438 \u043F\u043E\u043B\u0443\u0447\u0438\u0442\u0435 \u043E\u0434\u043D\u043E\u0433\u043E \u0438\u0437 \u044D\u0442\u0438\u0445 \u0432\u0440\u0435\u043C\u0435\u043D\u043D\u044B\u0445 \u0433\u0435\u0440\u043E\u0435\u0432: `".concat(item.halloween.validList.map(function (i) {
        return heroes[i].nameRus;
      }).join(", "), "` \u0438\u043B\u0438 \u043D\u0438\u0447\u0435\u0433\u043E")).addField("".concat(item.donateBox.emoji, " ").concat(item.donateBox.NAME, " : ").concat(rubToDollar(15, formatNumber, "ru")), "\u041E\u0442\u043A\u0440\u043E\u0439\u0442\u0435 \u0438 \u043F\u043E\u043B\u0443\u0447\u0438\u0442\u0435 ".concat(item.donateBox.winRU)).addField("".concat(item.goldBox.emoji, " ").concat(item.goldBox.NAME, " : ").concat(rubToDollar(25, formatNumber, "ru")), "\u041E\u0442\u043A\u0440\u043E\u0439\u0442\u0435 \u0438 \u043F\u043E\u043B\u0443\u0447\u0438\u0442\u0435:  __50-250__ ".concat(CRYSTAL));
    }
  },
  "help": {
    "desc": "Команда помощи.",
    "usage": "[название команды]",
    "access": "Для всех",
    "t1": "Привет! я",
    "t2": "Мой глобальный префикс:",
    "t3": "Мой префикс на этом сервере:",
    "t4": "Ты можешь посмотреть всю информацию о команде написав:",
    "t5": "Кол-во комманд:",
    "info": "Информация",
    "vip": "VIP",
    "rpg": "Ролевая Игра(RPG)",
    "react": "Реакционные",
    "cards": "Карты и Тимы",
    "fun": "Веселье",
    "settings": "Настройки",
    "Usage": "Применение:",
    "avail": "Доступна:",
    "nousage": "Нет применение.",
    "aliases": "Псевдонимы:",
    "dm": "Откройте ваши Личные Сообщения, и попробуйте снова.",
    "noaliases": "Нет псевдонимов.",
    "cmd": "Команда:",
    "Desc": "Описание:",
    "cat": "Категория:",
    "non": "Не правильная команда!",
    "nono": function nono(prefix) {
      return "**\u041F\u0438\u0448\u0438\u0442\u0435 `".concat(prefix, "help` \u0447\u0442\u043E\u0431\u044B \u043F\u043E\u0441\u043C\u043E\u0442\u0440\u0435\u0442\u044C \u0432\u0441\u0435 \u0434\u043E\u0441\u0442\u0443\u043F\u043D\u044B\u0435 \u043A\u043E\u043C\u0430\u043D\u0434\u044B \u0431\u043E\u0442\u0430!**");
    }
  },
  "upgrade": {
    "desc": "Прокачать своего героя.",
    "usage": "[info]",
    "access": "Для всех",
    "info": "Информация о прокачке уровня до",
    "cost": "Стоимость прокачки:",
    "err": "У вас недостаточно голды.\nСтоимость прокачки до следующего уровня",
    "done": "Уровень успешно прокачен до"
  },
  "break-up": {
    "desc": "Расстаться...",
    "usage": "(info)",
    "access": "Для всех",
    "err": "Вы не женаты.",
    "err1": "У вас недостатачно голды — 150",
    "sure": "Вы уверены, что хотите расстаться? За это вы заплатите 150",
    "action": "Действие успешно отклонено.",
    "done": "теперь вы свободны..."
  },
  "journey": {
    "desc": "Пойти в приключения.",
    "usage": "(info)",
    "access": "Для всех",
    "err1": "Сначала купите героя.",
    "now": "ваш текущий уровень приключений:",
    "enemy": "Враг",
    "find": "Ищем противника...",
    "time": function time(_time2) {
      return "\u0412\u044B \u043D\u0435\u0434\u0430\u0432\u043D\u043E \u0432\u0435\u0440\u043D\u0443\u043B\u0438\u0441\u044C \u0438\u0437 \u043F\u0440\u0438\u043A\u043B\u044E\u0447\u0435\u043D\u0438\u0439. \u041E\u0442\u0434\u044B\u0445\u0430\u0439 **".concat(_time2.getMinutes(), " \u043C\u0438\u043D\u0443\u0442 ").concat(_time2.getSeconds(), " \u0441\u0435\u043A\u0443\u043D\u0434.**.");
    },
    "done": "Вы оказались сильнее.",
    "rew": "Награда за уровень:",
    "he": "оказался сильнее.",
    "err": "Вернитесь через некоторое время."
  },
  "sell": {
    "desc": "Продать рыбы.",
    "usage": "[номер рыб]",
    "access": "Для всех",
    "err": "Айди рыб не найдено:",
    "err1": 'Интересно, как продать "ничего".',
    "d1": "Вы продали",
    "d2": "всего за"
  },
  "replace": {
    "desc": "Заменить своего основного героя.",
    "usage": "[номер героя]",
    "access": "Для всех",
    "done": "Ваш основной герой сейчас",
    "err": "У вас один герой."
  },
  "quiz": {
    "desc": "Отвечать на вопросы и получать награды.",
    "usage": "",
    "access": "Для всех",
    "time": "У вас 15 секунд.",
    "question": "Вопрос:",
    "done": "Вы ответили правильно, ваша награда",
    "else": "Вы ответили неправильно.",
    "err": "Время вышло, попробуйте снова."
  },
  "battle": {
    "desc": "Пойти в бой против рандомного героя.",
    "usage": "",
    "access": "Для всех",
    "time": function time(_time3) {
      return "\u041F\u043E\u043F\u0440\u043E\u0431\u0443\u0439 \u0435\u0449\u0435 \u0440\u0430\u0437 \u0447\u0435\u0440\u0435\u0437 **".concat(_time3.getMinutes(), " \u043C\u0438\u043D\u0443\u0442 ").concat(_time3.getSeconds(), " \u0441\u0435\u043A\u0443\u043D\u0434.**.");
    },
    "find": "Ищем противника...",
    "bet": "Укажите ставку.",
    "min": "Минимальная ставка **1**.",
    "vip1": "\u041C\u0430\u043A\u0441\u0438\u043C\u0430\u043B\u044C\u043D\u0430\u044F \u0441\u0442\u0430\u0432\u043A\u0430 **".concat(games.main.none, "**!\n\u041B\u0438\u0431\u043E \u043A\u0443\u043F\u0438\u0442\u0435 __VIP__"),
    "vip2": "\u041C\u0430\u043A\u0441\u0438\u043C\u0430\u043B\u044C\u043D\u0430\u044F \u0441\u0442\u0430\u0432\u043A\u0430 **".concat(games.main.vip, "**!\n\u041B\u0438\u0431\u043E \u043A\u0443\u043F\u0438\u0442\u0435 __\u041F\u0440\u0435\u043C\u0438\u0443\u043C__"),
    "vipError": "\u041C\u0430\u043A\u0441\u0438\u043C\u0430\u043B\u044C\u043D\u0430\u044F \u0441\u0442\u0430\u0432\u043A\u0430 **".concat(games.main.premium, "**!"),
    "winner": "Победитель:",
    "between": "Поединок между"
  },
  "profile": {
    "desc": "Посмотреть профиль участника.",
    "usage": "[ник участника | упоминание | ID]",
    "access": "Для всех",
    "pr": "Профиль:",
    "status": "Статус:",
    "subs": "Подписка:",
    "none": "Неизвестный",
    "clan": "Гильдия:",
    "level": "Уровень:",
    "noclan": "Не состоит в гильдии.",
    "quiz": "Викторина:",
    "gg": "Супруг(-а):",
    "from": "с",
    "fishes": "Рыбы",
    "junk": "Хлам",
    "common": "Обычная",
    "unc": "Необычная",
    "rare": "Редкая",
    "leg": "Легендарная",
    "bio": "Обо мне:"
  },
  "my": {
    "desc": "Информация о своих героев.",
    "usage": "",
    "access": "Для всех",
    'b1': "Предыдущая",
    "b2": "Следующая"
  },
  "marry": {
    "desc": "Пожениться...",
    "usage": "[упоминание | ID]",
    "access": "Для всех",
    "err1": "Вы уже женаты.",
    "time": function time(_time4) {
      return "\u041F\u043E\u043F\u0440\u043E\u0431\u0443\u0439 \u0435\u0449\u0435 \u0440\u0430\u0437 \u0447\u0435\u0440\u0435\u0437 **".concat(Math.round(Math.abs(_time4) / 86400000), " \u0434\u043D\u0435\u0439**.");
    },
    "err2": "Этот участник уже имеет партнёра.",
    "err3": "У вас недостатачно голды — 150",
    "sure": "Предлагает вам свою руку и сердце",
    "ref": "отказался(-ась).",
    "done": "поженились."
  },
  "kill": {
    "desc": "Убить своего героя.",
    "usage": "",
    "access": "Для всех",
    "error": "Укажите героя, которого хотите убить.",
    "notHero": "Герой не найден!",
    "done": "Вы успешно убили своего героя."
  },
  "join": {
    "desc": "Подать заявку на вступление в гильдии.",
    "usage": "[номер гильдии]",
    "access": "Для всех",
    "time": function time(_time5) {
      return "\u041F\u043E\u043F\u0440\u043E\u0431\u0443\u0439 \u0435\u0449\u0435 \u0440\u0430\u0437 \u0447\u0435\u0440\u0435\u0437 **".concat(_time5.getMinutes(), " \u043C\u0438\u043D\u0443\u0442 ").concat(_time5.getSeconds(), " \u0441\u0435\u043A\u0443\u043D\u0434**.");
    },
    "offed": "Заявки на вступление в этой гильдии отключены!",
    "limit": "В этой гильдии достаточно участников!",
    "done": "Вы успешно подали заявку."
  },
  "hero": {
    "desc": "Посмотреть статистику своего героя.",
    "usage": "",
    "access": "Для всех",
    "all": "Сыграно игр:",
    "win": "Выиграно игр:",
    "lose": "Проиграно игр:",
    "journey": "Приключения"
  },
  "gift": {
    "desc": "Подарить голды участнику.",
    "usage": "[ник участника | упоминание | ID] [кол-во голды]",
    "access": "Для всех",
    "error1": "Вы не сможете дарить подарки себе.",
    "error2": "Укажите кол-во голды, чтобы подарить.",
    "error3": "Сначала вы должны пожениться.",
    "error4": "Это не ваша половинка.",
    "vip1": "Максимальная сумма **2500**!\nЛибо купите **VIP**",
    "vip2": "Максимальная сумма **5000**!\nЛибо купите **Премиум**",
    "vipError": "Максимальная сумма **10000**!",
    "time": function time(_time6) {
      return "\u041F\u043E\u043F\u0440\u043E\u0431\u0443\u0439 \u0435\u0449\u0435 \u0440\u0430\u0437 \u0447\u0435\u0440\u0435\u0437 **".concat(_time6.getUTCHours(), " \u0447\u0430\u0441\u0430(-\u043E\u0432) ").concat(_time6.getMinutes(), " \u043C\u0438\u043D\u0443\u0442.**");
    },
    "doing": "Подарок отправляется...",
    "min": "Минимальная сумма **10**."
  },
  "ship": {
    "desc": "Показывает совместимость с участникамии и обычными предметами.",
    "usage": "[ник участника | упоминание | ID | какой-то предмет]",
    "access": "Для всех",
    "error": "Укажите что-то.",
    "done1": "Твоя совместимость с",
    "done2": "Любовь между"
  },
  "buy": {
    "desc": "Купить героя.",
    "usage": "[слот или герой]",
    "access": "Для всех",
    "time": function time(_time7) {
      return "\u0412\u044B \u043D\u0435\u0434\u0430\u0432\u043D\u043E \u043A\u0443\u043F\u0438\u043B\u0438 \u043D\u043E\u0432\u044B\u0439 \u0433\u0435\u0440\u043E\u0439.\n\u041F\u043E\u043F\u0440\u043E\u0431\u0443\u0439 \u0435\u0449\u0435 \u0440\u0430\u0437 \u0447\u0435\u0440\u0435\u0437 **".concat(Math.round(Math.abs(_time7) / 86400000), " \u0434\u043D\u0435\u0439 ").concat(_time7.getUTCHours(), " \u0447\u0430\u0441\u0430(-\u043E\u0432)**.");
    },
    "specHero": "Укажите предмет.",
    "req": "Сколько предметов вы хотите?\nНапример: `3`",
    "need": "Вам нужно - ",
    "itemErr": "Предмет не найден.",
    "noItem": "Этот предмет не доступен.",
    "nh": "Герой не найден.",
    "event": function event(f, s, fe, se) {
      return "\u0412\u044B \u0443\u0441\u043F\u0435\u0448\u043D\u043E \u043A\u0443\u043F\u0438\u043B\u0438 __".concat(f, "__ ").concat(fe, " \u0437\u0430 __").concat(s, "__ ").concat(se);
    },
    "vip": "Этот герой доступен только для __Премиум__ пользователей.",
    "love": "Вы должны быть в любви, чтобы купить этого героя.",
    "place": "У вас недостаточно мест.",
    "already": "Вы уже имеете этого героя.",
    "donePlace": "Вы успешно купили дополнительное место для героев.",
    "errPlace": "Вы уже купили дополнительное место.",
    "subError": "Вам нужна как минимум подписка",
    "error": "У вас недостаточно голды, либо герой недоступен.",
    "done": function done(name) {
      return "\u0412\u044B \u0443\u0441\u043F\u0435\u0448\u043D\u043E \u043A\u0443\u043F\u0438\u043B\u0438 \u2014 __".concat(name, "__.");
    },
    "not": "Этот герой недоступен.",
    "pick": "Выберите героя",
    "err": "Вы уже имеете достаточно героев, сначала убейте одного, чтобы купить новый."
  },
  "fish": {
    "desc": "Поймать рыбу.",
    "usage": "(list)",
    "access": "Для всех",
    "time": function time(_time8) {
      return "\u0412\u044B \u043D\u0435\u0434\u0430\u0432\u043D\u043E \u0440\u044B\u0431\u0430\u0447\u0438\u043B\u0438.\n\u041F\u043E\u043F\u0440\u043E\u0431\u0443\u0439 \u0435\u0449\u0435 \u0440\u0430\u0437 \u0447\u0435\u0440\u0435\u0437 **".concat(_time8.getMinutes(), " \u043C\u0438\u043D\u0443\u0442 ").concat(_time8.getSeconds(), " \u0441\u0435\u043A\u0443\u043D\u0434.**");
    },
    "done": function done(symbol) {
      return "**\uD83C\uDFA3 \u0412\u044B \u0437\u0430\u0431\u0440\u043E\u0441\u0438\u043B\u0438 \u0441\u0432\u043E\u044E \u0443\u0434\u043E\u0447\u043A\u0443 \u0438 \u043F\u043E\u0439\u043C\u0430\u043B\u0438 ".concat(symbol, "**!");
    },
    "title": "Список рыб, их редкости.",
    "list": function list() {
      return "\n        ```\uD83D\uDD27\u0425\u043B\u0430\u043C      :: [ID: 1]\n\uD83D\uDC1F\u041E\u0431\u044B\u0447\u043D\u0430\u044F    :: [ID: 2]\n\uD83D\uDC20\u041D\u0435\u043E\u0431\u044B\u0447\u043D\u0430\u044F  :: [ID: 3]\n\uD83E\uDD91\u0420\u0435\u0434\u043A\u0430\u044F      :: [ID: 4]\n\uD83D\uDC0B\u041B\u0435\u0433\u0435\u043D\u0434\u0430\u0440\u043D\u0430\u044F :: [ID: 5]```\n        \n        \u200B\u0427\u0435\u043C \u0431\u043E\u043B\u044C\u0448\u0435 \u0440\u044B\u0431, \u0442\u0435\u043C \u0431\u043E\u043B\u044C\u0448\u0430\u044F \u0446\u0435\u043D\u0430!\n        ";
    }
  },
  "daily": {
    "desc": "1 селендиан и лут-бокс ежедневно.",
    "usage": "",
    "access": "Для всех",
    "time": function time(_time9) {
      return "\u0422\u044B \u0443\u0436\u0435 \u0441\u043E\u0431\u0440\u0430\u043B \u0441\u0432\u043E\u0439 \u0435\u0436\u0435\u0434\u043D\u0435\u0432\u043D\u044B\u0439 \u043F\u0440\u0438\u0437.\n\n\u041F\u043E\u043F\u0440\u043E\u0431\u0443\u0439 \u0435\u0449\u0435 \u0440\u0430\u0437 \u0447\u0435\u0440\u0435\u0437 **".concat(_time9.getUTCHours(), " \u0447\u0430\u0441\u0430(\u043E\u0432) ").concat(_time9.getMinutes(), " \u043C\u0438\u043D\u0443\u0442.**");
    },
    "done": "Ваш ежедневный приз:"
  },
  "duel": {
    "desc": "Пойти в бой с участником.",
    "usage": "[ник | упоминание | ID]",
    "access": "Для всех",
    "time": function time(_time10) {
      return "\u041F\u043E\u043F\u0440\u043E\u0431\u0443\u0439 \u0435\u0449\u0435 \u0440\u0430\u0437 \u0447\u0435\u0440\u0435\u0437 **".concat(_time10.getMinutes(), " \u043C\u0438\u043D\u0443\u0442 ").concat(_time10.getSeconds(), " \u0441\u0435\u043A\u0443\u043D\u0434.**.");
    },
    "bot": "Поединок с боссом...хм",
    "error1": "Укажите другого участника.",
    "error2": "Вы не имеете героя.",
    "error3": "Участник не имеет героя.",
    "buttonReject": "Отклонить",
    "buttonAccept": "Принять",
    "invite": " у вас 20 секунд, чтобы принять вызов.",
    "refused": "отказался.",
    "find": "Ищем противника...",
    "winner": "Победитель:",
    "among": "Поединок между:"
  },
  "guilds": {
    "desc": "Все гильдии.",
    "usage": "",
    "access": "Для всех",
    "lvl": "Ур.",
    "members": "Участники:",
    "budget": "Бюджет:",
    "clans": "Все гильдии",
    "noClans": "Ни одна гильдия не найдена."
  },
  "guild": {
    "desc": "Информация гильдии.",
    "usage": "[help]",
    "access": "Для всех",
    "trans": "Перевожу...",
    "unk": "Неизвестный",
    "min": function min(star) {
      return "\u041C\u0438\u043D\u0438\u043C\u0430\u043B\u044C\u043D\u0430\u044F \u0441\u0443\u043C\u043C\u0430 \u2014 __10__ ".concat(star);
    },
    "done": function done(val, emoji) {
      return "\u0412\u044B \u0443\u0441\u043F\u0435\u0448\u043D\u043E \u043F\u0435\u0440\u0435\u0434\u0430\u043B\u0438 \u0441\u0432\u043E\u0435\u0439 \u0433\u0438\u043B\u044C\u0434\u0438\u0438 __".concat(val, "__ ").concat(emoji);
    },
    "actions": "Все доступные функции!",
    "helpCommand": function helpCommand(star, clan) {
      var text = "\n            `guild (\u0447\u0438\u0441\u043B\u043E)` \u2014 \u0421\u043A\u0438\u043D\u0443\u0442\u044C \u0433\u043E\u043B\u0434\u044B \u0432 \u0431\u044E\u0434\u0436\u0435\u0442 \u0433\u0438\u043B\u044C\u0434\u0438\u0438. ( __2 ".concat(star, "__ = __1 ").concat(clan, "__ )\n            `guild create [\u043D\u0430\u0437\u0432\u0430\u043D\u0438\u0435]` \u2014 \u0421\u043E\u0437\u0434\u0430\u0442\u044C \u0441\u0432\u043E\u044E \u0433\u0438\u043B\u044C\u0434\u0438\u044E (\u0446\u0435\u043D\u0430 5000 ").concat(star, ")\n            `guild kick [\u043D\u043E\u043C\u0435\u0440 \u0443\u0447\u0430\u0441\u0442\u043D\u0438\u043A\u0430]` \u2014 \u0412\u044B\u0433\u043D\u0430\u0442\u044C \u0443\u0447\u0430\u0441\u0442\u043D\u0438\u043A\u0430 \u0438\u0437 \u0433\u0438\u043B\u044C\u0434\u0438\u0438.\n            `guild up [\u043D\u043E\u043C\u0435\u0440 \u0443\u0447\u0430\u0441\u0442\u043D\u0438\u043A\u0430]` \u2014 \u041F\u043E\u0432\u044B\u0441\u0438\u0442\u044C \u0443\u0447\u0430\u0441\u0442\u043D\u0438\u043A\u0430.\n            `guild down [\u043D\u043E\u043C\u0435\u0440 \u0443\u0447\u0430\u0441\u0442\u043D\u0438\u043A\u0430]` \u2014 \u041F\u043E\u043D\u0438\u0437\u0438\u0442\u044C \u0443\u0447\u0430\u0441\u0442\u043D\u0438\u043A\u0430.\n            `guild apps` \u2014 \u041F\u043E\u0441\u043C\u043E\u0442\u0440\u0435\u0442\u044C \u0437\u0430\u044F\u0432\u043A\u0438 \u0433\u0438\u043B\u044C\u0434\u0438\u0438.\n            `guild apps clear` \u2014 \u0423\u0434\u0430\u043B\u0438\u0442\u044C \u0432\u0441\u0435 \u0437\u0430\u044F\u0432\u043A\u0438.\n            `guild apps enable` \u2014 \u0412\u043A\u043B\u044E\u0447\u0438\u0442\u044C \u0437\u0430\u044F\u0432\u043A\u0438 \u0434\u043B\u044F \u0432\u0441\u0442\u0443\u043F\u043B\u0435\u043D\u0438\u0438 \u0432 \u0433\u0438\u043B\u044C\u0434\u0438\u044E.\n            `guild apps disable` \u2014 \u041E\u0442\u043A\u043B\u044E\u0447\u0438\u0442\u044C \u0437\u0430\u044F\u0432\u043A\u0438 \u0434\u043B\u044F \u0432\u0441\u0442\u0443\u043F\u043B\u0435\u043D\u0438\u0438 \u0432 \u0433\u0438\u043B\u044C\u0434\u0438\u044E.\n            `guild reject [\u043D\u043E\u043C\u0435\u0440 \u0437\u0430\u044F\u0432\u043A\u0438]` \u2014 \u041E\u0442\u043A\u043B\u043E\u043D\u0438\u0442\u044C \u0437\u0430\u044F\u0432\u043A\u0443 \u0443\u0447\u0430\u0441\u0442\u043D\u0438\u043A\u0430.\n            `guild accept [\u043D\u043E\u043C\u0435\u0440 \u0437\u0430\u044F\u0432\u043A\u0438]` \u2014 \u041F\u0440\u0438\u043D\u044F\u0442\u044C \u0443\u0447\u0430\u0441\u0442\u043D\u0438\u043A\u0430 \u0432 \u0433\u0438\u043B\u044C\u0434\u0438\u044E.\n            `guild upgrade (info)` \u2014 \u0423\u043B\u0443\u0447\u0448\u0438\u0442\u044C \u0433\u0438\u043B\u044C\u0434\u0438\u044E.\n            `guild description [\u0442\u0435\u043A\u0441\u0442]` \u2014 \u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u0434\u043B\u044F \u0433\u0438\u043B\u044C\u0434\u0438\u0438.\n            `guild logo [\u0441\u0441\u044B\u043B\u043A\u0430 \u043D\u0430 \u043B\u043E\u0433\u043E]` \u2014 \u041B\u043E\u0433\u043E\u0442\u0438\u043F \u0434\u043B\u044F \u0433\u0438\u043B\u044C\u0434\u0438\u0438.\n            `guild reward` \u2014 \u041F\u043E\u043B\u0443\u0447\u0438\u0442\u044C \u0435\u0436\u0435\u0434\u043D\u0435\u0432\u043D\u044B\u0435 \u0433\u043E\u043B\u0434\u044B.\n            `guild leave` \u2014 \u0412\u044B\u0439\u0442\u0438 \u0438\u0437 \u0433\u0438\u043B\u044C\u0434\u0438\u0438.\n            `guild delete` \u2014 \u0423\u0434\u0430\u043B\u0438\u0442\u044C \u0433\u0438\u043B\u044C\u0434\u0438\u044E.\n            `guild message` \u2014 \u041E\u0442\u043F\u0440\u0430\u0432\u043B\u044F\u0442\u044C \u0441\u043E\u043E\u0431\u0449\u0435\u043D\u0438\u0435 \u043A\u0430\u0436\u0434\u043E\u043C\u0443 \u0443\u0447\u0430\u0441\u0442\u043D\u0438\u043A\u0443.\n            `guild give (\u0441\u0443\u043C\u043C\u0430)` \u2014 \u0418\u0441\u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u044C \u0431\u044E\u0434\u0436\u0435\u0442 \u0438 \u043E\u0442\u0434\u0430\u0442\u044C \u043A\u0430\u0436\u0434\u043E\u043C\u0443 \u0443\u0447\u0430\u0441\u0442\u043D\u0438\u043A\u0443 \u043D\u0435\u043C\u043D\u043E\u0433\u043E \u0433\u043E\u043B\u0434\u044B.\n            `guild shop` \u2014 \u041C\u0430\u0433\u0430\u0437\u0438\u043D \u0433\u0438\u043B\u044C\u0434\u0438\u0438.\n            ");
      return text;
    },
    // shop
    "cost": "Цена:",
    "shopName": "Магазин гильдии",
    "bonusHealth": "Бонус жизни героев:",
    "bonusDamage": "Бонус атаки героев:",
    "forEach": "для всех участников.",
    "write": "Напишите номер предмета, чтобы купить.",
    "notAvailableLimit": "Этот предмет больше не доступен вам!",
    // create
    "doing": "Выполняю запрос...",
    "name": "Укажите название гильдии.",
    "doneC": "Вы успешно создали свою гильдию!",
    // kick
    "noMember": "Участник гильдии не найден!",
    "uLeader": "Вы — лидер гильдии.",
    "uStaff": "Невозможно выгнать сотрудника.",
    "kicked": function kicked(name) {
      return "\u0412\u044B \u0443\u0441\u043F\u0435\u0448\u043D\u043E \u0432\u044B\u0433\u043D\u0430\u043B\u0438 \u0443\u0447\u0430\u0441\u0442\u043D\u0438\u043A\u0430 __".concat(name, "__ .");
    },
    // apps
    "appsE": "Заявки успешно включены.",
    "appsEE": "Заявки и так включены!",
    "appsD": "Заявки успешно отключены.",
    "appsDD": "Заявки и так отключены!",
    "appsClear": "Все заявки отклонены.",
    "appsError": "Вы не лидер гильдии, либо что-то указали неверно.",
    "appType": {
      "m": 'Участник:',
      "h": "Герой:",
      "l": "Уровень:"
    },
    "apps": "Все заявки!",
    // reject
    "appError": "Заявка не найдена.",
    "rejDone": "Заявка успешно отклонена.",
    // accept
    "accepting": "Принимаю...",
    "enoughMembers": "В вашей гильдии достаточно участников, улучшайте уровень гильдии.",
    "already": "Этот участник уже состоит в другой гильдии.",
    "acceptDone": "Заявка успешно принята.",
    // upgrade
    "upLimit": "Ваша гильдия максимально улучшена!",
    "upInfoTitle": "Информация об улучшении гильдии.",
    "upInfo": function upInfo(cost, emoji, space, level) {
      return "\u0426\u0435\u043D\u0430 \u2014 __".concat(cost, "__ ").concat(emoji, "\n\u0427\u0438\u0441\u043B\u043E \u043C\u0430\u043A\u0441\u0438\u043C\u0430\u043B\u044C\u043D\u044B\u0445 \u0443\u0447\u0430\u0441\u0442\u043D\u0438\u043A\u043E\u0432: __").concat(space, "__ + __5__\n").concat(level === 5 ? 'Будут доступны описание и логотип гильдии!' : '');
    },
    "upVip": "Вы должны иметь как минимум __VIP__ чтобы улучшить гильдию.",
    "upDo": "Улучшаю...",
    "errorRub": "Недостаточно рубинов!",
    "upped": function upped(level) {
      return "\u0423\u0440\u043E\u0432\u0435\u043D\u044C \u0433\u0438\u043B\u044C\u0434\u0438\u0438 \u0443\u0441\u043F\u0435\u0448\u043D\u043E \u0443\u043B\u0443\u0447\u0448\u0435\u043D \u0434\u043E __".concat(level, "__.");
    },
    // description
    "descError": "Укажите описание.",
    "clanLevel5": "Эта функция доступна для гильдий с уровнем 5 или выше.",
    "descDone": "Описание гильдии успешно установлено.",
    // logo
    "logoDone": "Логотип гильдии успешно установлен.",
    // delete
    "quest": "Вы уверены, что хотите удалить гильдию?",
    "canceled": "Дейстие успешно отклонено",
    "deleteDone": "Вы успешно удалили свою гильдию.",
    // reward
    "rewardTime": function rewardTime(time) {
      return "\u041F\u043E\u043F\u0440\u043E\u0431\u0443\u0439 \u0435\u0449\u0435 \u0440\u0430\u0437 \u0447\u0435\u0440\u0435\u0437 **".concat(time.getUTCHours(), " \u0447\u0430\u0441\u0430(-\u043E\u0432) ").concat(time.getMinutes(), " \u043C\u0438\u043D\u0443\u0442**.");
    },
    "getReward": function getReward(val, emoji) {
      return "\u0412\u0441\u0435 \u0443\u0447\u0430\u0441\u0442\u043D\u0438\u043A\u0438 \u0433\u0438\u043B\u044C\u0434\u0438\u0438 \u043F\u043E\u043B\u0443\u0447\u0438\u043B\u0438 \u043F\u043E \u2014 __".concat(val, "__ ").concat(emoji);
    },
    // leave
    "leaveQuest": "Вы уверены, что хотите выйти из гильдии?",
    "ldCant": "Лидер не может покинуть гильдию.",
    "leaveDone": "Вы успешно вышли из гильдии.",
    // up
    "uError": "Этого участника вы уже повысили.",
    "uLimit": "Вы уже имеете достаточно сотрудников.",
    "uDone": "Вы успешно повысили участника.",
    // down
    "dError": "Невозможно понизить этого участника.",
    "dDone": "Вы успешно понизили участника.",
    // message
    "mTitle": "У вас сообщение от лидера гильдии",
    "mDone": "Сообщение было успешно отправлено всем.",
    // action error
    "actionError": "Укажите действие.\n\`guild help\`"
  },
  "boss": {
    "desc": "Бой с боссом.",
    "usage": "[ник | упоминание | ID] 2 участников",
    "access": "Для всех",
    "wait": "Подождите минуту.",
    "time": function time(_time11) {
      return "\u041F\u043E\u043F\u0440\u043E\u0431\u0443\u0439 \u0441\u043D\u043E\u0432\u0430 \u0447\u0435\u0440\u0435\u0437 __".concat(_time11.getUTCHours(), " \u0447\u0430\u0441\u0430(-\u043E\u0432) ").concat(_time11.getMinutes(), " \u043C\u0438\u043D\u0443\u0442__.");
    },
    "error": "Укажите 2х участников.",
    "error1": "Укажите другого участника.",
    "secondH": "Второй участник не имеет героя.",
    "thirdH": "Третий участник не имеет героя.",
    "invite": "вас приглашают в «Бой с Боссом», у вас 20 секунд.\n\`Нажмите на свой ник\`",
    "got1": "Первый участник согласился.",
    "got2": "Второй участник согласился.",
    "ref1": "Первый участник отказался.",
    "ref2": "Второй участник отказался.",
    "timeError": "Время вышло!",
    "connect": "Подключаю вас с боссом.",
    "turned": "оказался сильнее.",
    "gaveUp": "сдался.",
    "gets": "Каждый получает по",
    "lost": "проиграли",
    "won": "выиграли",
    "button1": "Отказаться",
    "button2": "Согласиться"
  },
  "avatar": {
    "desc": "Показывает аватарку участника.",
    "AVATAR": "Аватар",
    "usage": "[ник участника | упоминание | ID] (По желанию)",
    "access": "Для всех"
  },
  "botinfo": {
    "desc": "Информация о боте.",
    "usage": "",
    "access": "Для всех",
    "title": "Информация о боте!",
    "field1": "Название:",
    "create": "Создано в:",
    "dev": "Разработчик: ",
    "prefix": "Глобальный префикс: ",
    "link": "Boosty",
    "inv": "Boosty Аккаунт Разработчика:",
    "support": "Наш Дискорд сервер:"
  },
  "ranks": {
    "desc": "Посмотреть топ активных участников.",
    "usage": "(удалить) [ранг]",
    "access": "Для всех",
    "f1": "Топ 10 активных участников!",
    "f2": "**Система уровней для этого сервера отключена!**",
    "f3": "**Тут пока никого нет.**",
    "del": "удалить",
    "buttonName1": "Отменить",
    "buttonName2": "Удалить",
    "serious": "Вы уверены, что хотите удалить данные участника?",
    "canceled": "Дейстие успешно отклонено.",
    "done": "Вы успешно удалили данные участника",
    "level": "Уровень:",
    "xp": "Опыт:",
    "top20": "Топ 20 активных участников!",
    "top30": "Топ 30 активных участников!"
  },
  "message": {
    "desc": "Оставить отзыв разработчику бота.",
    "usage": "[ваше сообщение]",
    "access": "Для всех",
    "time": function time(_time12) {
      return "\u041F\u043E\u043F\u0440\u043E\u0431\u0443\u0439 \u0441\u043D\u043E\u0432\u0430 \u0447\u0435\u0440\u0435\u0437 **".concat(_time12.getMinutes(), " \u043C\u0438\u043D\u0443\u0442 ").concat(_time12.getSeconds(), " \u0441\u0435\u043A\u0443\u043D\u0434**.");
    },
    "error": "Оставьте сообщение.",
    "done": "Спасибо за отзыв, мы рассмотрим ваше сообщение.\nУбедитесь, что ваши личные сообщения открыты."
  },
  "rank": {
    "desc": "Посмотреть ранг участника по активности.",
    "usage": "[участник]",
    "access": "Для всех",
    "offed": "Система уровней для этого сервера отключена!",
    "notBot": "Боты не имеют профиль!",
    "error": "Участник пока не имеет ранг!",
    "level": "Уровень",
    "xp": "Опыт",
    "rank": "Ранг"
  },
  "server": {
    "desc": "Выдает информацию о сервере.",
    "usage": "",
    "access": "Для всех",
    "f1": 'Информация о сервере',
    "f2": 'Каналы:',
    "f3": 'Вы зашли:',
    "f4": 'Создано в:',
    "f5": 'Создатель:',
    "f6": 'Участников:',
    "f7": 'Онлайн:',
    "f8": 'Оффлайн:',
    "f9": 'Категорий:',
    "f10": 'Верифицирован:',
    "f11": 'Пользовательские команды.'
  },
  "status": {
    "desc": "Информация о статусе участника.",
    "usage": "[ник участника | упоминание | ID]",
    "access": "Для всех",
    "error1": "Статус не найден!",
    "error2": 'Этот участник не имеет статус!',
    "custom": "Польз. статус",
    "type": "Тип:",
    "playing": "Играет:",
    "game": "Игра:",
    "details": "Детали:",
    "not": "Не найден",
    "working": "Работает над:",
    "title": "Spotify Трек Инфо",
    "name": "Название песни:",
    "album": "Альбом",
    "author": "Автор",
    "listen": "Слушать в Spotify"
  },
  "user": {
    "desc": "Выдает информацию об участнике.",
    "usage": "[ник участника | упоминание | ID]",
    "access": "Для всех",
    "custom": "Польз. статус",
    "playing": "Играет в:",
    "listening": "Слушает:",
    "watching": "Смотрит:",
    "streaming": "Стримит:",
    "name": "Имя пользователя:",
    "author": "Информация об участнике",
    "f1": "Дата регистрации:",
    "f2": "Присоединился:",
    "f3": "Кол-во ролей:",
    "f4": "Самая высокая роль:",
    "f5": "Количество сообщений в течении одного дня:"
  },
  "bite": {
    "desc": "Укусить участника.",
    "usage": "[ник | упоминание | ID]",
    "access": "Для всех",
    "error1": "Вы не сможете укусить себя.",
    "done": "укусил(-а)"
  },
  "cry": {
    "desc": "Просто поплакать...",
    "usage": "[ник | упоминание | ID]",
    "access": "Для всех",
    "done1": "расплакался(-ась) из-за",
    "done2": "расплакался(-ась)."
  },
  "feed": {
    "desc": "Покормить участника.",
    "usage": "[ник | упоминание | ID]",
    "access": "Для всех",
    "error": "Ты не сможешь покормить себя.",
    "done": "покормил(-а)"
  },
  "hug": {
    "desc": "Обнять кого-то.",
    "usage": "[ник | упоминание | ID]",
    "access": "Для всех",
    "error": "Ты не сможешь обнять себя.",
    "done": "обнял(-а)"
  },
  "kiss": {
    "desc": "Поцеловать кого-то.",
    "usage": "[ник | упоминание | ID]",
    "access": "Для всех",
    "error": "Ты не сможешь поцеловать себя.",
    "done": "поцеловал(-а)",
    "already": "Этот участник уже занят.",
    "fidelity": "Где твоя верность?",
    "button1": "Отказаться",
    "button2": "Согласиться",
    "question": "Хочет с вами поцеловаться",
    "refused": "отказался(-ась)"
  },
  "pat": {
    "desc": "Погладить кого-то.",
    "usage": "[ник | упоминание | ID]",
    "access": "Для всех",
    "error": "Ты не сможешь погладить себя.",
    "done": "погладил(-а)"
  },
  "poke": {
    "desc": "Тыкнуть кого-то.",
    "usage": "[ник | упоминание | ID]",
    "access": "Для всех",
    "error": "Ты не сможешь тыкнуть себя.",
    "done": "тыкнул(-а)"
  },
  "slap": {
    "desc": "Шлёпнуть кого-то.",
    "usage": "[ник | упоминание | ID]",
    "access": "Для всех",
    "error": "Ты не сможешь шлёпнуть себя.",
    "done": "шлёпнул(-а)"
  },
  "smoke": {
    "desc": "Просто покурить.",
    "usage": "",
    "access": "Для всех",
    "done": "курит."
  },
  "tickle": {
    "desc": "Щекотать кого-то.",
    "usage": "[ник | упоминание | ID]",
    "access": "Для всех",
    "error": "Ты не сможешь Щекотать себя.",
    "done": "пощекотал(-а)"
  },
  "afk": {
    "desc": "Войти в режим AFK.",
    "usage": "[сообщение]",
    "access": "Для VIP",
    "error": "Сообщение не может быть ссылкой.",
    "done1": "Вы вошли в режим AFK",
    "done2": "Вы вышли из режима AFK",
    "args": "Укажите причину чтобы войти в режим AFK."
  },
  "embed": {
    "desc": "Отправлять сообщение на указанном канале в формате EMBED.",
    "usage": "[упоминание канала] [цвет hex] [текст]",
    "access": "Для VIP и Администратора",
    "error1": "Укажите #текстовый канал.",
    "error2": "Укажите цвет эмбед.",
    "error3": "Укажите доступный #текстовый канал."
  },
  "channel": {
    "desc": "Отправлять сообщение на указанном канале.",
    "usage": "[упоминание канала] [текст]",
    "access": "Для VIP и Администратора",
    "error1": "Укажите #текстовый канал.",
    "error2": "Укажите доступный #текстовый канал."
  },
  "bio": {
    "desc": "Описание для вашего профиля.",
    "usage": "[текст]",
    "access": "Для VIP",
    "done": "Успешно установленo новoe био профиля."
  },
  "profile-image": {
    "desc": "Картина для вашего профиля.",
    "usage": "[ссылка]",
    "access": "Для Премиум",
    "done": "Успешно установлена новая картина профиля."
  },
  "rank-color": {
    "desc": "Установить цвет для текста на ранг-карту",
    "usage": "[цвет hex]",
    "access": "Для Премиум",
    "error": "Укажите цвет.\nПример: \`#ff00ff или ff00ff\`",
    "done": "Успешно установлена новая картинка для ранг-карточки."
  },
  "rank-image": {
    "desc": "Картина для вашей ранг-карточки.",
    "usage": "[ссылка]",
    "access": "Для Премиум",
    "done": "Успешно установлена новая картина ранг-карточки."
  },
  "burn": {
    "desc": "Сжечь участников.",
    "usage": "(упоминание | ID | ник)",
    "access": "Для всех"
  },
  "rip": {
    "desc": "Эхх...",
    "usage": "(упоминание | ID | ник)",
    "access": "Для всех"
  },
  "trigger": {
    "desc": "Триггер аватарка участника.",
    "usage": "(упоминание | ID | ник)",
    "access": "Для всех"
  },
  "custom": {
    "desc": "Создать новую пользовательскую команду.",
    "usage": "[название] [ответ]",
    "access": "Для Администратора",
    "name": "Укажите название.",
    "resp": "Укажите ответ команды.",
    "done": "Успешно создана новая команда",
    "updated": "Успешно обновлена команда"
  },
  "delete": {
    "desc": "Удалить пользовательскую команду.",
    "usage": "[название]",
    "access": "Для Администратора",
    "name": "Укажите название.",
    "err": function err(cmd) {
      return "\u041A\u043E\u043C\u0430\u043D\u0434\u0430 __".concat(cmd, "__ \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u0430.");
    },
    "done": "Команда успешно удалена."
  },
  "ranking": {
    "desc": "Включить/Отключить систему рангов.",
    "usage": "[enable | disable]",
    "access": "Для Администратора",
    "error": "Укажите действие\nПример: \`?ranking enable\`.",
    "button1": "Отменить",
    "button2": "Удалить",
    "sure": "Вы уверены, что хотите отключить и сбросить систему рангов?",
    "canceled": "Действие успешно отклонено.",
    "done": "Система уровней успешно сброшена и отключена.",
    "done1": "Система рангов и так отключена.",
    "done2": "Система рангов теперь включена.",
    "done3": "Система рангов и так включена.",
    "done4": "Действие не найдено."
  },
  "prefix": {
    "desc": "Поменять префикс сервера.",
    "usage": "[префикс]",
    "access": "Для Администратора",
    "now": "Префикс сервера:",
    "err": "Укажите новый префикс.",
    "err1": "Укажите другой префикс.",
    "done": "Новый префикс сервера:"
  },
  "welcome": {
    "desc": "Включить/Отключить приветствие сервера.",
    "usage": "[действие] [параметр]",
    "access": "Для Администратора",
    "error": "Укажите действие\n\`?welcome info\`\nДействия: \`image, text, color, channel\`",
    "done": "Приветствие включено.",
    "done1": "Приветствие и так включено.",
    "done2": "Приветствие отключено.",
    "done4": "Приветствие и так отключено.",
    "now": "Приветствие сервера.",
    "image": "Картина",
    "text": "Текст",
    "color": "Цвет",
    "channel": "Канал",
    "not": "Не найдено.",
    "spec": "Укажите параметр\nПомощь: \`?welcome image help\`",
    "helpImage": "\`?welcome image [ссылка]\`",
    "imageDone": "Успешно установлена картина для приветствие.",
    "LINK": "Ссылка",
    "helpText": "\`?welcome text [ваш текст]\`",
    "textDone": "Успешно установлен текст сообщений для приветствие.",
    "helpColor": "\`?welcome color [hex цвет]\`",
    "colorDone": "Успешно установлен цвет сообщений для приветствие.",
    "channelHelp": "\`?welcome channel [название канала | ID | упоминание]\`",
    "channelDone": "Успешно установлен канал сообщений для приветствие.",
    "channelError": "Канал не найден.",
    "err": "Action not found."
  }
};