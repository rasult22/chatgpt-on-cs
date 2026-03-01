/* eslint-disable @typescript-eslint/no-unused-vars */
export function sendEvent(
  category: string,
  action: string,
  label: string,
  value: string | number,
) {
  // visitor.event(category, action, label, value).send();
}

// Предустановленное событие: нажатие кнопки
export function trackButtonClick(buttonName: string) {
  sendEvent('UI Interaction', 'Click', `Button: ${buttonName}`, 1);
}

// Предустановленное событие: чекбокс
export function trackCheckboxChange(checkboxName: string, value: string[]) {
  sendEvent(
    'UI Interaction',
    'Change',
    `Checkbox: ${checkboxName}`,
    value.join(','),
  );
}

// Предустановленное событие: открытие страницы
export function trackPageView(pageName: string) {
  sendEvent('Navigation', 'Open', `Page: ${pageName}`, 1);
}
