/**
 * Basic Extension - 기본 확장 기능
 * APS Tutorial: https://get-started.aps.autodesk.com/tutorials/dashboard/basic
 */

class BasicExtension extends Autodesk.Viewing.Extension {
  constructor(viewer, options) {
    super(viewer, options);
    this._group = null;
    this._button = null;
  }

  load() {
    console.log('BasicExtension has been loaded');
    
    // onToolbarCreated가 호출되지 않을 수 있으므로 fallback 추가
    if (this.viewer.toolbar) {
      console.log('BasicExtension: Toolbar exists in load(), creating button');
      setTimeout(() => this.createToolbarButton(), 100);
    } else {
      const checkToolbar = () => {
        if (this.viewer.toolbar) {
          console.log('BasicExtension: Toolbar created, creating button');
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
    if (this._group && this._button) {
      this._group.removeControl(this._button);
      if (this._group.getNumberOfControls() === 0) {
        this.viewer.toolbar.removeControl(this._group);
      }
    }
    console.log('BasicExtension has been unloaded');
    return true;
  }

  onToolbarCreated() {
    console.log('BasicExtension: onToolbarCreated() called');
    this.createToolbarButton();
  }

  createToolbarButton() {
    if (this._button) {
      console.log('BasicExtension: Button already exists, skipping');
      return;
    }

    if (!this.viewer.toolbar) {
      console.warn('BasicExtension: Toolbar not available yet');
      return;
    }

    console.log('BasicExtension: Creating toolbar button...');

    // 툴바 그룹 생성
    this._group = this.viewer.toolbar.getControl('dashboardExtensionsToolbar');
    if (!this._group) {
      this._group = new Autodesk.Viewing.UI.ControlGroup('dashboardExtensionsToolbar');
      this.viewer.toolbar.addControl(this._group);
      console.log('BasicExtension: ControlGroup created and added');
    } else {
      console.log('BasicExtension: ControlGroup already exists');
    }

    // 버튼 생성
    this._button = new Autodesk.Viewing.UI.Button('dashboardBasicButton');
    this._button.onClick = (ev) => {
      console.log('BasicExtension button clicked');
      const model = this.viewer.model;
      if (model) {
        try {
          const dbIds = model.getObjectTree().getAllDbIds();
          alert(`모델 정보:\n총 객체 수: ${dbIds.length}`);
        } catch (error) {
          console.error('BasicExtension: Error getting model info', error);
          alert('모델 정보를 가져오는 중 오류가 발생했습니다.');
        }
      } else {
        alert('모델이 로드되지 않았습니다.');
      }
    };
    this._button.setToolTip('Basic Extension - 모델 정보 표시');
    this._button.addClass('dashboardBasicIcon');
    this._button.setIcon('adsk-icon-info');

    // 그룹에 버튼 추가
    try {
      this._group.addControl(this._button);
      console.log('✅ BasicExtension button added to toolbar');
      
      // 버튼이 보이도록 스타일 강제 설정
      if (this._button.container) {
        this._button.container.style.display = '';
        this._button.container.style.visibility = 'visible';
        this._button.container.style.opacity = '1';
      }
      
      if (this._group.container) {
        this._group.container.style.display = '';
        this._group.container.style.visibility = 'visible';
      }
    } catch (error) {
      console.error('❌ BasicExtension: Error adding button to group', error);
    }
  }
}

Autodesk.Viewing.theExtensionManager.registerExtension('BasicExtension', BasicExtension);

