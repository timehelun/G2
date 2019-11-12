import { Chart } from '../../../src/';
import { COMPONENT_TYPE } from '../../../src/constant';
import { CITY_SALE } from '../../util/data';
import { createDiv } from '../../util/dom';

describe('Chart', () => {
  const div = createDiv();

  const chart = new Chart({
    container: div,
    width: 800,
    height: 600,
    padding: 10,
    autoFit: false,
  });

  chart.animate(false);
  chart.data(CITY_SALE);

  chart
    // @ts-ignore
    .line()
    .position('city*sale')
    .color('category')
    .size(2);

  chart
    // @ts-ignore
    .point()
    .position('city*sale')
    .color('category')
    .shape('circle')
    .size(4)
    .style({
      stroke: '#fff',
      lineWidth: 1,
      fillOpacity: 1,
    });

  chart
    // @ts-ignore
    .area()
    .position('city*sale')
    .color('category');

  chart.coordinate('polar');

  chart.legend('category', {
    position: 'bottom',
  });

  chart.render();

  it('circle axis component', () => {
    const axes = chart.getOptions().components.filter((co) => co.type === COMPONENT_TYPE.AXIS);
    // // test the component theme config
    const [x] = axes;
    // @ts-ignore
    expect(x.component.get('title')).toBe(null);
    // @ts-ignore
    expect(x.component.get('label').offset).toBe(8);
  });
});