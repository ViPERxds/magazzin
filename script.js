document.addEventListener('DOMContentLoaded', function() {
    const steps = document.querySelectorAll('.step-btn');
    const progressFill = document.querySelector('.progress-fill');
    let currentStep = 0;

    // Инициализация первого шага
    updateProgress(0);

    steps.forEach((step, index) => {
        step.addEventListener('click', () => {
            // Убираем активный класс со всех шагов
            steps.forEach(s => s.classList.remove('active'));
            
            // Добавляем активный класс текущему шагу
            step.classList.add('active');
            
            // Обновляем прогресс
            currentStep = index;
            updateProgress(currentStep);

            // Отмечаем предыдущие шаги как завершенные
            steps.forEach((s, i) => {
                if (i < currentStep) {
                    s.classList.add('completed');
                } else {
                    s.classList.remove('completed');
                }
            });
        });
    });

    function updateProgress(step) {
        // Вычисляем процент заполнения (25% за каждый шаг)
        const progressPercentage = (step + 1) * 25;
        progressFill.style.width = `${progressPercentage}%`;
    }
}); 