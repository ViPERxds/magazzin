import sqlite3
import json
import logging
from datetime import datetime

logger = logging.getLogger(__name__)

def init_db():
    """Инициализация базы данных"""
    try:
        conn = sqlite3.connect('orders.db')
        c = conn.cursor()
        
        # Создаем таблицу заказов
        c.execute('''
            CREATE TABLE IF NOT EXISTS orders (
                id TEXT PRIMARY KEY,
                user_id TEXT NOT NULL,
                status TEXT NOT NULL,
                data TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        conn.commit()
        conn.close()
        logger.info("База данных успешно инициализирована")
    except Exception as e:
        logger.error(f"Ошибка при инициализации базы данных: {e}")

def save_order(request_id: str, user_id: str, data: dict):
    """Сохранение заказа в базу данных"""
    try:
        conn = sqlite3.connect('orders.db')
        c = conn.cursor()
        
        c.execute(
            "INSERT INTO orders (id, user_id, status, data) VALUES (?, ?, ?, ?)",
            (request_id, user_id, 'pending', json.dumps(data))
        )
        
        conn.commit()
        conn.close()
        logger.info(f"Заказ {request_id} успешно сохранен")
        return True
    except Exception as e:
        logger.error(f"Ошибка при сохранении заказа: {e}")
        return False

def update_order_status(request_id: str, new_status: str):
    """Обновление статуса заказа"""
    try:
        conn = sqlite3.connect('orders.db')
        c = conn.cursor()
        
        c.execute(
            "UPDATE orders SET status = ?, updated_at = ? WHERE id = ?",
            (new_status, datetime.now(), request_id)
        )
        
        conn.commit()
        conn.close()
        logger.info(f"Статус заказа {request_id} обновлен на {new_status}")
        return True
    except Exception as e:
        logger.error(f"Ошибка при обновлении статуса заказа: {e}")
        return False

def get_user_orders(user_id: str, status: str = None):
    """Получение заказов пользователя"""
    try:
        conn = sqlite3.connect('orders.db')
        c = conn.cursor()
        
        if status:
            c.execute(
                "SELECT * FROM orders WHERE user_id = ? AND status = ? ORDER BY created_at DESC",
                (user_id, status)
            )
        else:
            c.execute(
                "SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC",
                (user_id,)
            )
        
        orders = c.fetchall()
        conn.close()
        
        return [
            {
                'id': order[0],
                'user_id': order[1],
                'status': order[2],
                'data': json.loads(order[3]),
                'created_at': order[4],
                'updated_at': order[5]
            }
            for order in orders
        ]
    except Exception as e:
        logger.error(f"Ошибка при получении заказов пользователя: {e}")
        return [] 