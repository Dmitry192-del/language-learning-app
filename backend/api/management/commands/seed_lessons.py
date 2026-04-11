from django.core.management.base import BaseCommand
from api.models import Lesson, Word, Exercise

class Command(BaseCommand):
    help = 'Заполняет базу уроками A1'

    def handle(self, *args, **kwargs):
        Lesson.objects.all().delete()

        lessons_data = [
            # Модуль 1
            {
                'title': 'Greetings',
                'description': 'Приветствия и прощания. Глагол to be (I am)',
                'module': 1, 'order': 1,
                'words': [
                    ('Hello', 'Привет', 'Hello! How are you?', 'Привет! Как дела?'),
                    ('Goodbye', 'Пока', 'Goodbye! See you tomorrow.', 'Пока! Увидимся завтра.'),
                    ('Good morning', 'Доброе утро', 'Good morning! Did you sleep well?', 'Доброе утро! Ты хорошо спал?'),
                    ('Good evening', 'Добрый вечер', 'Good evening, everyone!', 'Добрый вечер всем!'),
                    ('My name is', 'Меня зовут', 'My name is John.', 'Меня зовут Джон.'),
                    ('Nice to meet you', 'Приятно познакомиться', 'Nice to meet you, Anna!', 'Приятно познакомиться, Анна!'),
                    ('I am', 'Я есть/являюсь', 'I am a student.', 'Я студент.'),
                    ('How are you?', 'Как дела?', 'How are you today?', 'Как дела сегодня?'),
                ],
                'exercises': [
                    ('multiple_choice', 'Как переводится "Hello"?', 'Привет', ['Привет', 'Пока', 'Спасибо', 'Доброе утро']),
                    ('translate', 'Переведи: "Good morning"', 'Доброе утро', []),
                    ('multiple_choice', 'Как сказать "Меня зовут"?', 'My name is', ['My name is', 'I am from', 'How are you', 'Nice to meet']),
                ]
            },
            {
                'title': 'Numbers & Ages',
                'description': 'Числа 1-100 и возраст. Глагол to be (He/She/It)',
                'module': 1, 'order': 2,
                'words': [
                    ('One', 'Один', 'I have one cat.', 'У меня один кот.'),
                    ('Two', 'Два', 'Two plus two is four.', 'Два плюс два равно четыре.'),
                    ('Five', 'Пять', 'I am five years old.', 'Мне пять лет.'),
                    ('Ten', 'Десять', 'Ten minutes later.', 'Десять минут спустя.'),
                    ('Twenty', 'Двадцать', 'She is twenty years old.', 'Ей двадцать лет.'),
                    ('Hundred', 'Сто', 'One hundred people.', 'Сто человек.'),
                    ('How old are you?', 'Сколько тебе лет?', 'How old are you, Tom?', 'Сколько тебе лет, Том?'),
                    ('I am ... years old', 'Мне ... лет', 'I am twenty years old.', 'Мне двадцать лет.'),
                ],
                'exercises': [
                    ('multiple_choice', 'Как переводится "Twenty"?', 'Двадцать', ['Десять', 'Двадцать', 'Двенадцать', 'Два']),
                    ('translate', 'Переведи: "How old are you?"', 'Сколько тебе лет?', []),
                    ('multiple_choice', 'Как сказать "Мне 20 лет"?', 'I am twenty years old', ['I have twenty years', 'I am twenty years old', 'My age is twenty', 'I twenty years']),
                ]
            },
            {
                'title': 'Colors & Objects',
                'description': 'Цвета и предметы. Артикли a/an, this/that',
                'module': 1, 'order': 3,
                'words': [
                    ('Red', 'Красный', 'The apple is red.', 'Яблоко красное.'),
                    ('Blue', 'Синий', 'The sky is blue.', 'Небо синее.'),
                    ('Green', 'Зелёный', 'The grass is green.', 'Трава зелёная.'),
                    ('Yellow', 'Жёлтый', 'The sun is yellow.', 'Солнце жёлтое.'),
                    ('Black', 'Чёрный', 'My cat is black.', 'Мой кот чёрный.'),
                    ('White', 'Белый', 'Snow is white.', 'Снег белый.'),
                    ('This is', 'Это (рядом)', 'This is my book.', 'Это моя книга.'),
                    ('That is', 'Это (далеко)', 'That is a big house.', 'Это большой дом.'),
                ],
                'exercises': [
                    ('multiple_choice', 'Как переводится "Blue"?', 'Синий', ['Красный', 'Синий', 'Зелёный', 'Белый']),
                    ('translate', 'Переведи: "This is my book"', 'Это моя книга', []),
                    ('multiple_choice', 'Какой артикль перед "apple"?', 'an', ['a', 'an', 'the', 'no article']),
                ]
            },
            {
                'title': 'Countries & Nationalities',
                'description': 'Страны и национальности. Вопросы с Where are you from?',
                'module': 1, 'order': 4,
                'words': [
                    ('England', 'Англия', 'London is in England.', 'Лондон в Англии.'),
                    ('Russia', 'Россия', 'Moscow is in Russia.', 'Москва в России.'),
                    ('USA', 'США', 'New York is in the USA.', 'Нью-Йорк в США.'),
                    ('France', 'Франция', 'Paris is in France.', 'Париж во Франции.'),
                    ('Where are you from?', 'Откуда ты?', 'Where are you from?', 'Откуда ты?'),
                    ('I am from', 'Я из', 'I am from Russia.', 'Я из России.'),
                    ('English', 'Английский/Англичанин', 'She is English.', 'Она англичанка.'),
                    ('Russian', 'Русский/Россиянин', 'He is Russian.', 'Он русский.'),
                ],
                'exercises': [
                    ('multiple_choice', 'Как спросить "Откуда ты?"', 'Where are you from?', ['Where are you from?', 'Where do you live?', 'What is your country?', 'Who are you?']),
                    ('translate', 'Переведи: "I am from Russia"', 'Я из России', []),
                    ('multiple_choice', 'Столица Франции?', 'Paris', ['London', 'Paris', 'Berlin', 'Rome']),
                ]
            },
            # Модуль 2
            {
                'title': 'Family',
                'description': 'Члены семьи и питомцы. Притяжательные местоимения',
                'module': 2, 'order': 5,
                'words': [
                    ('Mother', 'Мама', 'My mother is kind.', 'Моя мама добрая.'),
                    ('Father', 'Папа', 'My father works hard.', 'Мой папа много работает.'),
                    ('Brother', 'Брат', 'I have a brother.', 'У меня есть брат.'),
                    ('Sister', 'Сестра', 'Her sister is funny.', 'Её сестра смешная.'),
                    ('Grandmother', 'Бабушка', 'My grandmother cooks well.', 'Моя бабушка хорошо готовит.'),
                    ('Dog', 'Собака', 'My dog is friendly.', 'Моя собака дружелюбная.'),
                    ('My / Your / His / Her', 'Мой/Твой/Его/Её', 'This is my family.', 'Это моя семья.'),
                    ('I have', 'У меня есть', 'I have two sisters.', 'У меня две сестры.'),
                ],
                'exercises': [
                    ('multiple_choice', 'Как переводится "Brother"?', 'Брат', ['Отец', 'Брат', 'Дядя', 'Дедушка']),
                    ('translate', 'Переведи: "My mother is kind"', 'Моя мама добрая', []),
                    ('multiple_choice', 'Как сказать "У меня есть сестра"?', 'I have a sister', ['I am a sister', 'I have a sister', 'My sister is', 'I got sister']),
                ]
            },
            {
                'title': 'Appearance',
                'description': 'Внешность и части тела. Глагол have got',
                'module': 2, 'order': 6,
                'words': [
                    ('Eyes', 'Глаза', 'She has blue eyes.', 'У неё голубые глаза.'),
                    ('Hair', 'Волосы', 'He has dark hair.', 'У него тёмные волосы.'),
                    ('Tall', 'Высокий', 'My brother is tall.', 'Мой брат высокий.'),
                    ('Short', 'Низкий/Короткий', 'She is short.', 'Она невысокая.'),
                    ('Young', 'Молодой', 'He looks young.', 'Он выглядит молодо.'),
                    ('Beautiful', 'Красивый/Красивая', 'She is beautiful.', 'Она красивая.'),
                    ('Have got', 'Иметь', 'I have got brown eyes.', 'У меня карие глаза.'),
                    ('What do you look like?', 'Как ты выглядишь?', 'What do you look like?', 'Как ты выглядишь?'),
                ],
                'exercises': [
                    ('multiple_choice', 'Как переводится "Tall"?', 'Высокий', ['Толстый', 'Высокий', 'Старый', 'Красивый']),
                    ('translate', 'Переведи: "She has blue eyes"', 'У неё голубые глаза', []),
                    ('multiple_choice', 'Как сказать "У меня карие глаза"?', 'I have got brown eyes', ['I am brown eyes', 'I have got brown eyes', 'My eyes brown', 'I got eyes brown']),
                ]
            },
            {
                'title': 'My Home',
                'description': 'Мебель и комнаты. There is / There are',
                'module': 2, 'order': 7,
                'words': [
                    ('Kitchen', 'Кухня', 'We eat in the kitchen.', 'Мы едим на кухне.'),
                    ('Bedroom', 'Спальня', 'I sleep in my bedroom.', 'Я сплю в своей спальне.'),
                    ('Living room', 'Гостиная', 'The TV is in the living room.', 'Телевизор в гостиной.'),
                    ('Table', 'Стол', 'The book is on the table.', 'Книга на столе.'),
                    ('Chair', 'Стул', 'Please sit on the chair.', 'Пожалуйста, сядь на стул.'),
                    ('There is', 'Есть (ед.ч.)', 'There is a cat on the sofa.', 'На диване есть кот.'),
                    ('There are', 'Есть (мн.ч.)', 'There are two beds.', 'Есть две кровати.'),
                    ('Bathroom', 'Ванная', 'The bathroom is upstairs.', 'Ванная наверху.'),
                ],
                'exercises': [
                    ('multiple_choice', 'Как переводится "Bedroom"?', 'Спальня', ['Кухня', 'Гостиная', 'Спальня', 'Ванная']),
                    ('translate', 'Переведи: "There is a cat on the sofa"', 'На диване есть кот', []),
                    ('multiple_choice', 'Когда используем "There are"?', 'Когда предметов несколько', ['Когда предмет один', 'Когда предметов несколько', 'Всегда', 'Никогда']),
                ]
            },
            {
                'title': 'Daily Routine',
                'description': 'Распорядок дня. Present Simple (I do)',
                'module': 2, 'order': 8,
                'words': [
                    ('Wake up', 'Просыпаться', 'I wake up at 7.', 'Я просыпаюсь в 7.'),
                    ('Have breakfast', 'Завтракать', 'I have breakfast at 8.', 'Я завтракаю в 8.'),
                    ('Go to work', 'Идти на работу', 'I go to work by bus.', 'Я езжу на работу на автобусе.'),
                    ('Have lunch', 'Обедать', 'We have lunch at noon.', 'Мы обедаем в полдень.'),
                    ('Come home', 'Приходить домой', 'I come home at 6.', 'Я прихожу домой в 6.'),
                    ('Go to bed', 'Ложиться спать', 'I go to bed at 11.', 'Я ложусь спать в 11.'),
                    ('Every day', 'Каждый день', 'I exercise every day.', 'Я занимаюсь спортом каждый день.'),
                    ('Usually', 'Обычно', 'I usually drink coffee.', 'Я обычно пью кофе.'),
                ],
                'exercises': [
                    ('multiple_choice', 'Как переводится "Wake up"?', 'Просыпаться', ['Засыпать', 'Просыпаться', 'Вставать', 'Отдыхать']),
                    ('translate', 'Переведи: "I go to bed at 11"', 'Я ложусь спать в 11', []),
                    ('multiple_choice', 'Как сказать "Каждый день"?', 'Every day', ['All day', 'Every day', 'Always day', 'Each the day']),
                ]
            },
            # Модуль 3
            {
                'title': 'Food & Drink',
                'description': 'Продукты и меню. Some / Any',
                'module': 3, 'order': 9,
                'words': [
                    ('Coffee', 'Кофе', 'I drink coffee every morning.', 'Я пью кофе каждое утро.'),
                    ('Tea', 'Чай', 'Would you like some tea?', 'Хотите немного чая?'),
                    ('Bread', 'Хлеб', 'I eat bread for breakfast.', 'Я ем хлеб на завтрак.'),
                    ('Water', 'Вода', 'Can I have some water?', 'Можно мне воды?'),
                    ('Chicken', 'Курица', 'I like chicken soup.', 'Мне нравится куриный суп.'),
                    ('Some', 'Немного (утверждение)', 'I have some milk.', 'У меня есть немного молока.'),
                    ('Any', 'Никакого (отрицание/вопрос)', 'Do you have any sugar?', 'У тебя есть сахар?'),
                    ('I would like', 'Я бы хотел', 'I would like a coffee, please.', 'Мне кофе, пожалуйста.'),
                ],
                'exercises': [
                    ('multiple_choice', 'Как заказать кофе вежливо?', 'I would like a coffee, please', ['Give me coffee', 'I would like a coffee, please', 'I want coffee now', 'Coffee for me']),
                    ('translate', 'Переведи: "Do you have any sugar?"', 'У тебя есть сахар?', []),
                    ('multiple_choice', 'Когда используем "some"?', 'В утвердительных предложениях', ['В вопросах', 'В утвердительных предложениях', 'В отрицаниях', 'Никогда']),
                ]
            },
            {
                'title': 'Shopping',
                'description': 'Одежда и покупки. I want / I\'d like',
                'module': 3, 'order': 10,
                'words': [
                    ('T-shirt', 'Футболка', 'I like this t-shirt.', 'Мне нравится эта футболка.'),
                    ('Jeans', 'Джинсы', 'These jeans are expensive.', 'Эти джинсы дорогие.'),
                    ('Shoes', 'Ботинки/Обувь', 'I need new shoes.', 'Мне нужны новые ботинки.'),
                    ('How much?', 'Сколько стоит?', 'How much is this?', 'Сколько это стоит?'),
                    ('Expensive', 'Дорогой', 'This is too expensive.', 'Это слишком дорого.'),
                    ('Cheap', 'Дешёвый', 'This shop is cheap.', 'Этот магазин дешёвый.'),
                    ('Size', 'Размер', 'What size do you need?', 'Какой размер вам нужен?'),
                    ('I\'d like to try', 'Я бы хотел примерить', 'I\'d like to try this on.', 'Я бы хотел это примерить.'),
                ],
                'exercises': [
                    ('multiple_choice', 'Как спросить цену?', 'How much is this?', ['What is price?', 'How much is this?', 'Give me price', 'Cost how much?']),
                    ('translate', 'Переведи: "These jeans are expensive"', 'Эти джинсы дорогие', []),
                    ('multiple_choice', 'Как попросить примерить?', "I'd like to try this on", ['I want try', "I'd like to try this on", 'Can try this?', 'Show me size']),
                ]
            },
            {
                'title': 'City Life',
                'description': 'Места в городе. Предлоги места (in, at, on)',
                'module': 3, 'order': 11,
                'words': [
                    ('Bank', 'Банк', 'The bank is on this street.', 'Банк на этой улице.'),
                    ('Hospital', 'Больница', 'The hospital is near here.', 'Больница рядом.'),
                    ('Supermarket', 'Супермаркет', 'I shop at the supermarket.', 'Я делаю покупки в супермаркете.'),
                    ('Bus stop', 'Автобусная остановка', 'Wait at the bus stop.', 'Жди на автобусной остановке.'),
                    ('Turn left', 'Повернуть налево', 'Turn left at the corner.', 'Повернуть налево на углу.'),
                    ('Turn right', 'Повернуть направо', 'Turn right after the school.', 'Повернуть направо после школы.'),
                    ('Straight ahead', 'Прямо', 'Go straight ahead.', 'Идти прямо.'),
                    ('Next to', 'Рядом с', 'The café is next to the bank.', 'Кафе рядом с банком.'),
                ],
                'exercises': [
                    ('multiple_choice', 'Как сказать "Повернуть налево"?', 'Turn left', ['Go left', 'Turn left', 'Move left', 'Left turn please']),
                    ('translate', 'Переведи: "The bank is on this street"', 'Банк на этой улице', []),
                    ('multiple_choice', 'Как сказать "Идти прямо"?', 'Go straight ahead', ['Go forward', 'Go straight ahead', 'Move direct', 'Walk front']),
                ]
            },
            {
                'title': 'Work & Study',
                'description': 'Профессии и работа. Present Simple (отрицания)',
                'module': 3, 'order': 12,
                'words': [
                    ('Doctor', 'Доктор', 'She is a doctor.', 'Она доктор.'),
                    ('Teacher', 'Учитель', 'He is a good teacher.', 'Он хороший учитель.'),
                    ('Engineer', 'Инженер', 'I am an engineer.', 'Я инженер.'),
                    ('Student', 'Студент', 'I am a student.', 'Я студент.'),
                    ('Office', 'Офис', 'I work in an office.', 'Я работаю в офисе.'),
                    ('I don\'t work', 'Я не работаю', 'I don\'t work on weekends.', 'Я не работаю в выходные.'),
                    ('I don\'t like', 'Мне не нравится', 'I don\'t like Mondays.', 'Мне не нравятся понедельники.'),
                    ('What do you do?', 'Кем ты работаешь?', 'What do you do?', 'Кем ты работаешь?'),
                ],
                'exercises': [
                    ('multiple_choice', 'Как спросить о профессии?', 'What do you do?', ['What is your job?', 'What do you do?', 'Who are you working?', 'Your profession?']),
                    ('translate', 'Переведи: "I don\'t work on weekends"', 'Я не работаю в выходные', []),
                    ('multiple_choice', 'Как образуется отрицание в Present Simple?', 'do not / don\'t', ['not + глагол', 'do not / don\'t', 'is not', 'no + глагол']),
                ]
            },
            # Модуль 4
            {
                'title': 'Hobbies',
                'description': 'Хобби и досуг. Глаголы с -ing (I like swimming)',
                'module': 4, 'order': 13,
                'words': [
                    ('Reading', 'Чтение', 'I like reading books.', 'Мне нравится читать книги.'),
                    ('Swimming', 'Плавание', 'She enjoys swimming.', 'Она любит плавать.'),
                    ('Cooking', 'Готовка', 'He loves cooking.', 'Он обожает готовить.'),
                    ('Travelling', 'Путешествия', 'We enjoy travelling.', 'Мы любим путешествовать.'),
                    ('Playing guitar', 'Игра на гитаре', 'I like playing guitar.', 'Мне нравится играть на гитаре.'),
                    ('I enjoy', 'Мне нравится', 'I enjoy hiking.', 'Мне нравится ходить в походы.'),
                    ('In my free time', 'В свободное время', 'In my free time I read.', 'В свободное время я читаю.'),
                    ('I hate', 'Я ненавижу', 'I hate waking up early.', 'Я ненавижу рано вставать.'),
                ],
                'exercises': [
                    ('multiple_choice', 'Как сказать "Мне нравится плавать"?', 'I like swimming', ['I like to swim', 'I like swimming', 'Both are correct', 'I enjoy swim']),
                    ('translate', 'Переведи: "In my free time I read"', 'В свободное время я читаю', []),
                    ('multiple_choice', 'Как переводится "I enjoy travelling"?', 'Мне нравится путешествовать', ['Я путешествую', 'Мне нравится путешествовать', 'Я люблю поезда', 'Я часто путешествую']),
                ]
            },
            {
                'title': 'Abilities',
                'description': 'Навыки и умения. Модальный глагол can',
                'module': 4, 'order': 14,
                'words': [
                    ('Can swim', 'Уметь плавать', 'I can swim very well.', 'Я умею хорошо плавать.'),
                    ('Can drive', 'Уметь водить', 'She can drive a car.', 'Она умеет водить машину.'),
                    ('Can speak', 'Уметь говорить', 'He can speak French.', 'Он умеет говорить по-французски.'),
                    ('Can\'t', 'Не умею', 'I can\'t sing well.', 'Я не умею хорошо петь.'),
                    ('Can you...?', 'Ты умеешь...?', 'Can you play chess?', 'Ты умеешь играть в шахматы?'),
                    ('Very well', 'Очень хорошо', 'She dances very well.', 'Она очень хорошо танцует.'),
                    ('A little', 'Немного', 'I can cook a little.', 'Я немного умею готовить.'),
                    ('I\'m good at', 'Я хорошо умею', 'I\'m good at math.', 'Я хорошо разбираюсь в математике.'),
                ],
                'exercises': [
                    ('multiple_choice', 'Как сказать "Я умею плавать"?', 'I can swim', ['I know to swim', 'I can swim', 'I am able swimming', 'I swim can']),
                    ('translate', 'Переведи: "Can you speak English?"', 'Ты умеешь говорить по-английски?', []),
                    ('multiple_choice', 'Как образуется отрицание от can?', "can't / cannot", ["don't can", "can't / cannot", 'not can', 'can not to']),
                ]
            },
            {
                'title': 'Weather',
                'description': 'Погода и времена года. Безличные предложения (It is cold)',
                'module': 4, 'order': 15,
                'words': [
                    ('Sunny', 'Солнечно', 'It is sunny today.', 'Сегодня солнечно.'),
                    ('Rainy', 'Дождливо', 'It is rainy outside.', 'На улице дождливо.'),
                    ('Cold', 'Холодно', 'It is very cold in winter.', 'Зимой очень холодно.'),
                    ('Hot', 'Жарко', 'It is hot in summer.', 'Летом жарко.'),
                    ('Windy', 'Ветрено', 'It is windy today.', 'Сегодня ветрено.'),
                    ('Spring', 'Весна', 'I love spring.', 'Я люблю весну.'),
                    ('Winter', 'Зима', 'Winter is cold.', 'Зима холодная.'),
                    ('What\'s the weather like?', 'Какая погода?', 'What\'s the weather like today?', 'Какая сегодня погода?'),
                ],
                'exercises': [
                    ('multiple_choice', 'Как спросить о погоде?', "What's the weather like?", ['How is weather?', "What's the weather like?", 'Tell me weather', 'Weather how?']),
                    ('translate', 'Переведи: "It is very cold in winter"', 'Зимой очень холодно', []),
                    ('multiple_choice', 'Как сказать "Сегодня солнечно"?', 'It is sunny today', ['Today sunny', 'It is sunny today', 'Sun is today', 'Is sunny today']),
                ]
            },
            {
                'title': 'Final Test — A1',
                'description': 'Финальный тест. Повторение всего курса A1',
                'module': 4, 'order': 16,
                'words': [
                    ('Hello', 'Привет', 'Hello! Nice to meet you!', 'Привет! Приятно познакомиться!'),
                    ('I am from Russia', 'Я из России', 'I am from Russia.', 'Я из России.'),
                    ('I can speak English', 'Я говорю по-английски', 'I can speak English a little.', 'Я немного говорю по-английски.'),
                    ('I like travelling', 'Мне нравится путешествовать', 'I like travelling very much.', 'Мне очень нравится путешествовать.'),
                    ('What do you do?', 'Кем ты работаешь?', 'What do you do?', 'Кем ты работаешь?'),
                    ('I don\'t understand', 'Я не понимаю', 'Sorry, I don\'t understand.', 'Извините, я не понимаю.'),
                    ('Can you repeat?', 'Можете повторить?', 'Can you repeat that, please?', 'Можете повторить, пожалуйста?'),
                    ('Thank you very much', 'Большое спасибо', 'Thank you very much!', 'Большое спасибо!'),
                ],
                'exercises': [
                    ('multiple_choice', 'Как сказать "Я немного говорю по-английски"?', 'I can speak English a little', ['I speak little English', 'I can speak English a little', 'My English is little', 'I talk English some']),
                    ('translate', 'Переведи: "Sorry, I don\'t understand"', 'Извините, я не понимаю', []),
                    ('multiple_choice', 'Как попросить повторить?', 'Can you repeat that, please?', ['Say again?', 'Can you repeat that, please?', 'What you said?', 'Repeat now']),
                ]
            },
        ]

        for data in lessons_data:
            lesson = Lesson.objects.create(
                title=data['title'],
                description=data['description'],
                language='en',
                level='A1',
                lesson_type='vocabulary',
                module=data['module'],
                order=data['order'],
                xp_reward=15,
            )
            for word_data in data['words']:
                Word.objects.create(
                    lesson=lesson,
                    word=word_data[0],
                    translation=word_data[1],
                    example=word_data[2],
                    example_translation=word_data[3],
                )
            for i, ex_data in enumerate(data['exercises']):
                Exercise.objects.create(
                    lesson=lesson,
                    exercise_type=ex_data[0],
                    question=ex_data[1],
                    correct_answer=ex_data[2],
                    options=ex_data[3],
                    order=i+1,
                )

        self.stdout.write(self.style.SUCCESS('✅ 16 уроков A1 добавлено!'))