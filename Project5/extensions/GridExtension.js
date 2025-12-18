/**
 * Grid Extension - 그리드로 정보 시각화
 * APS Tutorial: https://get-started.aps.autodesk.com/tutorials/dashboard/grid
 */

class GridExtension extends Autodesk.Viewing.Extension {
  constructor(viewer, options) {
    super(viewer, options);
    this._panel = null;
    this._group = null;
    this._button = null;
  }

  load() {
    console.log('GridExtension has been loaded');
    
    if (this.viewer.toolbar) {
      console.log('GridExtension: Toolbar exists in load(), creating button');
      setTimeout(() => this.createToolbarButton(), 100);
    } else {
      const checkToolbar = () => {
        if (this.viewer.toolbar) {
          console.log('GridExtension: Toolbar created, creating button');
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
    console.log('GridExtension has been unloaded');
    return true;
  }

  onToolbarCreated() {
    console.log('GridExtension: onToolbarCreated() called');
    this.createToolbarButton();
  }

  createToolbarButton() {
    if (this._button) {
      return;
    }

    if (!this.viewer.toolbar) {
      console.warn('GridExtension: Toolbar not available yet');
      return;
    }

    this._group = this.viewer.toolbar.getControl('dashboardExtensionsToolbar');
    if (!this._group) {
      this._group = new Autodesk.Viewing.UI.ControlGroup('dashboardExtensionsToolbar');
      this.viewer.toolbar.addControl(this._group);
    }

    this._button = new Autodesk.Viewing.UI.Button('dashboardGridButton');
    this._button.onClick = (ev) => {
      console.log('GridExtension button clicked');
      if (this._panel) {
        this.viewer.removePanel(this._panel);
        this._panel = null;
        this._button.setState(Autodesk.Viewing.UI.Button.State.INACTIVE);
      } else {
        this.createGridPanel();
        this._button.setState(Autodesk.Viewing.UI.Button.State.ACTIVE);
      }
    };
    this._button.setToolTip('Grid Extension');
    this._button.addClass('dashboardGridIcon');
    this._button.setIcon('adsk-icon-table');
    this._button.setState(Autodesk.Viewing.UI.Button.State.INACTIVE);

    this._group.addControl(this._button);
    console.log('✅ GridExtension button added to toolbar');
  }

  createGridPanel() {
    this._panel = new Autodesk.Viewing.UI.DockingPanel(this.viewer.container, 'dashboardGridPanel', '그리드 정보');
    this._panel.container.style.width = '500px';
    this._panel.container.style.height = '400px';

    const content = document.createElement('div');
    content.style.padding = '10px';
    content.style.overflow = 'auto';
    content.style.height = '100%';

    const table = document.createElement('table');
    table.style.width = '100%';
    table.style.borderCollapse = 'collapse';
    table.style.fontSize = '12px';

    const thead = document.createElement('thead');
    thead.innerHTML = `
      <tr style="background-color: #f0f0f0; font-weight: bold;">
        <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">ID</th>
        <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">이름</th>
        <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">타입</th>
        <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">카테고리</th>
      </tr>
    `;
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    const model = this.viewer.model;

    if (model) {
      const dbIds = model.getObjectTree().getAllDbIds();
      const sampleIds = dbIds.slice(0, 20);

      sampleIds.forEach((dbId, index) => {
        const row = document.createElement('tr');
        row.style.backgroundColor = index % 2 === 0 ? '#fff' : '#f9f9f9';
        row.style.cursor = 'pointer';

        row.onclick = () => {
          this.viewer.select([dbId]);
          this.viewer.fitToView([dbId]);
        };

        row.onmouseover = () => {
          row.style.backgroundColor = '#e3f2fd';
        };

        row.onmouseout = () => {
          row.style.backgroundColor = index % 2 === 0 ? '#fff' : '#f9f9f9';
        };

        model.getProperties(dbId, (props) => {
          const name = props.name || `Object ${dbId}`;
          const type = props.externalId || 'N/A';
          const category = props.category || 'N/A';

          row.innerHTML = `
            <td style="padding: 8px; border: 1px solid #ddd;">${dbId}</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${name}</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${type}</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${category}</td>
          `;
        });

        tbody.appendChild(row);
      });
    } else {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td colspan="4" style="padding: 20px; text-align: center; color: #666;">
          모델이 로드되지 않았습니다.
        </td>
      `;
      tbody.appendChild(row);
    }

    table.appendChild(tbody);
    content.appendChild(table);
    this._panel.container.appendChild(content);

    this.viewer.addPanel(this._panel);
  }
}

Autodesk.Viewing.theExtensionManager.registerExtension('GridExtension', GridExtension);
