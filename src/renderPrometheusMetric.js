const renderMetric = (definition, measures) => {
  if (typeof measures !== 'object' || measures === null) throw new Error(`No measures given for ${JSON.stringify(definition)}`);
  const valueLines = measures.map(measure => {
    const labels = Object.keys(measure).filter(key => key !== 'value').map(key => `${key}="${measure[key]}"`);
    return `${definition.name}{${labels}} ${measure.value}`;
  });
  return `
# HELP ${definition.name} ${definition.description}
# TYPE ${definition.name} ${definition.type}
${valueLines.join('\n')}
`;
};

module.exports = renderMetric;