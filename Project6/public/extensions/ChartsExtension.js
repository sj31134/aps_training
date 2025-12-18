/**
 * Charts Extension - 차트로 시각화
 * APS Tutorial: https://get-started.aps.autodesk.com/tutorials/dashboard/charts
 */

class ChartsExtension extends Autodesk.Viewing.Extension {
  constructor(viewer, options) {
    super(viewer, options);
    this._panel = null;
    this._group = null;
    this._button = null;
  }

  load() {
    console.log('ChartsExtension has been loaded');
    
    if (this.viewer.toolbar) {
      console.log('ChartsExtension: Toolbar exists in load(), creating button');
      setTimeout(() => this.createToolbarButton(), 100);
    } else {
      const checkToolbar = () => {
        if (this.viewer.toolbar) {
          console.log('ChartsExtension: Toolbar created, creating button');
          this.createToolbarButton();
        } else {
          setTimeout(checkToolbar, 200);
        }
      };
      setTimeout(checkToolbar, 500);
    }
    
    return true;
  }

  unload() {
    if (this._button && this._group) {
      this._group.removeControl(this._button);
      if (this._group.getNumberOfControls() === 0) {
        this.viewer.toolbar.removeControl(this._group);
      }
    }
    if (this._panel) {
      this.viewer.removePanel(this._panel);
      this._panel = null;
    }
    console.log('ChartsExtension has been unloaded');
    return true;
  }

  onToolbarCreated() {
    console.log('ChartsExtension: onToolbarCreated() called');
    this.createToolbarButton();
  }

  createToolbarButton() {
    if (this._button) {
      return;
    }

    if (!this.viewer.toolbar) {
      console.warn('ChartsExtension: Toolbar not available yet');
      return;
    }

    this._group = this.viewer.toolbar.getControl('dashboardExtensionsToolbar');
    if (!this._group) {
      this._group = new Autodesk.Viewing.UI.ControlGroup('dashboardExtensionsToolbar');
      this.viewer.toolbar.addControl(this._group);
    }

    this._button = new Autodesk.Viewing.UI.Button('dashboardChartsButton');
    this._button.onClick = (ev) => {
      console.log('ChartsExtension button clicked');
      if (this._panel) {
        this.viewer.removePanel(this._panel);
        this._panel = null;
        this._button.setState(Autodesk.Viewing.UI.Button.State.INACTIVE);
      } else {
        this.createChartPanel();
        this._button.setState(Autodesk.Viewing.UI.Button.State.ACTIVE);
      }
    };
    this._button.setToolTip('Charts Extension');
    this._button.addClass('dashboardChartsIcon');
    this._button.setIcon('adsk-icon-chart');
    this._button.setState(Autodesk.Viewing.UI.Button.State.INACTIVE);

    this._group.addControl(this._button);
    console.log('✅ ChartsExtension button added to toolbar');
  }

  createChartPanel() {
    this._panel = new Autodesk.Viewing.UI.DockingPanel(this.viewer.container, 'dashboardChartsPanel', '차트 시각화');
    this._panel.container.style.width = '400px';
    this._panel.container.style.height = '300px';

    const content = document.createElement('div');
    content.style.padding = '20px';
    content.innerHTML = `
      <canvas id="chartCanvas" width="360" height="260"></canvas>
    `;
    this._panel.container.appendChild(content);

    this.viewer.addPanel(this._panel);

    setTimeout(() => {
      this.drawChart();
    }, 100);
  }

  drawChart() {
    const canvas = document.getElementById('chartCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const model = this.viewer.model;
    
    if (!model) {
      ctx.fillStyle = '#666';
      ctx.font = '16px Arial';
      ctx.fillText('모델이 로드되지 않았습니다', 50, 130);
      return;
    }

    const dbIds = model.getObjectTree().getAllDbIds();
    const sampleData = [dbIds.length, dbIds.length * 0.7, dbIds.length * 0.5, dbIds.length * 0.3];
    const labels = ['전체', '타입 A', '타입 B', '타입 C'];
    const colors = ['#4CAF50', '#2196F3', '#FF9800', '#F44336'];

    const barWidth = 60;
    const barSpacing = 20;
    const maxValue = Math.max(...sampleData);
    const chartHeight = 200;
    const startX = 30;
    const startY = 240;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    sampleData.forEach((value, index) => {
      const x = startX + index * (barWidth + barSpacing);
      const barHeight = (value / maxValue) * chartHeight;
      const y = startY - barHeight;

      ctx.fillStyle = colors[index];
      ctx.fillRect(x, y, barWidth, barHeight);

      ctx.fillStyle = '#333';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(labels[index], x + barWidth / 2, startY + 15);
      ctx.fillText(Math.round(value), x + barWidth / 2, y - 5);
    });
  }
}

Autodesk.Viewing.theExtensionManager.registerExtension('ChartsExtension', ChartsExtension);

