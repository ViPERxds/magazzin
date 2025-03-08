import asyncio
import os
import json
import logging
from aiogram import Bot, Dispatcher, types
from aiogram.types import WebAppInfo, InlineKeyboardMarkup, InlineKeyboardButton
from aiogram.filters import Command
from dotenv import load_dotenv
from database import init_db, save_order, update_order_status, get_user_orders

# Настройка логирования
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Загрузка переменных окружения
load_dotenv()

# Получение токена бота и URL веб-приложения из переменных окружения
BOT_TOKEN = os.getenv("BOT_TOKEN")
WEBAPP_URL = os.getenv("WEBAPP_URL")
ADMIN_ID = os.getenv("ADMIN_ID")  # ID администратора
CHANNEL_ID = os.getenv("CHANNEL_ID")  # ID канала для публикации

logger.info(f"BOT_TOKEN: {BOT_TOKEN[:5]}...")
logger.info(f"WEBAPP_URL: {WEBAPP_URL}")
logger.info(f"ADMIN_ID: {ADMIN_ID}")
logger.info(f"CHANNEL_ID: {CHANNEL_ID}")

# Проверка наличия необходимых переменных окружения
if not BOT_TOKEN:
    raise ValueError("BOT_TOKEN не установлен в .env файле")
if not WEBAPP_URL:
    raise ValueError("WEBAPP_URL не установлен в .env файле")
if not ADMIN_ID:
    raise ValueError("ADMIN_ID не установлен в .env файле")
if not CHANNEL_ID:
    raise ValueError("CHANNEL_ID не установлен в .env файле")

# Инициализация бота и диспетчера
bot = Bot(token=BOT_TOKEN)
dp = Dispatcher()

# Обработчик команды /start
@dp.message(Command("start"))
async def start_cmd(message: types.Message):
    logger.info(f"Пользователь {message.from_user.id} запустил бота")
    keyboard = types.ReplyKeyboardMarkup(
        keyboard=[
            [types.KeyboardButton(text="Открыть приложение", web_app=WebAppInfo(url=WEBAPP_URL))],
            [types.KeyboardButton(text="Мои заказы")]
        ],
        resize_keyboard=True
    )

    await message.answer(
        "Привет! Нажми на кнопку ниже, чтобы открыть приложение или посмотреть свои заказы.",
        reply_markup=keyboard
    )

# Обработчик для просмотра заказов
@dp.message(lambda message: message.text == "Мои заказы")
async def show_orders(message: types.Message):
    user_id = str(message.from_user.id)
    orders = get_user_orders(user_id)
    
    if not orders:
        await message.answer("У вас пока нет заказов.")
        return
    
    for order in orders:
        status_emoji = {
            'pending': '⏳',
            'active': '✅',
            'rejected': '❌'
        }.get(order['status'], '❓')
        
        data = order['data']
        product = data.get('p', {})
        
        order_message = (
            f"{status_emoji} Заказ от {order['created_at']}\n\n"
            f"🏷 Товар: {product.get('n')}\n"
            f"💰 Цена: {product.get('p')} ₽\n"
            f"📱 Статус: {order['status']}\n"
        )
        
        await message.answer(order_message)

# Функция для создания сообщения о заявке
def create_request_message(request_data):
    try:
        logger.info(f"Получены данные для обработки: {request_data}")
        data = json.loads(request_data)
        message = "📝 Новая заявка на модерацию:\n\n"
        
        # Данные о товаре
        product = data.get('p', {})
        message += f"🏷 Название товара: {product.get('n') or 'Не указано'}\n"
        message += f"💰 Цена: {product.get('p') or 'Не указана'} ₽\n"
        
        # Данные о требованиях
        requirements = data.get('r', {})
        message += f"💵 Выплата: {requirements.get('rp') or 'Не указана'} ₽\n"
        message += f"🔗 Ссылка: {product.get('l') or 'Не указана'}\n"
        
        # Данные о магазине
        store = data.get('s', {})
        message += f"🏪 Магазин: {store.get('n') or 'Не указан'}\n"
        
        # ТЗ
        message += f"\n📋 ТЗ:\n{data.get('t') or 'Не указано'}\n"
        
        # Требования к соцсетям
        if requirements.get('sr'):
            message += "\n📱 Требования к соцсетям:\n"
            social_reqs = requirements['sr']
            
            for platform, reqs in social_reqs.items():
                if any(reqs.values()):
                    message += f"\n{platform.capitalize()}:\n"
                    for key, value in reqs.items():
                        if value:
                            message += f"- {key}: {value}\n"
        
        logger.info("Сообщение о заявке успешно создано")
        return message
    except Exception as e:
        logger.error(f"Ошибка при обработке данных заявки: {str(e)}")
        return f"Ошибка при обработке данных заявки: {str(e)}"

