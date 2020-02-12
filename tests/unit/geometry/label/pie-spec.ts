import { getCoordinate } from '@antv/coord';
import { isNumberEqual } from '@antv/util';
import 'jest-extended';
import PieLabel from '../../../../src/geometry/label/pie';
import Point from '../../../../src/geometry/point';
import Theme from '../../../../src/theme/antv';
import { createCanvas, createDiv } from '../../../util/dom';
import { createScale } from '../../../util/scale';

const PolarCoord = getCoordinate('polar');

describe('pie labels', () => {
  const div = createDiv();
  const canvas = createCanvas({
    container: div,
    width: 500,
    height: 500,
  });

  describe('pie text inner', () => {
    const coord = new PolarCoord({
      start: {
        x: 0,
        y: 100,
      },
      end: {
        x: 100,
        y: 0,
      },
    });

    coord.transpose();
    const points = [];
    const values = [];
    const data = [];
    for (let i = 0; i < 8; i++) {
      const obj = coord.convert({
        x: 0.5,
        y: i / 8,
      });
      const endPoint = coord.convert({
        x: 0.5,
        y: (i + 1) / 8,
      });
      const point = {
        x: [obj.x, endPoint.x],
        y: [obj.y, endPoint.y],
        label: i.toString(),
        _origin: {
          x: [obj.x, endPoint.x],
          y: [obj.y, endPoint.y],
          label: i.toString(),
        },
      };
      values.push(i.toString());
      points.push(point);
      data.push(point._origin);
    }

    const scales = {
      x: createScale('x', data),
      y: createScale('y', data),
      label: createScale('label', data),
    };

    const pointGeom = new Point({
      data,
      scales,
      container: canvas.addGroup(),
      labelsContainer: canvas.addGroup(),
      theme: Theme,
      coordinate: coord,
    });
    pointGeom.position('x*y').label('label', { offset: -10 });
    pointGeom.init();

    const gLabels = new PieLabel(pointGeom);

    let items;

    it('get items', () => {
      items = gLabels.getLabelItems(points);
      expect(items.length).toBe(points.length);
      expect(items[0].labelLine).toBe(null);
    });

    it('first point rotate', () => {
      const first = items[0];

      expect(first.x).toBe(65.3073372946036);
      expect(first.y).toBe(13.044818699548529);
      expect(first.rotate).toBe((-67.5 / 180) * Math.PI);
      expect(first.textAlign).toBe('right');
    });

    it('second point', () => {
      const second = items[1];
      expect(second.x).toBe(86.95518130045147);
      expect(second.y).toBe(34.69266270539641);
      expect(second.rotate).toBe((-22.5 / 180) * Math.PI);
    });

    it('third point', () => {
      const point = items[2];

      expect(point.x).toBe(86.95518130045147);
      expect(point.y).toBe(65.3073372946036);
      expect(point.rotate).toBe((22.5 / 180) * Math.PI);
    });
  });

  describe('pie text outter with offsetX & offsetY', () => {
    const coord = new PolarCoord({
      start: {
        x: 200,
        y: 200,
      },
      end: {
        x: 300,
        y: 0,
      },
    });

    coord.transpose();
    const points = [];
    const values = [];
    const data = [];
    for (let i = 0; i < 6; i++) {
      const obj = coord.convert({
        x: 0.5,
        y: i / 6,
      });
      const endPoint = coord.convert({
        x: 0.5,
        y: (i + 1) / 6,
      });
      const point = {
        x: [obj.x, endPoint.x],
        y: [obj.y, endPoint.y],
        color: 'red',
        label: i.toString(),
        _origin: {
          x: [obj.x, endPoint.x],
          y: [obj.y, endPoint.y],
          color: 'red',
          label: i.toString(),
        },
      };

      values.push(i.toString());
      points.push(point);
      data.push(point._origin);
    }

    const scales = {
      x: createScale('x', data),
      y: createScale('y', data),
      label: createScale('label', data),
    };

    const pointGeom = new Point({
      data,
      scales,
      container: canvas.addGroup(),
      labelsContainer: canvas.addGroup(),
      theme: Theme,
      coordinate: coord,
    });
    pointGeom.position('x*y').label('label', {
      offset: 10,
      offsetX: 10,
      offsetY: -10,
      labelLine: false,
    });
    pointGeom.init();

    const gLabels = new PieLabel(pointGeom);

    it('points', () => {
      const items = gLabels.getLabelItems(points);
      expect(items.length).toBe(points.length);
      expect(items[0].x).toBe(230);
      expect(items[0].labelLine).toBe(false);
      expect(isNumberEqual(items[0].y, 48.03847577293368 - 10)).toBeTruthy();

      expect(items[1].x).toBe(200);
      expect(items[1].labelLine).toBe(false);
      expect(isNumberEqual(items[1].y, 100 - 10)).toBeTruthy();

      expect(items[2].x).toBe(230.00000000000006);
      expect(items[2].labelLine).toBe(false);
      expect(isNumberEqual(items[2].y, 151.96152422706632 - 10)).toBeTruthy();

      expect(items[5].x).toBe(290);
      expect(isNumberEqual(items[5].y, 151.96152422706632 - 10)).toBeTruthy();
    });
  });
});