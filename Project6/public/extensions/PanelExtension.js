/**
 * Panel Extension - 정보 패널 표시
 * APS Tutorial: https://get-started.aps.autodesk.com/tutorials/dashboard/panel
 */

class PanelExtension extends Autodesk.Viewing.Extension {
  constructor(viewer, options) {
    super(viewer, options);
    this._panel = null;
    this._group = null;
    this._button = null;
  }

  load() {
    console.log('PanelExtension has been loaded');
    
    if (this.viewer.toolbar) {
      console.log('PanelExtension: Toolbar exists in load(), creating button');
      setTimeout(() => this.createToolbarButton(), 100);
    } else {
      const checkToolbar = () => {
        if (this.viewer.toolbar) {
          console.log('PanelExtension: Toolbar created, creating button');
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
    console.log('PanelExtension has been unloaded');
    return true;
  }

  onToolbarCreated() {
    console.log('PanelExtension: onToolbarCreated() called');
    this.createToolbarButton();
  }

  createToolbarButton() {
    if (this._button) {
      return;
    }

    if (!this.viewer.toolbar) {
      console.warn('PanelExtension: Toolbar not available yet');
      return;
    }

    this._group = this.viewer.toolbar.getControl('dashboardExtensionsToolbar');
    if (!this._group) {
      this._group = new Autodesk.Viewing.UI.ControlGroup('dashboardExtensionsToolbar');
      this.viewer.toolbar.addControl(this._group);
    }

    this._button = new Autodesk.Viewing.UI.Button('dashboardPanelButton');
    this._button.onClick = (ev) => {
      console.log('PanelExtension button clicked');
      if (this._panel) {
        this.viewer.removePanel(this._panel);
        this._panel = null;
        this._button.setState(Autodesk.Viewing.UI.Button.State.INACTIVE);
      } else {
        this.createPanel();
        this._button.setState(Autodesk.Viewing.UI.Button.State.ACTIVE);
      }
    };
    this._button.setToolTip('Panel Extension');
    this._button.addClass('dashboardPanelIcon');
    this._button.setIcon('adsk-icon-view-cube');
    this._button.setState(Autodesk.Viewing.UI.Button.State.INACTIVE);

    this._group.addControl(this._button);
    console.log('✅ PanelExtension button added to toolbar');
  }

  createPanel() {
    this._panel = new Autodesk.Viewing.UI.PropertyPanel(this.viewer.container, 'dashboardPanel', '모델 정보');
    
    const model = this.viewer.model;
    if (model) {
      const dbIds = model.getObjectTree().getAllDbIds();
      this._panel.addProperty('총 객체 수', dbIds.length, '카테고리');
      this._panel.addProperty('모델 URN', model.getDocumentNode().getViewablePath(), '카테고리');
    } else {
      this._panel.addProperty('상태', '모델이 로드되지 않았습니다', '정보');
    }

    this.viewer.addPanel(this._panel);
  }
}

Autodesk.Viewing.theExtensionManager.registerExtension('PanelExtension', PanelExtension);

