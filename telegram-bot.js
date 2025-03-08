const BOT_TOKEN = '7940253060:AAE6HFJGi0tbipn1nxsmnZ8lOk5ykTkK6PI';
const CHANNEL_ID = '@tesssstb';

async function sendApplicationToChannel(applicationData) {
    const message = formatApplicationMessage(applicationData);
    const keyboard = {
        inline_keyboard: [
            [
                { text: '✅ Одобрить', callback_data: 'approve_' + applicationData.id },
                { text: '❌ Отклонить', callback_data: 'reject_' + applicationData.id }
            ]
        ]
    };

    try {
        const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: CHANNEL_ID,
                text: message,
                parse_mode: 'HTML',
                reply_markup: keyboard
            })
        });

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Ошибка при отправке заявки в канал:', error);
        throw error;
    }
}

function formatApplicationMessage(data) {
    return `🆕 <b>Новая заявка на модерацию</b>

📦 <b>Товар:</b> ${data.productName}
💰 <b>Цена:</b> ${data.price} ₽
💎 <b>Выплата:</b> ${data.reward} ₽

🎯 <b>Требования:</b>
${formatRequirements(data.requirements)}

📝 <b>ТЗ:</b>
${data.description}

🏪 <b>Магазин:</b> ${data.storeName}
`;
}

function formatRequirements(requirements) {
    let result = '';
    if (requirements.instagram) {
        result += `• Instagram: от ${requirements.instagram.followers} подписчиков\n`;
        result += `  Stories: от ${requirements.instagram.stories} просмотров\n`;
        result += `  Reels: от ${requirements.instagram.reels} просмотров\n`;
    }
    if (requirements.vk) {
        result += `• VK: от ${requirements.vk.followers} подписчиков\n`;
    }
    return result;
}

// Функция для обработки публикации заявки
async function publishApplication(applicationData) {
    try {
        // Отправляем заявку в канал
        const result = await sendApplicationToChannel(applicationData);
        
        if (result.ok) {
            return { success: true, message: 'Заявка успешно отправлена на модерацию' };
        } else {
            throw new Error('Ошибка при отправке заявки');
        }
    } catch (error) {
        console.error('Ошибка:', error);
        return { success: false, message: 'Произошла ошибка при публикации заявки' };
    }
} 