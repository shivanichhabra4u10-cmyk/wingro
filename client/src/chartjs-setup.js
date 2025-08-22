// chartjs-setup.js
import {
  Chart,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
} from 'chart.js';

Chart.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);
