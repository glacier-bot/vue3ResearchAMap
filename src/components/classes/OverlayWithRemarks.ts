declare global {
  namespace AMap {
    export class PolyEditor {
      constructor(map: any, overlay: any)
    }
  }
}

class OverlayWithRemarks {
  // 初始化属性
  #map: any
  #overlay: any
  #overlayType: string
  #remarks: any
  #remarkShow = true
  #hideRemark = false
  #showRemark = false
  // 如果是矩形和多边形
  #path: any
  #convertedLocations: any
  // 如果是圆形
  #center: any
  #radius: any
  // 编辑器属性
  editor: any
  #handleOverlayEditor = false
  // 右键菜单
  #contextMenu: any

  constructor(map: any, overlay: any) {
    this.#map = map
    this.#overlay = overlay
    this.#remarks = new AMap.Text({
      offset: new AMap.Pixel(-20, -20),
      draggable: false
    })
    this.#overlayType = overlay.obj.CLASS_NAME
    this.#contextMenu = new AMap.ContextMenu()
    this.#runMain()
  }

  #ringArea = (locations: any) => {
    const area = AMap.GeometryUtil.ringArea(locations).toFixed(2)
    return parseFloat(area) > 0
      ? parseFloat(area) >= 10000.0
        ? (parseFloat(area) / 10000).toFixed(2) + '公顷'
        : area + '平方米'
      : null
  }

  #circleArea = (radius: number) => {
    const area = (Math.PI * Math.pow(radius, 2)).toFixed(2)
    return parseFloat(area) > 0
      ? parseFloat(area) >= 10000.0
        ? (parseFloat(area) / 10000).toFixed(2) + '公顷'
        : area + '平方米'
      : null
  }

  #setRemarks = () => {
    switch (this.#overlayType) {
      case 'Overlay.Polygon':
      case 'Overlay.Rectangle': {
        this.#path = this.#overlay.obj.getPath()
        this.#convertedLocations = this.#path.map((location: any) => {
          return [location.lng, location.lat]
        })
        const area = this.#ringArea(this.#convertedLocations)
        if (area) {
          this.#remarks.setText('区域面积: ' + area)
        }
        if (area) {
          this.#remarks.setPosition(this.#convertedLocations[0])
        }
        break
      }
      case 'Overlay.Circle': {
        this.#center = this.#overlay.obj.getCenter()
        this.#radius = this.#overlay.obj.getRadius()
        const area = this.#circleArea(this.#radius)
        if (area) {
          this.#remarks.setText('区域面积: ' + area)
        }
        if (area) {
          this.#remarks.setPosition(this.#center)
        }
        break
      }
    }
  }

  #setEditor = () => {
    switch (this.#overlayType) {
      case 'Overlay.Polygon': {
        this.editor = new AMap.PolyEditor(this.#map, this.#overlay.obj)
        this.editor.on('adjust', (e: any) => {
          this.#convertedLocations = e.target.getPath().map(function (location: any) {
            return [location.lng, location.lat]
          })
          this.#remarks.setText('区域面积: ' + this.#ringArea(this.#convertedLocations))
          this.#remarks.setPosition(this.#convertedLocations[0])
        })
        break
      }
      case 'Overlay.Polyline': {
        this.editor = new AMap.PolyEditor(this.#map, this.#overlay.obj)
        break
      }
      case 'Overlay.Rectangle': {
        this.editor = new AMap.RectangleEditor(this.#map, this.#overlay.obj)
        this.editor.on('adjust', (e: any) => {
          this.#convertedLocations = e.target.getPath().map(function (location: any) {
            return [location.lng, location.lat]
          })
          this.#remarks.setText('区域面积: ' + this.#ringArea(this.#convertedLocations))
          this.#remarks.setPosition(this.#convertedLocations[0])
        })
        break
      }
      case 'Overlay.Circle': {
        this.editor = new AMap.CircleEditor(this.#map, this.#overlay.obj)
        this.editor.on('adjust', (e: any) => {
          this.#center = e.target.getCenter()
          this.#radius = e.target.getRadius()
          this.#remarks.setText('区域面积: ' + this.#circleArea(this.#radius))
          this.#remarks.setPosition(this.#center)
        })
      }
    }
  }

  #setEvents = () => {
    // 绑定左键事件：编辑器的打开和关闭
    this.#overlay.obj.on('click', () => {
      if (this.editor) {
        this.editor.close()
      }
      this.#handleOverlayEditor = !this.#handleOverlayEditor
      if (this.#handleOverlayEditor) {
        this.editor.open()
      } else {
        this.editor.close()
      }
    })
    // 绑定右键事件：1.控制标签显示; 2.打开右键菜单
    this.#overlay.obj.on('rightclick', (e: any) => {
      // if (!this.#remarkShow) {
      //   this.#remarks.show()
      //   this.#remarkShow = true
      // } else {
      //   this.#remarks.hide()
      //   this.#remarkShow = false
      // }
      // console.log('this.#overlay.obj: ', this.#overlay.obj.getPosition)
      this.#contextMenu.open(this.#map, e.lnglat)
    })
  }

  #hideRemarks = () => {
    this.#remarks.hide()
    this.#contextMenu.close()
  }

  #showRemarks = () => {
    this.#remarks.show()
    this.#contextMenu.close()
  }

  #setContextMenu = () => {
    // 绑定右键菜单事件
    // 1.右键删除
    // 2.右键设置属性
    // 3.右键打开或关闭标签
    this.#contextMenu.addItem(
      '设置属性...',
      () => {
        console.log('弹出设置属性对话框')
      },
      0
    )
    // this.#contextMenu.addItem('隐藏标签', this.#hideRemarks, 1)
    // this.#contextMenu.addItem('显示标签', this.#showRemarks, 2)
    this.#contextMenu.addItem('删除覆盖物', () => {
      this.destructor()
      this.#contextMenu.close()
    })
    this.#contextMenu.on('open', () => {
      // console.log('open context menu')
      console.log('show: ', this.#remarkShow)
      if (this.#remarkShow) {
        if (!this.#hideRemark) {
          this.#contextMenu.addItem('隐藏标签', this.#hideRemarks, 1)
        }
        this.#contextMenu.removeItem('显示标签', this.#showRemarks)
        this.#remarkShow = false
      } else {
        if (this.#showRemark) {
          this.#contextMenu.addItem('显示标签', this.#showRemarks, 2)
        }
        this.#contextMenu.removeItem('隐藏标签', this.#hideRemarks)
        this.#remarkShow = true
      }
      this.#hideRemark = !this.#hideRemark
      this.#showRemark = !this.#showRemark
    })
    this.#contextMenu.on('close', () => {
      // console.log('close context menu')
    })
  }

  #runMain = () => {
    this.#setRemarks()
    // this.#remarks.on('rightclick',()=>{this.#remarks.hide()})
    if (this.#remarks) {
      this.#map?.add(this.#remarks)
    }
    this.#setEditor()
    this.#setEvents()
    this.#setContextMenu()
  }

  destructor = () => {
    // console.log('调用析构函数')
    this.editor.close()
    this.#remarks.remove()
    this.#map.remove(this.#overlay.obj)
  }
}

export default OverlayWithRemarks