# Обработчик данных из веб-приложения
@dp.message()
async def web_app_handler(message: types.Message):
    if message.web_app_data:
        try:
            logger.info(f"Получены данные от веб-приложения от пользователя {message.from_user.id}")
            data = json.loads(message.web_app_data.data)
            
            # Создаем ID заказа
            request_id = f"request_{message.from_user.id}_{message.message_id}"
            
            # Сохраняем заказ в базу данных
            if not save_order(request_id, str(message.from_user.id), data):
                raise Exception("Не удалось сохранить заказ в базу данных")
            
            # Создаем сообщение о заявке
            request_message = create_request_message(message.web_app_data.data)
            
            # Создаем клавиатуру с кнопками для модерации
            keyboard = InlineKeyboardMarkup(inline_keyboard=[
                [
                    InlineKeyboardButton(text="✅ Опубликовать", callback_data=f"approve_{request_id}"),
                    InlineKeyboardButton(text="❌ Отклонить", callback_data=f"reject_{request_id}")
                ]
            ])
            
            # Отправляем сообщение администратору
            logger.info(f"Отправляем сообщение администратору {ADMIN_ID}")
            await bot.send_message(
                ADMIN_ID,
                request_message,
                reply_markup=keyboard
            )
            
            # Отправляем сообщение в канал
            logger.info(f"Отправляем сообщение в канал {CHANNEL_ID}")
            try:
                await bot.send_message(
                    chat_id=CHANNEL_ID,
                    text=request_message,
                    reply_markup=keyboard
                )
            except Exception as e:
                logger.error(f"Ошибка при отправке в канал: {str(e)}")
            
            # Отправляем подтверждение пользователю
            logger.info(f"Отправляем подтверждение пользователю {message.from_user.id}")
            await message.answer(
                "✅ Ваша заявка отправлена на модерацию.\n"
                "Мы уведомим вас о результатах рассмотрения."
            )
            
        except Exception as e:
            logger.error(f"Ошибка при обработке данных: {e}")
            await message.answer("❌ Произошла ошибка при обработке заявки")

# Обработчик для кнопок модерации
@dp.callback_query(lambda c: c.data.startswith(('approve_', 'reject_')))
async def process_moderation(callback_query: types.CallbackQuery):
    try:
        action, request_id = callback_query.data.split('_', 1)
        user_id = callback_query.from_user.id
        logger.info(f"Получен callback query от пользователя {user_id}: {action} для {request_id}")
        
        # Проверяем, является ли пользователь администратором
        is_admin = str(user_id) == ADMIN_ID
        if not is_admin:
            try:
                # Проверяем, является ли пользователь администратором канала
                member = await bot.get_chat_member(CHANNEL_ID, user_id)
                is_admin = member.status in ['administrator', 'creator']
            except Exception as e:
                logger.error(f"Ошибка при проверке прав администратора канала: {str(e)}")
                is_admin = False
        
        if not is_admin:
            logger.warning(f"Попытка модерации от неавторизованного пользователя: {user_id}")
            await callback_query.answer("У вас нет прав для этого действия")
            return
        
        if action == 'approve':
            # Обновляем статус заказа на активный
            if update_order_status(request_id, 'active'):
                logger.info(f"Заявка {request_id} одобрена")
                
                # Получаем текст сообщения без кнопок модерации
                message_text = callback_query.message.text
                if "\n\n✅" in message_text:
                    message_text = message_text.split("\n\n✅")[0]
                
                # Обновляем сообщение в чате с админом
                await callback_query.message.edit_text(
                    f"{message_text}\n\n✅ Заявка одобрена",
                    reply_markup=None
                )
                
                # Пробуем найти и обновить сообщение в канале
                try:
                    # Получаем историю сообщений в канале
                    messages = await bot.get_chat_history(chat_id=CHANNEL_ID, limit=50)
                    channel_message = None
                    
                    # Ищем сообщение с такой же заявкой
                    async for msg in messages:
                        if msg.text == message_text:
                            channel_message = msg
                            break
                    
                    if channel_message:
                        await bot.edit_message_text(
                            chat_id=CHANNEL_ID,
                            message_id=channel_message.message_id,
                            text=f"{message_text}\n\n✅ Заявка одобрена",
                            reply_markup=None
                        )
                except Exception as e:
                    logger.error(f"Ошибка при обновлении сообщения в канале: {str(e)}")
                
                # Отправляем уведомление пользователю
                original_user_id = request_id.split('_')[1]
                await bot.send_message(
                    original_user_id,
                    "✅ Ваша заявка одобрена!"
                )
            else:
                raise Exception("Не удалось обновить статус заказа")
        else:
            # Обновляем статус заказа на отклоненный
            if update_order_status(request_id, 'rejected'):
                logger.info(f"Заявка {request_id} отклонена")
                
                message_text = callback_query.message.text
                
                # Обновляем сообщение в чате с админом
                await callback_query.message.edit_text(
                    f"{message_text}\n\n❌ Заявка отклонена",
                    reply_markup=None
                )
                
                # Пробуем найти и обновить сообщение в канале
                try:
                    messages = await bot.get_chat_history(chat_id=CHANNEL_ID, limit=50)
                    channel_message = None
                    
                    async for msg in messages:
                        if msg.text == message_text:
                            channel_message = msg
                            break
                    
                    if channel_message:
                        await bot.edit_message_text(
                            chat_id=CHANNEL_ID,
                            message_id=channel_message.message_id,
                            text=f"{message_text}\n\n❌ Заявка отклонена",
                            reply_markup=None
                        )
                except Exception as e:
                    logger.error(f"Ошибка при обновлении сообщения в канале: {str(e)}")
                
                # Отправляем уведомление пользователю
                original_user_id = request_id.split('_')[1]
                await bot.send_message(
                    original_user_id,
                    "❌ Ваша заявка была отклонена."
                )
            else:
                raise Exception("Не удалось обновить статус заказа")
        
        await callback_query.answer()
    except Exception as e:
        logger.error(f"Ошибка при обработке модерации: {str(e)}")
        await callback_query.answer("Произошла ошибка при обработке модерации")

