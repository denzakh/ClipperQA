const path = require('path');

module.exports = function (babel) {
  const { types: t } = babel;

  return {
    visitor: {
      JSXOpeningElement(elementPath, state) {
        // 1. Проверяем, что мы в режиме разработки
        if (process.env.NODE_ENV !== 'development') return;

        // 2. Получаем имя компонента (ищем ближайшую функцию)
        const componentName = getComponentName(elementPath);
        if (!componentName) return;

        // 3. Проверяем, не добавили ли мы атрибуты уже (чтобы не дублировать в дочерних элементах)
        const hasQaAttr = elementPath.node.attributes.some(
          attr => t.isJSXAttribute(attr) && attr.name.name === 'data-qa-component'
        );
        if (hasQaAttr) return;

        // 4. Получаем относительный путь к файлу
        const filePath = state.file.opts.filename || '';
        const relativePath = path.relative(process.cwd(), filePath).replace(/\\/g, '/');

        // 5. Вставляем атрибуты
        elementPath.node.attributes.push(
          t.jsxAttribute(t.jsxIdentifier('data-qa-component'), t.stringLiteral(componentName)),
          t.jsxAttribute(t.jsxIdentifier('data-qa-file'), t.stringLiteral(relativePath))
        );
      },
    },
  };
};

function getComponentName(jsxPath) {
  const parent = jsxPath.findParent((p) =>
    p.isFunctionDeclaration() || p.isVariableDeclarator() || p.isClassDeclaration()
  );
  if (!parent) return null;

  if (parent.isVariableDeclarator()) return parent.node.id.name;
  if (parent.isFunctionDeclaration() || parent.isClassDeclaration()) return parent.node.id ? parent.node.id.name : 'Anonymous';
  return null;
}
