const {MessageEmbed} = require("discord.js");
const { COIN, BANK, STAR } = require('../config');
const {greenlight, redlight, main} = require('../JSON/colours.json');
const heroes = require('../JSON/heroes.json');
const item = require('../JSON/items');

module.exports = {   
    "previous": "Предыдущая",
    "next": "Следующая",
    "notUser": "Участник не найден.",
    "specify": "Укажите участника.",
    "specifyT": "Укажите текст.",
    "vipOne": "Эта команда доступна только для __VIP 1__ пользователей.",
    "vipTwo": "Эта команда доступна только для __VIP 2__ пользователей.",
    "maxLimit": num => `Максимальное количество текста __${num}__ символов!`,
    "perm": "У вас недостаточно прав.",
    "specifyL": "Укажите ссылку.",
    "waiting": "Ждите...",
    "loading": "Ищу противника",
    "and": "и",
    "buttonYes": "Да",
    "buttonNo": "Нет",
    "noStar": "У вас недостаточно голды.",

    "afkMess": (name, res) => `Пользователь **${name}** в данный момент в режиме АФК\nПо причине: **${res}**`,
    

    "heroModel": {
        "health": "Жизнь:",
        "damage": "Атака:",
        "level": "Уровень:",
        "battle": "Битва началась!",
        "winrate": "Процент побед:",
        "reward": "Выигрыш:",
        "noHero": "Вы не имеете героя."
    },

    

    "clanModel": {
        "noClan": "Вы не состоите в клане.",
        "clan": "Вы уже состоите в клане.",
        "notClan": "Клан не найден.",
        "leader": "Лидер:",
        "level": "Уровень:",
        "budget": "Бюджет:",
        "reward": "Награда:",
        "members": "Участники",
        "noMembers": "Пусто",
        "specN": "Укажите номер.",
        "notLeader": "Вы не лидер клана.",
        "noApps": "Нет заявок.",
        "noHero": "Нет героя"
    },



    "tasks": {
        "desc": "Посмотреть свои задания.",
        "usage": "",
        "access": "Для всех",
    },



    "leaderboard": {
        "desc": "Отображает все топы.",
        "usage": "[тип]",
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
        "desc": "Отдать героя участнику за количество голды.",
        "usage": "[имя героя] [упоминание | ID] [цена]",
        "access": "Для всех",
        "specH": "Укажите героя.",
        "cost": "Укажите цену.",
        "noHero": "Герой не найден.",
        "min": "Минимальная сумма __100__.",
        "not": "Вы не можете продать этого героя.",
        "double": "Цена не может быть больше чем два раза.",
        "sure": (trans, cost) => `предлагает вам героя __${trans}__ за __${cost}__`,
        "find": "Ищу участника...",
        "place": "Этот участник имеет достаточно героев.",
        "already": "Этот участник уже имеет этого героя.",
        "star": "Этот участник не имеет столько голды.",
        "sell": (name, cost) => `Вы продали героя: __${name}__ за __${cost}__(20% налог)`
    },



    "reputation": {
        "desc": "Поднять репутацию сервера.",
        "usage": "",
        "access": "Для всех",
        "done": "Вы успешно подняли репутацию сервера.",
        "time": time => `Попробуйте снова через **${time.getUTCHours()} часа(-ов) ${time.getMinutes()} минут.**`
    },



    "bag": {
        "desc": "Посмотреть свои предметы.",
        "usage": "",
        "access": "Для всех",
    },



    "use": {
        "desc": "Использовать предмет.",
        "usage": "[номер предмета] [кол-во предметов]",
        "access": "Для всех",
        "err": "Вы не имеете этот предмет.",
        "boxDone": "Вам выпало:",
        "hero": name => `Вы получили героя — __${name}__`,
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
        "noavail": "Подарок от разработчика",
        "nocost": "Не известна",
        "pack": "Временный пак",
        "yes": "Да",
        "t1": "Предыдущая",
        "t2": "Следующая",
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
        "donate": () => {
            return new MessageEmbed()
            .setColor(main)
            .addFields(
                {name: `Поддерживать разработчика, и купить премиум доступ.`,
                value: '**[Ссылка на донат](https://www.donationalerts.com/r/danndevbot)**',
                inline: false},
                {name: `Всё, что нужно указать!`,
                value: '• Ваш ID\n• Что именно вы хотите, например **Vip 1** или **Vip 2**.',
                inline: false},
            )
            .setTimestamp()
            .setFooter("Отправьте ваши вопросы командой ?сообщение")
        }
    },



    "shop": {
        "desc": "Магазин плюшек.",
        "usage": "[pack | packs]",
        "access": "Для всех",
        "shop": () => {
            return new MessageEmbed()
            .setColor(main)
            .setAuthor("Вся информация о переводах: ?donate")
            .addFields(
                {name: `<a:vip1:867868958877810748> VIP 1`,
                value: `Даёт доступ к командам - AFK, embed, channel, ranking(включение системы уровней) и profile-bio, и так же увеличивает стоимость рыб(на 33%), увеличивает макс. сумма подарка до 1000, а также ставка битвы.`,
                inline: false},
                {name: `<a:vip2:867868958459166751> VIP 2`,
                value: `Даёт доступ к уникальным героям, уменьшает **cooldown** для всех команд **два** раза, даёт возможность оформить ранг-карточку, картинку профиля, а так же уменьшает ограничение ставок для всех игр, увеличивает макс. сумма подарка до 2500.`,
                inline: false},
                {name: `Цены в рублях.`,
                value: `• Vip 1 + 1000 ${STAR} - 15₽\n• Vip 2 + 2000 ${STAR} - 40₽\n• Герой **Zeus (Зевс)** - 80₽\n• 10000 ${STAR} - 80₽ (скидка на 47%)\n• 3000 ${STAR} - 30₽ (скидка на 33%)\n• 1000 ${STAR} - 15₽`,
                inline: false},
                {name: `Дополнительное место для героев.`,
                value: `• Стоит: Кол-во твоих мест * 2000 ${STAR}\n\`?buy place\``,
                inline: false}
            )
            .setTimestamp()
            .setFooter("Отправьте ваши вопросы командой ?сообщение")
        },
        "items": () => {
            return new MessageEmbed()
            .setColor(main)
            .setAuthor("Магазин баффов")
            .addField(`**#1** ${item.box.emoji} Ящик предметов: ${item.box.cost} ${STAR}`, `Даёт рандомный предмет, и до 150 голды`)
            .addField(`**#2** ${item.hlt.emoji} Зелье жизни: ${item.hlt.cost} ${STAR}`, `Добавляет герою ${item.hlt.effect} единиц жизни`)
            .addField(`**#3** ${item.dmg.emoji} Зелье атаки: ${item.dmg.cost} ${STAR}`, `Добавляет герою ${item.dmg.effect} единиц атаку`)
            .addField(`**#4** ${item.lvl.emoji} Зелье уровня: Можно получить открывая ящики.`, `Увеличивает уровень героя ${item.lvl.effect} раз`)
            .addField(`**#5** ${item.meat.emoji} Мясо жизни: Можно получить побеждая боссов или открывая ящики.`, `Добавляет герою ${item.meat.effect} единиц жизни`)
            .addField(`Паки`, "** **")
            .addField(`**#6** ${item.pack1.emoji} Обычный пак: ${item.pack1.cost} ${STAR}`, `Откройте и получите одного из этих обычных героев: \`${item.pack1.list.map(i => heroes[i].nameRus).join(", ")}\``) 
            .addField(`**#7** ${item.pack2.emoji} Элитный пак: ${item.pack2.cost} ${STAR}`, `Откройте и получите одного из этих элитных героев: \`${item.pack2.list.map(i => heroes[i].nameRus).join(", ")}\``)
            .addField(`**#8** ${item.pack3.emoji} VIP пак: ${item.pack3.cost} ${STAR}`, `Откройте и получите одного из этих VIP героев: \`${item.pack3.list.map(i => heroes[i].nameRus).join(", ")}\``)
            .addField(`**#9** ${item.tempPack.emoji} Пак Древнеегипетских богов: ${item.tempPack.cost} ${STAR} __доступен до 31.10.2021__`, `Откройте и получите одного из этих временных героев: \`${item.tempPack.list.map(i => heroes[i].nameRus).join(", ")}\``)
            
        }
    },



    "help": {
        "desc": "Команда помощи.",
        "usage": "[название команды]",
        "access": "Для всех",
        "t1": "Привет! я",
        "t2": "Мой глобальный префикс:",
        "t3": "Мой префикс на этом сервере:",
        "t4": "Ещё больше информации:",
        "t5": "Кол-во комманд:",
        "info": "Информация",
        "vip": "VIP",
        "rpg": "Ролевая Игра(RPG)",
        "react": "Реакционные",
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
        "nono": prefix => `**Пишите \`${prefix}help\` чтобы посмотреть все доступные команды бота!**`
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
        "time": time => `Вы недавно вернулись из приключений. Отдыхай **${time.getMinutes()} минут ${time.getSeconds()} секунд.**.`,
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
        "time": time => `Попробуй еще раз через **${time.getMinutes()} минут ${time.getSeconds()} секунд.**.`,
        "find": "Ищем противника...",
        "bet": "Укажите ставку.",
        "min": "Минимальная ставка **1**.",
        "vip1": "Максимальная ставка **50**!\nЛибо купите __VIP 1__",
        "vip2": "Максимальная ставка **100**!\nЛибо купите __VIP 2__",
        "vipError": "Максимальная ставка **250**!",
        "winner": "Победитель:",
        "between": "Поединок между",
    },



    "profile": {
        "desc": "Посмотреть профиль участника.",
        "usage": "[ник участника | упоминание | ID]",
        "access": "Для всех",
        "pr": "Профиль:",
        "none": "Неизвестный",
        "clan": "Клан:",
        "level": "Уровень:",
        "noclan": "Не состоит в клане.",
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
        "time": time => `Попробуй еще раз через **${Math.round(Math.abs(time) / 86400000)} дней**.`,
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
        "done": "Вы успешно убили своего героя.",
    },



    "join": {
        "desc": "Подать заявку на вступление в клан.",
        "usage": "[номер клана]",
        "access": "Для всех",
        "time": time => `Попробуй еще раз через **${time.getMinutes()} минут ${time.getSeconds()} секунд**.`,
        "offed": "Заявки на вступление в этот клан отключены!",
        "limit": "В этом клане достаточно участников!",
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
        "desc": "Подарить голдыы участнику.",
        "usage": "[ник участника | упоминание | ID] [кол-во голды]",
        "access": "Для всех",
        "error1": "Вы не сможете дарить подарки себе.",
        "error2": "Укажите кол-во голды, чтобы подарить.",
        "error3": "Сначала вы должны пожениться.",
        "error4": "Это не ваша половинка.",
        "vip1": "Максимальная сумма **500**!\nЛибо купите **VIP 1**",
        "vip2": "Максимальная сумма **1000**!\nЛибо купите **VIP 2**",
        "vipError": "Максимальная сумма **2500**!",
        "time": time => `Попробуй еще раз через **${time.getUTCHours()} часа(-ов) ${time.getMinutes()} минут.**`,
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
        "usage": "[номер предмета или название героя на английском]",
        "access": "Для всех",
        "time": time => `Вы недавно купили новый герой.\nПопробуй еще раз через **${Math.round(Math.abs(time) / 86400000)} дней ${time.getUTCHours()} часа(-ов)**.`,
        "specHero": "Укажите предмет.",
        "itemErr": "Предмет не найден.",
        "noItem": "Этот предмет не доступен.",
        "nh": "Герой не найден.",
        "vip": "Этот герой доступен только для __VIP 2__ пользователей.",
        "love": "Вы должны быть в любви, чтобы купить этого героя.",
        "place": "У вас недостаточно мест.",
        "already": "Вы уже имеете этого героя.",
        "donePlace": "Вы успешно купили дополнительное место для героев.",
        "errPlace": "Вы уже купили дополнительное место.",
        "error": "У вас недостаточно голды, либо герой недоступен.",
        "done": name => `Вы успешно купили — __${name}__.`,
        "not": "Этот герой недоступен.",
        "err": "Вы уже имеете достаточно героев, сначала убейте одного, чтобы купить новый."
    },


    "fish": {
        "desc": "Поймать рыбу.",
        "usage": "(list)",
        "access": "Для всех",
        "time": time => `Вы недавно рыбачили.\nПопробуй еще раз через **${time.getMinutes()} минут ${time.getSeconds()} секунд.**`,
        "done": symbol => `**🎣 Вы забросили свою удочку и поймали ${symbol}**!`,
        "title": "Список рыб, их редкости.",
        "list": () => {return `
        \`\`\`🔧Хлам      :: [ID: 1]
🐟Обычная    :: [ID: 2]
🐠Необычная  :: [ID: 3]
🦑Редкая      :: [ID: 4]
🐋Легендарная :: [ID: 5]\`\`\`
        
        ​Чем больше рыб, тем большая цена!
        `}
    },



    "daily": {
        "desc": "10 голды и 1 ящик ежедневно.",
        "usage": "",
        "access": "Для всех",
        "time": time => `Ты уже собрал свой ежедневный приз.\n\nПопробуй еще раз через **${time.getUTCHours()} часа(ов) ${time.getMinutes()} минут.**`,
        "done": "Ваш ежедневный приз: 10"
    },



    "duel": {
        "desc": "Пойти в бой с участником.",
        "usage": "[ник | упоминание | ID]",
        "access": "Для всех",
        "time": time => `Попробуй еще раз через **${time.getMinutes()} минут ${time.getSeconds()} секунд.**.`,
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
        "among": "Поединок между:",
    },



    "clans": {
        "desc": "Все кланы на этом сервере",
        "usage": "",
        "access": "Для всех",
        "lvl": "Ур.",
        "members": "Участники:",
        "budget": "Бюджет:",
        "clans": "Кланы сервера",
        "noClans": "Ни один клан на этом сервере не найден."
    },

    

    "clan": {
        "desc": "Информация клана.",
        "usage": "[help]",
        "access": "Для всех",
        "trans": "Перевожу...",
        "unk": "Неизвестный",
        "min": star => `Минимальная сумма — __10__ ${star}`,
        "done": (val, emoji) => `Вы успешно передали своему клану __${val}__ ${emoji}`,
        "actions": "Все доступные функции!",
        "helpCommand": (star, clan) => {
            const text = `
            \`clan (число)\` — Скинуть голдыы в бюджет клана. ( __2 ${star}__ = __1 ${clan}__ )
            \`clan create [название]\` — Создать свой клан (цена 5000 ${star})
            \`clan kick [номер участника]\` — Выгнать участника из клана.
            \`clan up [номер участника]\` — Повысить участника.
            \`clan down [номер участника]\` — Понизить участника.
            \`clan apps\` — Посмотреть заявки клана.
            \`clan apps clear\` — Удалить все заявки.
            \`clan apps enable\` — Включить заявки для вступлении в клан.
            \`clan apps disable\` — Отключить заявки для вступлении в клан.
            \`clan reject [номер заявки]\` — Отклонить заявку участника.
            \`clan accept [номер заявки]\` — Принять участника в клан.
            \`clan upgrade (info)\` — Улучшить клан.
            \`clan description [текст]\` — Описание для клана.
            \`clan logo [ссылка на лого]\` — Логотип для клана.
            \`clan reward\` — Получить ежедневные голдыы.
            \`clan leave\` — Выйти из клана.
            \`clan delete\` — Удалить клан.
            \`clan message\` — Отправлять сообщение каждому участнику.
            \`clan give (сумма)\` — Использовать бюджет и отдать каждому участнику немного голды.
            `
            return text;
        },
        // create
        "doing": "Выполняю запрос...",
        "name": "Укажите название клана.",
        "doneC": "Вы успешно создали свой клан!",
        // kick
        "noMember": "Участник клана не найден!",
        "uLeader": "Вы — лидер клана.",
        "uStaff": "Невозможно выгнать сотрудника.",
        "kicked": name => `Вы успешно выгнали участника __${name}__ .`,
        // apps
        "appsE": "Заявки успешно включены.",
        "appsEE": "Заявки и так включены!",
        "appsD": "Заявки успешно отключены.",
        "appsDD": "Заявки и так отключены!",
        "appsClear": "Все заявки отклонены.",
        "appsError": "Вы не лидер клана, либо что-то указали неверно.",
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
        "enoughMembers": "В вашем клане достаточно участников, улучшайте уровень клана.",
        "already": "Этот участник уже состоит в другом клане.",
        "acceptDone": "Заявка успешно принята.",
        // upgrade
        "upLimit": "Ваш клан максимально улучшен!",
        "upInfoTitle": "Информация об улучшении клана.",
        "upInfo": (cost, emoji, space, level) => `Цена — __${cost}__ ${emoji}\nЧисло максимальных участников: __${space}__ + __5__\n${(level) === 5 ? 'Будут доступны описание и логотип клана!' : ''}`,
        "upVip": "Вы должны иметь как минимум __VIP 1__ чтобы улучшить клан.",
        "upDo": "Улучшаю...",
        "errorRub": "Недостаточно рубинов!",
        "upped": level => `Уровень клана успешно улучшен до __${level}__.`,
        // description
        "descError": "Укажите описание.",
        "clanLevel5": "Эта функция доступна для кланов с уровнем 5 или выше.",
        "descDone": "Описание клана успешно установлено.",
        // logo
        "logoDone": "Логотип клана успешно установлен.",
        // delete
        "quest": "Вы уверены, что хотите удалить клан?",
        "canceled": "Дейстие успешно отклонено",
        "deleteDone": "Вы успешно удалили свой клан.",
        // reward
        "rewardTime": time => `Попробуй еще раз через **${time.getUTCHours()} часа(-ов) ${time.getMinutes()} минут**.`,
        "getReward": (val, emoji) => `Все участники клана получили по — __${val}__ ${emoji}`,
        // leave
        "leaveQuest": "Вы уверены, что хотите выйти из клана?",
        "ldCant": "Лидер не может покинуть клан.",
        "leaveDone": "Вы успешно вышли из клана.",
        // up
        "uError": "Этого участника вы уже повысили.",
        "uLimit": "Вы уже имеете достаточно сотрудников.",
        "uDone": "Вы успешно повысили участника.",
        // down
        "dError": "Невозможно понизить этого участника.",
        "dDone": "Вы успешно понизили участника.",
        // message
        "mTitle": "У вас сообщение от лидера клана",
        "mDone": "Сообщение было успешно отправлено всем.",
        // action error
        "actionError": "Укажите действие.\n\`?clan help\`"
    },

    

    "boss": {
        "desc": "Бой с боссом.",
        "usage": "[ник | упоминание | ID] 2 участников",
        "access": "Для всех",
        "wait": "Подождите минуту.",
        "time": time => `Попробуй снова через __${time.getUTCHours()} часа(-ов) ${time.getMinutes()} минут__.`,
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
        "button2": "Согласиться",
    },

    

    
    "avatar": {
        "desc": "Показывает аватарку участника.",
        "AVATAR": "Аватар",
        "usage": "[ник участника | упоминание | ID] (По желанию)",
        "access": "Для всех"
    },


    "botinfo": {
        "desc": "Показывает аватарку участника.",
        "usage": "",
        "access": "Для всех",
        "title": "Информация о боте!",
        "field1" : "Название:", 
        "create": "Создано в ",
        "dev": "Разработчик: ",
        "prefix": "Глобальный префикс: ",
        "link": "ПРИГЛАШЕНИЕ",
        "inv" : "Чтобы приглашать меня нажми на:",
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
        "time": time => `Попробуй снова через **${time.getMinutes()} минут ${time.getSeconds()} секунд**.`,
        "error": "Оставьте сообщение.",
        "done": "Спасибо за отзыв, мы рассмотрим ваше сообщение.\nУбедитесь, что ваши личные сообщения открыты.",

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
        "f3": 'Вы зашли в:',
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
        "f4": "Самая высокая роль:"
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
        "access": "Для VIP 1",
        "error": "Сообщение не может быть ссылкой.",
        "done1": "Вы вошли в режим AFK",
        "done2": "Вы вышли из режима AFK",
        "args": "Укажите причину чтобы войти в режим AFK."
    },



    "embed": {
        "desc": "Отправлять сообщение на указанном канале в формате EMBED.",
        "usage": "[упоминание канала] [цвет hex] [текст]",
        "access": "Для VIP 1 и Администратора",
        "error1": "Укажите #текстовый канал.",
        "error2": "Укажите цвет эмбед.",
        "error3": "Укажите доступный #текстовый канал."
    },



    "channel": {
        "desc": "Отправлять сообщение на указанном канале.",
        "usage": "[упоминание канала] [текст]",
        "access": "Для VIP 1 и Администратора",
        "error1": "Укажите #текстовый канал.",
        "error2": "Укажите доступный #текстовый канал."
    },
    
    
    
    "bio": {
        "desc": "Описание для вашего профиля.",
        "usage": "[текст]",
        "access": "Для VIP 1",
        "done": "Успешно установленo новoe био профиля."
    },
    
    
    
    "profile-image": {
        "desc": "Картина для вашего профиля.",
        "usage": "[ссылка]",
        "access": "Для VIP 2",
        "done": "Успешно установлена новая картина профиля."
    },
    
    
    
    "rank-color": {
        "desc": "Установить цвет для текста на ранг-карту",
        "usage": "[цвет hex]",
        "access": "Для VIP 2",
        "error": "Укажите цвет.\nПример: \`#ff00ff или ff00ff\`",
        "done": "Успешно установлена новая картинка для ранг-карточки."
    },
    
    
    
    "rank-image": {
        "desc": "Картина для вашей ранг-карточки.",
        "usage": "[ссылка]",
        "access": "Для VIP 2",
        "done": "Успешно установлена новая картина ранг-карточки."
    },
    
    
    
    "burn": {
        "desc": "Сжечь участников.",
        "usage": "(упоминание | ID | ник)",
        "access": "Для всех",
    },
    
    
    
    "rip": {
        "desc": "Эхх...",
        "usage": "(упоминание | ID | ник)",
        "access": "Для всех",
    },
    
    
    
    "trigger": {
        "desc": "Триггер аватарка участника.",
        "usage": "(упоминание | ID | ник)",
        "access": "Для всех",
    },
    
    
    
    "custom": {
        "desc": "Создать новую пользовательскую команду.",
        "usage": "[название] [ответ]",
        "access": "Для Администратора",
        "name": "Укажите название.",
        "resp": "Укажите ответ команды.",
        "done": "Успешно создана новая команда",
        "updated": "Успешно обновлена команда",
    },
    
    
    
    "delete": {
        "desc": "Удалить пользовательскую команду.",
        "usage": "[название]",
        "access": "Для Администратора",
        "name": "Укажите название.",
        "err": cmd => `Команда __${cmd}__ не найдена.`,
        "done": "Команда успешно удалена.",
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
        "done4": "Действие не найдено.",
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

}