# Добавляем новый обработчик для тестирования канала
@dp.message(Command("testchannel"))
async def test_channel(message: types.Message):
    if str(message.from_user.id) != ADMIN_ID:
        await message.answer("У вас нет прав для этого действия")
        return
        
    try:
        logger.info(f"Начинаем тест отправки в канал {CHANNEL_ID}")
        
        # Проверяем канал напрямую через юзернейм
        try:
            # Пробуем отправить тестовое сообщение напрямую
            test_msg = await bot.send_message(
                chat_id=CHANNEL_ID,  # Используем юзернейм напрямую
                text="🔄 Тестовое сообщение\n\nПроверка отправки в канал."
            )
            logger.info(f"Тестовое сообщение успешно отправлено! Message ID: {test_msg.message_id}")
            await message.answer("✅ Тест успешен! Сообщение отправлено в канал.")
            
        except Exception as direct_error:
            logger.error(f"Ошибка при прямой отправке: {str(direct_error)}")
            
            # Пробуем получить информацию о канале
            try:
                chat = await bot.get_chat(CHANNEL_ID)
                logger.info(f"Канал найден: {chat.title} (ID: {chat.id})")
                
                # Проверяем права бота
                bot_info = await bot.me()
                member = await bot.get_chat_member(chat.id, bot_info.id)
                logger.info(f"Бот {bot_info.username} (ID: {bot_info.id})")
                logger.info(f"Права бота в канале: {member.status}")
                
                error_details = (
                    f"❌ Ошибка при отправке, но канал доступен:\n"
                    f"- Название канала: {chat.title}\n"
                    f"- ID канала: {chat.id}\n"
                    f"- Тип чата: {chat.type}\n"
                    f"- Права бота: {member.status}"
                )
                await message.answer(error_details)
                
            except Exception as info_error:
                logger.error(f"Ошибка при получении информации о канале: {str(info_error)}")
                await message.answer(f"❌ Канал недоступен: {str(info_error)}")
        
    except Exception as e:
        error_msg = f"❌ Общая ошибка: {str(e)}"
        logger.error(error_msg)
        logger.exception("Подробная информация об ошибке:")
        await message.answer(error_msg)

async def main():
    logger.info("Инициализация базы данных...")
    init_db()
    
    logger.info("Бот запущен")
    
    # Удаляем вебхук и запускаем long polling
    await bot.delete_webhook(drop_pending_updates=True)
    await dp.start_polling(bot)

if __name__ == "__main__":
    # Исправление ошибки aiodns на Windows
    asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
    asyncio.run(main())
